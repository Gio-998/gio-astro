# Supabase: leads, welcome email and double opt-in

Project `gxuqmuvpoiwugtmsfhnt`. This folder holds only the lead work. Older tables and `delete-account` were created in the dashboard and are not here.

The site is a static export, so the browser cannot hold a secret. Two public Edge Functions do the work. They run on Deno with no build step.

| Function | Job |
| --- | --- |
| `submit-lead` | The only write path for leads. Checks Origin, validates, applies the honeypot, rate limit and Turnstile, saves, then sends the welcome email. |
| `confirm-lead` | Double opt-in and unsubscribe. Only a POST changes anything. |

`_shared/lead-rules.ts` is also bundled into the website, so the form and the server apply the same rules.

## Deploy

Order matters: SQL first, then the functions, then the website.

1. **SQL.** Run `migrations/20261031_leads.sql` in the dashboard SQL editor. It is safe to run twice.
2. **Secrets.**
   ```
   supabase secrets set RESEND_API_KEY=re_xxx --project-ref gxuqmuvpoiwugtmsfhnt
   ```
   Use a new Resend key with sending access only. Do not reuse the SMTP password that Supabase Auth uses.
3. **Functions.** From the repo root:
   ```
   supabase functions deploy submit-lead --no-verify-jwt --project-ref gxuqmuvpoiwugtmsfhnt
   supabase functions deploy confirm-lead --no-verify-jwt --project-ref gxuqmuvpoiwugtmsfhnt
   ```
   `config.toml` sets the same thing, so a later deploy without the flag is safe too. With JWT checks on, the form gets a 401 and every lead stays queued on the visitor's device.
4. **Website.** Deploy as usual. No new `NEXT_PUBLIC_` variables.

### Secrets

| Name | Needed | Purpose |
| --- | --- | --- |
| `SUPABASE_URL`, `SUPABASE_SECRET_KEYS` | set by the platform | Database access through `SUPABASE_SECRET_KEYS["default"]`. The same key also keys the IP hash. |
| `RESEND_API_KEY` | yes, for email | Without it leads still save, and no email goes out. |
| `CAPTCHA_SECRET_KEY` | optional | Turnstile secret. Checked only when the browser sends a token. |
| `LEAD_EMAIL_DAILY_CAP` | optional, default 70 | Welcome emails per rolling 24 hours. |

### Check it works

```
curl -i -X POST "https://gxuqmuvpoiwugtmsfhnt.supabase.co/functions/v1/submit-lead" \
  -H "Origin: https://horoscop.si" -H "Content-Type: application/json" \
  -d '{"name":"Test Person","email":"you@example.com","locale":"en","source":"big-five","marketing":true,"marketingText":"Test consent","privacyVersion":"2026-10-31"}'
```

Expect `{"ok":true}`, a row in `public.leads`, and the email with a confirm button. Without the Origin header the answer is 403. Logs are in the dashboard under Edge Functions, and they hold event names only, such as `submit-lead: email_rate_limited`.

## How the email is limited

- One email per address per test (`lead_emails`). The slot is claimed before sending. A failed send frees it.
- Sources outside the allowlist in `_shared/lead-email.ts` share one slot, so an invented source cannot buy more emails.
- Resend's free plan is 100 emails a day, shared with login emails. `LEAD_EMAIL_DAILY_CAP` keeps 30 free so logins keep working. On a higher plan, raise it.
- Over the cap, on a Resend 429, or with no key: the lead saves, the visitor sees the result, and the function logs one line. **That email is not retried.** Those leads show no send date in the admin list, and a ticked box stays unconfirmed.

## Marketing consent

`marketing_ok` is the only field that means consent: box ticked, confirmed by email, not withdrawn. The admin CSV has it, along with `marketing_confirmed_at` and `unsubscribed_at`. Use only `marketing_ok = true` rows for any marketing email.

Email links open `/<lang>/email/` on the website, and one button there posts to `confirm-lead`. A GET never changes anything, because mail scanners open every link in an email and would confirm people who never clicked. Confirm tokens are single use and last 30 days. Unsubscribe links keep working, so an old email always does the right thing. Only SHA-256 hashes of tokens are stored.

## Requests that come in by email

Run these in the SQL editor when someone writes to contact@horoscop.si.

```sql
-- Withdraw marketing consent
update public.leads set marketing_consent = false, unsubscribed_at = now(), updated_at = now() where lower(email) = lower('person@example.com');

-- Erase the lead, its tokens and its email log
delete from public.leads where lower(email) = lower('person@example.com');
```

## Retention

`lead_purge()` runs daily at 03:17 UTC through pg_cron. The privacy page states these periods, so change both together.

| Data | Kept |
| --- | --- |
| Leads without `marketing_ok` | 24 months after the last update |
| IP hashes | 24 hours |
| Expired confirm tokens | 30 days past expiry |
| `waitlist` | 24 months |
| `events` | 14 months |

## Later

- New language: add one entry to `TEXT` and one name per test to `TESTS` in `_shared/lead-email.ts`. Until then it falls back to English.
- After schema changes, regenerate `src/lib/supabase-types.ts`. The `leads` block there was added by hand.
