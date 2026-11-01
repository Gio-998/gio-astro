# Supabase: leads, welcome email and double opt-in

Project `gxuqmuvpoiwugtmsfhnt`. This folder holds the lead work and `delete-account`. Older tables were created in the dashboard and are not here.

The site is a static export, so the browser cannot hold a secret. Two public Edge Functions do the work. They run on Deno with no build step.

| Function | Job |
| --- | --- |
| `submit-lead` | The only write path for leads. Checks Origin, validates, applies the honeypot and rate limit, saves, then verifies Turnstile and sends the welcome email. |
| `confirm-lead` | Double opt-in and unsubscribe. Only a POST changes anything. |

`_shared/lead-rules.ts` is also bundled into the website, so the form and the server apply the same rules.

`delete-account` is separate from the lead work. It runs when a signed-in user deletes their account from the account page, and checks their token itself. It reads `SUPABASE_SECRET_KEYS["default"]` and falls back to `SUPABASE_SERVICE_ROLE_KEY` only if that is missing. It first ran from the dashboard, so before deploying this copy look up whether "Verify JWT" is on for it there, and keep the same setting:

```
supabase functions deploy delete-account --project-ref gxuqmuvpoiwugtmsfhnt
```

Add `--no-verify-jwt` if the dashboard has it off. Then delete a throwaway account from the site to confirm the new key works for the admin call.

## Deploy

Order matters: SQL first, then secrets and functions, then the website.

