# Tend progress log

## Current status

**Phase 1 (design system, app shell, accounts): built, tested and live at
https://tend-weld.vercel.app. Waiting on the owner's phone test
(checkpoint).** Then: set up a custom email sender before Phase 2.

Deploy notes: Vercel project `tend` is linked to the GitHub repo, so pushes
to `main` deploy automatically. Vercel holds only the public Supabase URL and
publishable key (the secret key stays local). Supabase `site_url` and
redirect URLs include the Vercel address.

## 2026-11-09 — Phase 1

### Done

- Design system from plan section 7: colour tokens (light + dark, follows
  the phone's setting), Fraunces + Inter served from Tend itself, 44px tap
  targets, rounded soft cards, reduced-motion respected. Contrast rules in
  `docs/decisions/0001-colour-contrast.md`.
- App icon generated with Higgsfield (`design/higgsfield/06-app-icon.svg`),
  exported to phone icon sizes and used as the in-app sprig mark.
- Screens: welcome, sign up, log in (password or emailed link), forgot and
  reset password, check email; signed-in shell with the 5-tab bottom nav;
  Home, Connect, Plan, Us, Garden (gentle "coming soon" content), Settings
  with log out. Higgsfield garden art used on welcome and Garden.
- Installable app (Serwist): manifest, icons, offline screen. The service
  worker only stores public files; signed-in pages and Supabase data are
  never cached. Logout wipes caches, local/session storage and IndexedDB.
- Accounts with Supabase Auth through server actions with Zod checks; error
  messages never reveal whether an email has an account; `proxy.ts` keeps
  sessions fresh and sends signed-out visitors to log in.
- Supabase live settings updated (with approval): 8-character passwords,
  recent login needed to change a password, 6-digit email codes, localhost
  login links allowed.
- Tests: 50 unit tests (form rules, navigation, logout wipe, tone check
  that fails on guilt/score words) and 18 browser tests on Android and
  iPhone sizes, including a real sign-in → Home → log out → device wiped run
  with a throwaway account. Lint, typecheck and production build pass.

### Decisions

- Kept Next 16 "Cache Components": screens that read the login sit behind a
  loading boundary, and the session check is always per request.
- Removed the five unused Next.js sample images from `public/`.

### Open issues

- **Custom email sender needed.** Supabase's free plan blocks Tend's own
  email templates (and so the 6-digit code) while using Supabase's built-in
  sender, and the built-in sender only delivers to project team members a
  few times an hour. Templates are ready in `supabase/templates/`; enable
  them in `supabase/config.toml` and set `NEXT_PUBLIC_EMAIL_CODES_ENABLED`
  once SMTP is set up. Until then: password login, plus emailed sign-in links
  that work in the browser (on iPhone a link opens Safari, not the app).
- Google sign-in (optional in F1) not built yet.
- After deploying, add the Vercel address to `site_url` /
  `additional_redirect_urls` in `supabase/config.toml` and push.

## 2026-11-09 — Phase 0 (complete)

## 2026-11-09 — Phase 0 (complete)

### Done

- Saved the plan as `docs/PLAN.md` and the project rules as `CLAUDE.md`.
- Created the Next.js app (App Router, TypeScript, Tailwind, ESLint) with a
  calm placeholder page.
- Added shadcn/ui, Prettier, Vitest (unit tests) and Playwright (browser
  tests on Android- and iPhone-sized screens).
- Added the Supabase client code (`lib/supabase/`), local Supabase config
  (`supabase/config.toml`) and the migrations folder.
- Created `.env.example` listing every setting the app will need.
- Created the folders from plan section 5, plus `design/higgsfield/` for
  Higgsfield artwork.
- All checks pass: lint, typecheck, 3 unit tests, 2 phone browser tests,
  production build.

### Decisions

- **Library versions:** every package was installed with npm's `--before`
  option set to 2026-10-26, so nothing is under two weeks old. Key versions:
  Next 16.4.3, React 19.3, Tailwind 4, TypeScript 5 (Next's default; the new
  TypeScript 7 is skipped until Next supports it), Supabase JS 2.118.
- **Higgsfield:** used for visuals only (moodboard, icons, garden art,
  illustrations). The app stays on the stack in plan section 5.
- **AGENTS.md:** created and maintained by Next.js itself; keep it committed.
  `CLAUDE.md` is ours.

- Supabase connected: `.env.local` filled in and verified (URL, publishable
  key and secret key all connect), and the CLI is linked to the cloud
  project. Cloud database has no migrations yet.

### Open issues

- `npm audit` shows 8 moderate warnings in development-only tools; the app's
  own dependencies have none.
- No GitHub repository connected yet.
- Docker Desktop is needed to run Supabase locally (`npm run db:start`);
  not yet confirmed installed.

### Next step (done)

Higgsfield moodboard generated (`design/higgsfield/`), Phase 1 built.
