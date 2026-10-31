-- Visitor leads, the emails sent to them, and double opt-in for marketing.
-- Safe to run more than once. See supabase/README.md for the deploy order.
--
-- The browser never touches these tables. Writes go through the submit-lead and confirm-lead Edge Functions,
-- which call the functions below with the service key. The only other access is admin read on public.leads.

begin;

-- ——— leads ———
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) between 3 and 254),
  locale text not null check (locale ~ '^[a-z]{2}$'),
  source text not null check (char_length(source) between 1 and 64),          -- first test that brought them here
  sources text[] not null default '{}',                                       -- every test, in order of first use
  marketing_consent boolean not null default false,                           -- the box was ticked; not consent on its own
  marketing_consent_at timestamptz,
  marketing_consent_text text check (char_length(marketing_consent_text) <= 600), -- the exact words shown next to the box
  marketing_confirmed_at timestamptz,                                         -- the confirm link in the email was used
  unsubscribed_at timestamptz,
  -- The single definition of marketing consent: ticked, confirmed by email, not withdrawn since.
  marketing_ok boolean generated always as (marketing_consent and marketing_confirmed_at is not null and unsubscribed_at is null) stored,
  privacy_version text not null check (char_length(privacy_version) between 1 and 32),
  welcome_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists leads_email_lower_key on public.leads (lower(email));
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- ——— a log of every email to a lead: the limits in lead_email_claim read it ———
create table if not exists public.lead_emails (
  id bigint generated always as identity primary key,
  lead_id uuid not null references public.leads (id) on delete cascade,
  source text not null,
  mailbox_hash text not null check (mailbox_hash ~ '^[0-9a-f]{64}$'), -- SHA-256 of the normalised mailbox: a+b@x and a@x are one inbox
  claim_hash text not null unique check (claim_hash ~ '^[0-9a-f]{64}$'), -- the unsubscribe token's hash: ties a send result to its row
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists lead_emails_created_at_idx on public.lead_emails (created_at);
create index if not exists lead_emails_mailbox_idx on public.lead_emails (mailbox_hash, created_at desc);
create index if not exists lead_emails_lead_idx on public.lead_emails (lead_id);

-- ——— confirm and unsubscribe links: only the SHA-256 of a token is stored ———
create table if not exists public.lead_tokens (
  token_hash text primary key check (token_hash ~ '^[0-9a-f]{64}$'),
  lead_id uuid not null references public.leads (id) on delete cascade,
  kind text not null check (kind in ('confirm', 'unsubscribe')),
  expires_at timestamptz,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists lead_tokens_lead_idx on public.lead_tokens (lead_id, kind);

-- ——— rate limits: an HMAC of the IP that changes daily, never the IP itself. Requests and sends use separate hashes ———
create table if not exists public.lead_rate_limits (
  ip_hash text not null,
  window_start timestamptz not null,
  hits integer not null default 1,
  primary key (ip_hash, window_start)
);

-- ——— access ———
alter table public.leads enable row level security;
alter table public.lead_emails enable row level security;
alter table public.lead_tokens enable row level security;
alter table public.lead_rate_limits enable row level security;

revoke all on public.leads, public.lead_emails, public.lead_tokens, public.lead_rate_limits from public, anon, authenticated;
grant select on public.leads to authenticated; -- still needs the admin policy below
grant select, insert, update, delete on public.leads, public.lead_emails, public.lead_tokens, public.lead_rate_limits to service_role;

drop policy if exists "leads admin read" on public.leads;
-- app_metadata only: a user cannot write it. Unlike profiles.role, it does not depend on a table the user can reach.
create policy "leads admin read" on public.leads for select to authenticated using (
  (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- ——— functions (service key only, see the revoke at the end) ———

-- True while this IP hash is inside its limit for the current fixed window.
create or replace function public.lead_rate_hit(p_ip_hash text, p_limit integer, p_window_seconds integer)
returns boolean language plpgsql set search_path = '' as $$
declare
  v_window timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  v_hits integer;
begin
  insert into public.lead_rate_limits as r (ip_hash, window_start) values (p_ip_hash, v_window)
  on conflict (ip_hash, window_start) do update set hits = r.hits + 1
  returning r.hits into v_hits;
  return v_hits <= p_limit;
end $$;

-- Insert or merge by address: created_at, the first source, the name and the locale stay, sources grow.
-- Anyone can type anyone's address, so a later submission must not rewrite what the first one stored.
-- An unticked box changes nothing: it is not a withdrawal, and nobody can wipe someone's consent by submitting their address.
-- A confirmed consent is frozen: its proof cannot be rewritten. Only an unconfirmed or withdrawn one takes new consent fields.
create or replace function public.lead_upsert(
  p_name text, p_email text, p_locale text, p_source text,
  p_marketing boolean, p_marketing_text text, p_privacy_version text, p_client_at timestamptz
) returns table (lead_id uuid, needs_confirm boolean, unsubscribed boolean)
language plpgsql set search_path = '' as $$
declare
  v_at timestamptz := coalesce(p_client_at, now());
begin
  return query
  insert into public.leads as l (name, email, locale, source, sources, marketing_consent, marketing_consent_at, marketing_consent_text, privacy_version)
  values (p_name, lower(p_email), p_locale, p_source, array[p_source], p_marketing,
          case when p_marketing then v_at end, case when p_marketing then p_marketing_text end, p_privacy_version)
  on conflict (lower(email)) do update set
    sources = case when excluded.source = any (l.sources) or cardinality(l.sources) >= 50 then l.sources else l.sources || excluded.source end,
    marketing_consent = case when l.marketing_confirmed_at is null or l.unsubscribed_at is not null then l.marketing_consent or p_marketing else l.marketing_consent end,
    marketing_consent_at = case when p_marketing and (l.marketing_confirmed_at is null or l.unsubscribed_at is not null) then v_at else l.marketing_consent_at end,
    marketing_consent_text = case when p_marketing and (l.marketing_confirmed_at is null or l.unsubscribed_at is not null) then p_marketing_text else l.marketing_consent_text end,
    marketing_confirmed_at = case when p_marketing and l.unsubscribed_at is not null then null else l.marketing_confirmed_at end,
    privacy_version = case when l.marketing_confirmed_at is null or l.unsubscribed_at is not null then excluded.privacy_version else l.privacy_version end,
    updated_at = now()
  returning l.id, p_marketing and l.marketing_confirmed_at is null, l.unsubscribed_at is not null;
end $$;

-- Reserves one email before anything is sent. The lock makes the whole check and the insert atomic, so two requests
-- cannot both pass, and the daily cap cannot overshoot. Everything goes by mailbox, because a+1@x and a+2@x are one inbox.
-- Returns 'claimed', 'claimed_confirm' (this email carries a stored confirm token), 'unsubscribed', 'duplicate' or 'capped'.
create or replace function public.lead_email_claim(
  p_lead_id uuid, p_source text, p_mailbox_hash text, p_daily_cap integer, p_unsubscribe_hash text, p_confirm_hash text
) returns text language plpgsql set search_path = '' as $$
declare
  v_send_confirm boolean;
begin
  perform pg_advisory_xact_lock(hashtext('lead_email_claim'));

  if exists (select 1 from public.leads l where l.id = p_lead_id and l.unsubscribed_at is not null)
    or exists (select 1 from public.lead_emails e join public.leads l on l.id = e.lead_id where e.mailbox_hash = p_mailbox_hash and l.unsubscribed_at is not null) then
    return 'unsubscribed';
  end if;

  -- A tick needs a confirm link, which earlier emails may lack. One unused link per mailbox at a time, so this cannot be used to flood an inbox.
  v_send_confirm := p_confirm_hash is not null and not exists (
    select 1 from public.lead_tokens t
    where t.kind = 'confirm' and t.used_at is null and t.expires_at > now()
      and (t.lead_id = p_lead_id or t.lead_id in (select e.lead_id from public.lead_emails e where e.mailbox_hash = p_mailbox_hash))
  );

  if not v_send_confirm and exists (
    select 1 from public.lead_emails e
    where e.mailbox_hash = p_mailbox_hash and (e.source = p_source or e.created_at > now() - interval '30 days')
  ) then
    return 'duplicate';
  end if;

  if (select count(*) from public.lead_emails where created_at > now() - interval '24 hours') >= p_daily_cap then
    return 'capped';
  end if;

  insert into public.lead_emails (lead_id, source, mailbox_hash, claim_hash) values (p_lead_id, p_source, p_mailbox_hash, p_unsubscribe_hash);
  insert into public.lead_tokens (token_hash, lead_id, kind) values (p_unsubscribe_hash, p_lead_id, 'unsubscribe');
  if v_send_confirm then
    insert into public.lead_tokens (token_hash, lead_id, kind, expires_at) values (p_confirm_hash, p_lead_id, 'confirm', now() + interval '30 days');
    return 'claimed_confirm';
  end if;
  return 'claimed';
end $$;

-- After the send: record it, or undo the claim. The tokens of a failed send must go too: nobody ever received them,
-- and a confirm token left behind would look live and block a real confirm email for 30 days.
create or replace function public.lead_email_done(p_lead_id uuid, p_unsubscribe_hash text, p_confirm_hash text, p_ok boolean)
returns void language plpgsql set search_path = '' as $$
begin
  if p_ok then
    update public.lead_emails set sent_at = now() where claim_hash = p_unsubscribe_hash;
    update public.leads set welcome_sent_at = now() where id = p_lead_id;
  else
    delete from public.lead_emails where claim_hash = p_unsubscribe_hash;
    delete from public.lead_tokens where token_hash in (p_unsubscribe_hash, p_confirm_hash);
  end if;
end $$;

-- Applies a link. Confirm tokens are single use and expire. Unsubscribe tokens keep working, so an old email always
-- does the right thing. Unsubscribing also kills every open confirm link, and a confirm never clears an unsubscribe.
create or replace function public.lead_token_apply(p_token_hash text, p_kind text)
returns table (status text, locale text) language plpgsql set search_path = '' as $$
declare
  v_token public.lead_tokens;
  v_locale text;
begin
  select * into v_token from public.lead_tokens t where t.token_hash = p_token_hash and t.kind = p_kind for update;
  if not found then
    return query select 'invalid'::text, null::text;
    return;
  end if;
  select l.locale into v_locale from public.leads l where l.id = v_token.lead_id;

  if p_kind = 'unsubscribe' then
    update public.leads set marketing_consent = false, unsubscribed_at = coalesce(unsubscribed_at, now()), updated_at = now() where id = v_token.lead_id;
    update public.lead_tokens t set used_at = now() where t.lead_id = v_token.lead_id and (t.kind = 'confirm' and t.used_at is null or t.token_hash = p_token_hash);
    return query select 'unsubscribed'::text, v_locale;
    return;
  end if;

  if v_token.used_at is not null then
    return query select 'used'::text, v_locale;
    return;
  end if;
  if v_token.expires_at < now() then
    return query select 'expired'::text, v_locale;
    return;
  end if;
  update public.leads set marketing_confirmed_at = now(), updated_at = now() where id = v_token.lead_id;
  update public.lead_tokens t set used_at = now() where t.lead_id = v_token.lead_id and t.kind = 'confirm' and t.used_at is null;
  return query select 'confirmed'::text, v_locale;
end $$;

-- Hourly clean-up. The privacy page promises these exact periods, so change both together.
create or replace function public.lead_purge()
returns void language plpgsql set search_path = '' as $$
begin
  delete from public.lead_rate_limits where window_start < now() - interval '24 hours';
  delete from public.lead_tokens where kind = 'confirm' and expires_at < now() - interval '30 days';
  delete from public.leads where not marketing_ok and updated_at < now() - interval '24 months';
  delete from public.waitlist where created_at < now() - interval '24 months';
  delete from public.events where created_at < now() - interval '14 months';
end $$;

revoke all on function public.lead_rate_hit(text, integer, integer) from public, anon, authenticated;
revoke all on function public.lead_upsert(text, text, text, text, boolean, text, text, timestamptz) from public, anon, authenticated;
revoke all on function public.lead_email_claim(uuid, text, text, integer, text, text) from public, anon, authenticated;
revoke all on function public.lead_email_done(uuid, text, text, boolean) from public, anon, authenticated;
revoke all on function public.lead_token_apply(text, text) from public, anon, authenticated;
revoke all on function public.lead_purge() from public, anon, authenticated, service_role;

grant execute on function public.lead_rate_hit(text, integer, integer) to service_role;
grant execute on function public.lead_upsert(text, text, text, text, boolean, text, text, timestamptz) to service_role;
grant execute on function public.lead_email_claim(uuid, text, text, integer, text, text) to service_role;
grant execute on function public.lead_email_done(uuid, text, text, boolean) to service_role;
grant execute on function public.lead_token_apply(text, text) to service_role;

commit;

-- ——— schedule, outside the transaction: cron.schedule replaces a job of the same name ———
create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule('lead-purge-hourly', '17 * * * *', 'select public.lead_purge()');
