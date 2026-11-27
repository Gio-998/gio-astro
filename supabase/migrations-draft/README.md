# Draft migrations (NOT APPLIED)

Nothing in this folder has been run on any database. The Supabase CLI only reads `supabase/migrations/`,
so these files are never applied by `supabase db push`, `supabase migration up` or a deploy.

- `20261126_advisor_fixes.sql`: fixes for the Supabase advisor warnings of 2026-11-26 (challenge function
  grants, the leads admin policy, notes on pg_net and unused indexes). Read the comments in the file first.
- Leaked password protection is a dashboard switch (Auth > Attack Protection), not SQL.
