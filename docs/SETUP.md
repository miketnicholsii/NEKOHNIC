# Setup & Diagnostics

## Required public environment variables
These are required in `.env` (local) and in your hosting provider's environment for the Vite app.

```bash
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>
```

## OAuth feature flags
OAuth buttons are hidden unless explicitly enabled.

```bash
VITE_ENABLE_GOOGLE_OAUTH=false
VITE_ENABLE_GITHUB_OAUTH=false # optional future use
```

> ✅ Set `VITE_ENABLE_GOOGLE_OAUTH=true` only after Google is enabled in Supabase.

## Supabase Edge Function secrets (server-side)
These are required by Supabase Edge Functions and **must** be set in the Supabase project
settings under **Project Settings → Functions → Secrets**.

- `STRIPE_SECRET_KEY` — required for billing-related functions.
- `SUPABASE_SERVICE_ROLE_KEY` — required for privileged DB access in functions.
- `RESEND_API_KEY` — required for transactional email in `contact-submit` and `delete-account`.
- `TURNSTILE_SECRET_KEY` — required to validate Turnstile in `contact-submit`.

## Enabling Google OAuth in Supabase
1. In Supabase, go to **Authentication → Providers**.
2. Enable **Google** and add your OAuth client ID/secret.
3. Add allowed redirect URLs in **Authentication → URL Configuration**.

### Redirect URL expectations
The app uses these redirect destinations for OAuth:
- `https://<domain>/app`
- `https://<domain>/app/onboarding`
- `http://localhost:5173/app`
- `http://localhost:5173/app/onboarding`

> If you use a different host/port in development, add that origin with the `/app` and
> `/app/onboarding` paths.

## Admin diagnostics page
Admins can access **/admin/diagnostics** to verify configuration status.

Admin access is controlled by the `user_roles` table with a row like:

```sql
insert into user_roles (user_id, role)
values ('<supabase-user-id>', 'admin');
```

## Smoke test plan
If you don't have automated tests yet, run this minimal checklist before release:

1. **Login with email/password** works and redirects to `/app`.
2. **Signup with email/password** works and redirects to `/app/onboarding`.
3. **Google OAuth button** only appears when `VITE_ENABLE_GOOGLE_OAUTH=true`.
4. **Admin diagnostics** loads for admin users and is blocked for non-admin users.
