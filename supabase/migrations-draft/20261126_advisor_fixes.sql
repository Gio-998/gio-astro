-- =====================================================================================================
-- DRAFT - NOT APPLIED. Do not run without the owner's approval.
-- This folder (supabase/migrations-draft/) is outside supabase/migrations/, so `supabase db push`,
-- `supabase migration up` and the Vercel build never pick it up. To use it later: review, test on a
-- branch database, then move it into supabase/migrations/ or run it by hand.
--
-- Source: Supabase advisors for project gio-astro (gxuqmuvpoiwugtmsfhnt), read on 2026-11-26.
-- Not covered here (dashboard toggle, not SQL): Auth > Attack Protection > "Leaked password protection".
-- =====================================================================================================

begin;

-- 1) extension_in_public: pg_net lives in the public schema.
--    pg_net cannot be moved with ALTER EXTENSION ... SET SCHEMA (it is not relocatable), so it has to be
--    dropped and created again in the `extensions` schema. That briefly removes net.http_post, which the
--    pg_cron job "nightly-rebuild" uses, so run this outside the 23:40 UTC slot and check the job afterwards.
--    The cron command already calls net.http_post(...) through the `net` schema, so it keeps working.
-- drop extension if exists pg_net;
-- create extension if not exists pg_net with schema extensions;
--    (Left commented on purpose: verify the cron job body on a branch database first.)

-- 2) anon/authenticated_security_definer_function_executable: get_challenge / submit_challenge.
--    Both are SECURITY DEFINER with search_path = '' and are gated by a secret challenge code, so they are
--    not open reads. The current site (master) never calls them (no .rpc() in src/), so the safe default is
--    to take EXECUTE away from the public API roles and keep it for service_role (server-side only).
--    If the challenge flow is brought back for guests, grant EXECUTE to anon again instead.
revoke execute on function public.get_challenge(text) from public, anon, authenticated;
revoke execute on function public.submit_challenge(text, text, jsonb, boolean) from public, anon, authenticated;
grant execute on function public.get_challenge(text) to service_role;
grant execute on function public.submit_challenge(text, text, jsonb, boolean) to service_role;

-- 3) auth_rls_initplan on public.leads, policy "leads admin read".
--    Current: (( SELECT ((auth.jwt() -> 'app_metadata') ->> 'role')) = 'admin')
--    The linter wants auth.jwt() itself wrapped in a sub-select so it is evaluated once per query.
drop policy if exists "leads admin read" on public.leads;
create policy "leads admin read" on public.leads
  for select to authenticated
  using ((((select auth.jwt()) -> 'app_metadata') ->> 'role') = 'admin');

commit;

-- 4) unused_index (INFO only). Recommendation: keep all four for now.
--    feature_flags_updated_by_idx      (feature_flags.updated_by)      - covers a foreign key; dropping it brings back the "unindexed foreign key" lint.
--    friend_invite_accepts_friend_idx  (friend_invite_accepts.friend_id) - covers a foreign key, same reason.
--    affiliate_applications_status_created_idx (status, created_at desc) - admin list; tiny table, unused only because traffic is low.
--    leads_created_at_idx              (leads.created_at desc)         - backs the admin lead list (order by created_at desc); unused only because the list is rarely opened; keep.
--    If affiliate_applications_status_created_idx is still unused after real traffic, drop it with:
-- drop index if exists public.affiliate_applications_status_created_idx;

-- 5) rls_enabled_no_policy (INFO): lead_emails, lead_rate_limits, lead_tokens have RLS on and no policies.
--    That is intended: only the edge functions (service_role) touch them. No change.