1. **SQL.** Run `migrations/20261031_leads.sql` in the dashboard SQL editor. It is safe to run twice.
2. **Secrets.** All three are required. Without `LEAD_IP_HASH_KEY` the function refuses every lead (they stay queued on the visitor's device). Without either of the other two, leads save but no email goes out.
   ```
   supabase secrets set --project-ref gxuqmuvpoiwugtmsfhnt \
     LEAD_IP_HASH_KEY="$(openssl rand -hex 32)" \
     CAPTCHA_SECRET_KEY=your_turnstile_secret \
     RESEND_API_KEY=re_xxx
   ```
   `CAPTCHA_SECRET_KEY` is the secret of the same Turnstile widget as `NEXT_PUBLIC_CAPTCHA_SITE_KEY`. For `RESEND_API_KEY` use a new key with sending access only, not the SMTP password that Supabase Auth uses.
3. **Functions.** From the repo root:
   ```
   supabase functions deploy submit-lead --no-verify-jwt --project-ref gxuqmuvpoiwugtmsfhnt
   supabase functions deploy confirm-lead --no-verify-jwt --project-ref gxuqmuvpoiwugtmsfhnt
   ```
   `config.toml` sets the same thing, so a later deploy without the flag is safe too. With JWT checks on, the form gets a 401 and every lead stays queued on the visitor's device.
4. **Website.** Deploy as usual with `NEXT_PUBLIC_CAPTCHA_SITE_KEY` set. The lead form uses it whatever the `captcha` admin switch says, because that switch belongs to sign-in.
5. **Admin access.** Reading leads needs `app_metadata.role = 'admin'` in the JWT. `profiles.role` alone is not enough. A change to `app_metadata` applies at the next token refresh or login.
6. **Run the IP header test below.**

### Secrets

| Name | Needed | Purpose |
| --- | --- | --- |
| `SUPABASE_URL`, `SUPABASE_SECRET_KEYS` | set by the platform | Database access through `SUPABASE_SECRET_KEYS["default"]`. |
| `LEAD_IP_HASH_KEY` | yes | Keys the IP hash, and nothing else. Changing it only resets the current rate limits. |
| `CAPTCHA_SECRET_KEY` | yes, for email | Turnstile secret. No pass, no email. |
| `RESEND_API_KEY` | yes, for email | Sends the welcome email. |
| `LEAD_EMAIL_DAILY_CAP` | optional, default 70 | Welcome emails per rolling 24 hours. |

### Check it works

A request without a Turnstile token saves the lead and sends no email, so this is safe to run:

```
curl -i -X POST "https://gxuqmuvpoiwugtmsfhnt.supabase.co/functions/v1/submit-lead" \
  -H "Origin: https://horoscop.si" -H "Content-Type: application/json" \
  -d '{"name":"Test Person","email":"deploy-test@example.com","locale":"en","source":"big-five","marketing":false,"privacyVersion":"2026-10-31"}'
```

Expect `{"ok":true}` and a row in `public.leads`, and in the Edge Function logs `submit-lead: email_skipped_captcha_missing`. Without the Origin header the answer is 403. To test the email, submit the real form on the site. Logs hold event names only. Then remove the row:

```sql
delete from public.leads where email = 'deploy-test@example.com';
```

### IP header test (run once after deploy)

The rate limits read `cf-connecting-ip`, then fall back to `x-real-ip`, then the first entry of `x-forwarded-for`. We don't yet know which of these reach an Edge Function, or whether a client can set them. This test shows both. It deploys a throwaway function that echoes the three headers, sends fake values for all of them, and deletes the function.

```
mkdir -p supabase/functions/ip-header-check
cat > supabase/functions/ip-header-check/index.ts <<'EOF'
Deno.serve((req) => Response.json(Object.fromEntries(["cf-connecting-ip", "x-real-ip", "x-forwarded-for"].map((h) => [h, req.headers.get(h)]))));
EOF
supabase functions deploy ip-header-check --no-verify-jwt --project-ref gxuqmuvpoiwugtmsfhnt
curl -s "https://gxuqmuvpoiwugtmsfhnt.supabase.co/functions/v1/ip-header-check" \
  -H "CF-Connecting-IP: 198.51.100.7" -H "X-Real-IP: 198.51.100.7" -H "X-Forwarded-For: 198.51.100.7"
supabase functions delete ip-header-check --project-ref gxuqmuvpoiwugtmsfhnt
rm -r supabase/functions/ip-header-check
```

Compare the output with your real public IP. `198.51.100.7` is the fake value.

| `cf-connecting-ip` shows | Meaning | Do |
| --- | --- | --- |
| your real IP | Trusted, and it is the header in use. | Nothing. The fallbacks can stay or go. |
| `null` | The code falls back to the next header. | Read the next column the same way. A header showing your real IP is safe. If `x-forwarded-for` shows `198.51.100.7` first and is the one in use, a client can pick its own rate limit bucket: change `clientIp` in `submit-lead/handler.ts` to read the real entry before promoting the site. |
| `198.51.100.7` | The client can set it. | Change `clientIp` before promoting the site. |

If the test leaves `cf-connecting-ip` confirmed, the fallbacks can be removed.

## When a welcome email goes out

The lead is always saved first. It gets an email only if every step below passes. Otherwise the function logs one line and the visitor sees nothing different.

1. **Turnstile passed.** A missing, failed or unverifiable token means no email, so queued retries never send one. Log: `email_skipped_captcha_missing`, `_failed`, `_unavailable`, or `email_skipped_no_captcha_secret`.
2. **`RESEND_API_KEY` is set.** Log: `email_skipped_no_key`.
3. **Not unsubscribed.** Checked for the address and for every address sharing its mailbox, even with the marketing box ticked. Log: `email_skipped_unsubscribed`.
4. **Send bucket.** 3 emails per IP per day, on a hash separate from the request limit of 20 per hour. Log: `email_skipped_send_limit`.
5. **Mailbox limits.** One email per mailbox per test, and none if that mailbox was mailed in the last 30 days. The mailbox is the lowercased address without its `+tag`, and without dots for Gmail. Log: `email_skipped_duplicate`.
6. **Daily cap.** `LEAD_EMAIL_DAILY_CAP`, checked under an advisory lock so it cannot overshoot. Resend's free plan is 100 a day, shared with login emails, so the default keeps 30 free. On a higher plan, raise it. Log: `email_skipped_daily_cap`.

**The exception to step 5:** a ticked box needs a confirm link, which an earlier email may not have carried. If the box is ticked, the lead is unconfirmed, and the mailbox has no unused confirm link, that email skips step 5. Only one unused link can exist per mailbox at a time, so this cannot flood an inbox.

A failed send frees its slot and deletes its tokens. **That email is not retried.** Leads that got no email show no send date in the admin list, and a ticked box stays unconfirmed.

## Marketing consent

`marketing_ok` is the only field that means consent: box ticked, confirmed by email, not withdrawn. The admin CSV has it, along with `marketing_confirmed_at` and `unsubscribed_at`. Use only `marketing_ok = true` rows for any marketing email.

Email links open `/<lang>/email/` on the website, and one button there posts to `confirm-lead`. A GET never changes anything, because mail scanners open every link in an email and would confirm people who never clicked. Confirm tokens are single use and last 30 days. Unsubscribe links keep working, so an old email always does the right thing. Only SHA-256 hashes of tokens are stored.

A later submission never changes the stored name or locale, and never changes the consent fields of a confirmed lead, because anyone can type anyone's address.

An unsubscribe is final for the form: ticking the box again records the tick, but no email goes out, so it can't be confirmed. If someone asks by email to come back, run the SQL below, and they can then tick the box again.

## Requests that come in by email

Run these in the SQL editor when someone writes to contact@horoscop.si.

```sql
-- Withdraw marketing consent
update public.leads set marketing_consent = false, unsubscribed_at = now(), updated_at = now() where lower(email) = lower('person@example.com');

-- Erase the lead, its tokens and its email log
delete from public.leads where lower(email) = lower('person@example.com');

-- They asked to come back: clears the block, and they must tick and confirm again
update public.leads set unsubscribed_at = null, marketing_consent = false, marketing_confirmed_at = null, updated_at = now() where lower(email) = lower('person@example.com');
```

## Retention

`lead_purge()` runs hourly through pg_cron (`17 * * * *`). The privacy page states these periods, so change both together.

| Data | Kept |
| --- | --- |
| Leads without `marketing_ok` | 24 months after the last update |
| IP hashes | about 24 hours |
| Expired confirm tokens | 30 days past expiry |
| `waitlist` | 24 months |
| `events` | 14 months |

## Tests

`tests/lead-sql.test.ts` runs the real migration on PGlite, an in-memory Postgres, with Supabase's auth schema, roles and cron stubbed. It cannot test two connections at once, so it checks that the advisory lock comes first in the claim function rather than proving it under load.

## Later

- New language: add one entry to `TEXT` and one name per test to `TESTS` in `_shared/lead-email.ts`. Until then it falls back to English.
- After schema changes, regenerate `src/lib/supabase-types.ts`. The `leads` block there was added by hand.
