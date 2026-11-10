# Tend progress log

## Current status

**Phase 1 complete** (owner logged in on iPhone). **Phase 2 (couple
linking, unlinking, privacy core): complete.** Two-phone
checkpoint passed on 2026-11-10: the owner invited their spouse over
WhatsApp and both phones linked. Brevo email connected the same day.
Owner confirmed a Brevo email arrived and the sign-in code worked.
Next: plan Phase 3 (onboarding, settings and privacy dashboard, faith pack).

Deploy notes: Vercel project `tend` is linked to the GitHub repo, so pushes
to `main` deploy automatically. Vercel holds only the public Supabase URL and
publishable key (the secret key stays local). Supabase `site_url` and
redirect URLs include the Vercel address.

## 2026-11-10 — Phase 2

### Done

- Database migration `supabase/migrations/20261109230634_couples_and_privacy.sql`
  (pushed to the live project): profiles (auto-created on sign-up, existing
  users backfilled), couples, couple_members (one couple per person),
  invites (6-digit code + 64-character link token, 7 days, one use),
  invite_attempts (10 wrong guesses an hour), private_entries (owner only),
  shared_items (couple members only). Row Level Security on every table;
  couples, members and invites change only through database functions
  `create_couple`, `create_invite`, `invite_preview`, `redeem_invite`,
  `leave_couple`.
- Unlinking (owner's decision): the leaver loses access at once and keeps
  their private things; the partner who stays keeps the shared things; a
  space someone left never takes a new partner. The remaining partner can
  start a fresh space from Settings (this clears the old shared things).
- Screens: Home couple card (start / waiting / together / on your own),
  `/invite` (big code, Share on WhatsApp, copy), `/join/<token>` (invited
  welcome for new partners, then "Join <name>"), `/join` (type a code),
  Settings "Your couple space" and `/settings/leave` (explains first).
- Sign-up and log-in keep the invite (`next`) so a new partner lands back on
  the join screen.
- Tests: 37 database security tests (`npx supabase test db`, local Docker),
  74 unit tests, two-partner Playwright test (passes locally and against
  the live database).

### Decisions

- Database work is developed against a local Supabase (Docker Desktop must
  be running): `npx supabase start`, then `npx supabase test db`.
  To run browser tests against it, build with the local URL/keys and set
  `E2E_PORT` (see playwright.config.ts).
- Private profile settings will live in their own owner-only table
  (Phase 3), because partners can read each other's profile row.
- Mutual reveal (privacy level 3) gets its database function with the daily
  question (Phase 4).

### Open issues

- Brevo connected 2026-11-10 (`[auth.email.smtp]` in config.toml, values
  from `.env.local`; push with `supabase config push` after loading the
  `SUPABASE_SMTP_*` vars). Tend templates on, links use `token_hash` so they
  work in any browser, sign-in emails carry a 6-digit code, limit 30/hour.
  Sender is a Gmail address, so early emails may land in spam; a domain fixes
  that later. The storage `vector` setting differs from remote; left alone.
- Deleting an account leaves an empty couple row behind; clean up with
  account deletion (Phase 3, F8).

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
- **Livelier look (after first phone test: "too much green, everything looks
  the same").** Green now only for main buttons and navigation. Each area has
  its own palette colour (Connect rose, Plan terracotta, Us gold, Garden
  sage); Home follows the Higgsfield mockup with solid rose and terracotta
  cards, a time-of-day greeting, a leaf sprig and a garden strip; soft warm
  glow behind every page; small bloom animation on cards. Only tints of the
  section 7 palette were added (docs/decisions/0001-colour-contrast.md).

### Open issues

- **Resolved 2026-11-10 (Brevo).** **Custom email sender needed.** Supabase's free plan blocks Tend's own
  email templates (and so the 6-digit code) while using Supabase's built-in
  sender, and the built-in sender only delivers to project team members a
  few times an hour. Templates are ready in `supabase/templates/`; enable
  them in `supabase/config.toml` and set `NEXT_PUBLIC_EMAIL_CODES_ENABLED`
  once SMTP is set up. Until then: password login, plus emailed sign-in links
  that work in the browser (on iPhone a link opens Safari, not the app).
- Google sign-in (optional in F1) not built yet.
- iPhone (WebKit) browser tests can time out when the whole suite runs in
  parallel against the dev server; they pass when run on their own.
- Richer illustrations (e.g. a Higgsfield leaf sprig and garden landscape)
  could replace the hand-drawn sprig later; costs Higgsfield credits.
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
