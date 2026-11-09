# Tend - project instructions for Claude Code

## What this is

Tend is a PWA that helps married couples stay close using the 2-2-2-2 rule
(date every 2 weeks, intimacy twice a week, overnight trip twice a year,
multi-night getaway every 2 years). Full plan: docs/PLAN.md. Read it before any work.

## About me

I am the product owner, not a developer. Explain decisions in plain language,
show me how to test each change on my phone, and tell me when you need keys or accounts.

## How to work

- Read docs/PLAN.md and docs/PROGRESS.md at the start of every session.
- Work on one phase from section 8 at a time. Never skip ahead.
- Plan first, then build in small steps. Run tests and the app after each step.
- Update docs/PROGRESS.md at the end of each session: done, open issues, next step.
- Commit after each working step with a clear message.
- Ask me before: deleting files, changing existing database tables, adding paid services,
  or changing anything in the product principles.
- Check current stable library versions before installing; avoid versions under 2 weeks old.

## Stack

Next.js (App Router) + TypeScript, Tailwind, shadcn/ui, Serwist PWA, Supabase
(Postgres, Auth, RLS, Storage, Realtime, Edge Functions), TanStack Query, Zod,
libsodium for sensitive content, Web Push (VAPID), Paystack, Vercel,
Vitest + Playwright.

## Non-negotiable product rules

1. No guilt: no streaks, no decline messages, no falling scores.
2. Intimacy is never counted, scored, charted or turned into a target.
3. No relationship scores, leaderboards or partner comparisons.
4. Every activity can be skipped or postponed.
5. No online status or tracking of what a partner does in the app.
6. Private content never becomes shared without the owner's explicit action.
7. Notification text comes only from a fixed list of neutral messages.
8. The app is not therapy; serious distress or abuse points to human help.

## Security rules

- Every new table gets Row Level Security in the same migration.
- Permission checks happen on the server, never only in the UI.
- Write tests proving users cannot read other users' private data or other couples' data.
- Sensitive content (Desire Matcher, private journal) is encrypted on the device.
- Never cache private content in the service worker; logout clears all local data.
- Photos go in private storage with short-lived signed URLs.
- Payments are trusted only from verified Paystack webhooks.
- Never commit secrets; use .env and keep .env.example updated.

## Style

- Follow the design tokens and tone of voice in docs/PLAN.md sections 3 and 7.
- Mobile-first, accessible (contrast, labels, 44px tap targets), fast on modest Android phones.
- Prices in naira (NGN). Sharing via WhatsApp links.

## Visual assets (Higgsfield)

- Higgsfield is used for visuals only (moodboards, app icon, garden SVG art,
  illustrations). The app itself stays on the stack above; do not use the
  Higgsfield website builder.
- Generations cost Higgsfield credits: confirm with me before large batches.
- Keep source generations and prompts in design/higgsfield/; ship optimised
  copies in public/. Art must follow section 7 (palette, no hearts or
  wedding imagery, nothing that wilts or shows decline).
