# Tend progress log

## Current status

**Phase 0 (project setup): complete.**
Next: Phase 1 (design system and app shell), with a small Higgsfield
moodboard first to settle the look.

## 2026-11-09 — Phase 0

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

### Next step

1. Generate a small Higgsfield moodboard (4-6 images) and agree the look.
2. Start Phase 1 in a fresh session (`/clear`, plan mode, Phase 1 prompt).
