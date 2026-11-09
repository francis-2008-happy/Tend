# Tend: Build Plan for the 2-2-2-2 Marriage PWA

Nov 9, 2026 · @Francis Happy

## 1. Project overview

Tend is an installable web app that helps married couples stay close by turning the 2-2-2-2 rule into real shared moments, without pressure or guilt. The whole app is designed and built as one connected product, then tested with real couples before public launch.

**The 2-2-2-2 rule at the heart of the app**

- Every 2 weeks: a date
- Twice a week: intimacy (physical and emotional, never tracked as a number)
- Twice a year: an overnight trip without the kids
- Every 2 years: a multi-night getaway without the kids

**Promise:** Don't just manage your marriage. Enjoy it. Tagline: Tend to each other.

**The core idea:** most apps keep couples staring at a screen. Twofold helps them plan something, put the phone down, do it together, then save the memory. The app wins when the couple enjoys their relationship even while it's closed.

**Who it's for:** married couples at any stage, with or without children. Launch market is Nigeria (naira pricing, WhatsApp-first sharing, extended-family realities), designed to work anywhere.

**The six areas of the app**

| Area | What it does |
| --- | --- |
| Connect | Small daily moments: questions, moods, appreciation, love notes |
| Discover | Keep learning about each other |
| Experience | The four 2's: dates, intimacy support, overnights, getaways |
| Grow | Seasons of life, check-ins, repair after conflict |
| Remember | Shared memories, timeline, year in review |
| Garden | A shared visual garden that grows as the couple connects and never dies |

**Definition of done for the project:** two partners on two different phones can install the app, link accounts, use every feature in this plan, and trust that their private content stays private.

## 2. How to use this plan with Claude Code

Claude Code builds best in small, verified steps with this plan saved inside the project, so it can re-read it at the start of every session. Follow this setup once, then repeat the session loop for each build phase.

**One-time setup**

1. Create an empty folder for the project and open Claude Code in it.
2. Export this doc as Markdown and save it in the project as `docs/PLAN.md`.
3. Copy section 10 of this doc into a file called `CLAUDE.md` at the project root. Claude Code reads this file automatically every session.
4. Create a GitHub repository and connect it, so every finished step is saved and can be rolled back.
5. Create free accounts you will need: Supabase, Vercel, and later Paystack.

**The session loop (repeat for each phase in section 8)**

1. Start fresh: run `/clear` so old context doesn't confuse the new phase.
2. Switch to plan mode (Shift+Tab) and paste that phase's prompt from section 8.
3. Read Claude Code's plan. Ask questions or correct it before approving.
4. Let it build. It should run the tests and the app after each step.
5. Check the result yourself on your phone, then ask it to commit with a clear message.
6. If the session gets long, run `/compact` or finish the phase in a new session.

**Rules to give Claude Code (already included in CLAUDE.md)**

- Always read `docs/PLAN.md` before starting work.
- Build one phase at a time; never skip ahead.
- Ask before deleting files, changing the database structure, or adding a paid service.
- Every database table gets security rules (Row Level Security) in the same step it is created.
- Write tests for anything touching privacy, couple linking or payments.
- Keep a running `docs/PROGRESS.md` log of what was done and what is next.

**Tips for you as the director**

- You don't need to code. Your job is to describe what you want, test it, and say what feels wrong.
- When something breaks, paste the exact error message back to Claude Code.
- Use two real phones (yours and your spouse's or a friend's) to test couple features from early on.
- If Claude Code proposes something that conflicts with section 3, the principles win.

## 3. Product principles (non-negotiable)

Every feature must pass these ten rules; if a design breaks one, the design changes, not the rule.

1. **No guilt, ever.** No broken streaks, no "you haven't connected in 5 days," no falling scores. Returning users see "Welcome back."
2. **Intimacy is never a number.** No counters, quotas, frequency charts or "1 of 2 this week." Intimacy features are opt-in, private and pressure-free.
3. **No scores or competition.** No relationship health score, no leaderboards, no "your partner did it and you didn't."
4. **Skipping is normal.** Every activity has Skip, Later and Not for us.
5. **Equal partners.** Both partners own the couple space equally. One-tap ways to participate so neither partner carries all the effort.
6. **No surveillance.** No online status, no "last seen," no tracking of what a partner did in the app.
7. **Private stays private.** Content never moves from private to shared without an explicit action by its owner.
8. **Discreet by default.** Notifications never reveal sensitive content. Lock-screen text is neutral ("New note from Tolu").
9. **Phones down.** The app's goal is real-world time together; prefer features that lead offline.
10. **Know the limits.** The app is not therapy. Signs of serious distress, coercion or abuse lead to human help, never to an in-app exercise.

**Tone of voice:** warm, playful, mature and encouraging, like a wise friend who knows real life with kids is chaotic. Avoid clinical terms, heavy romance clichés and pushy motivation.

| Instead of | Say |
| --- | --- |
| Complete today's task | Here's a little moment you could share |
| Your streak is broken | Welcome back |
| You missed date night | Fancy planning something together? |
| Relationship health score | Your journey together |

## 4. Feature specification

The app has 46 features across foundations, six areas and premium; each has a "done when" test Claude Code must meet before moving on. Feature IDs (F1, C1…) are used in the build prompts in section 8.

### Foundations

| ID | Feature | What it does | Done when |
| --- | --- | --- | --- |
| F1 | Accounts | Sign up with email (magic link or password) and optional Google | A user can sign up, log in, log out and reset access |
| F2 | Couple linking | One partner creates the couple space and shares an invite link or 6-digit code (via WhatsApp) | Partner 2 joins; both see the same couple space; either can unlink |
| F3 | Unlinking | A partner can leave; their private content leaves with them; shared content rules are explained first | Leaving removes all access instantly and is tested |
| F4 | Onboarding quiz | Each partner answers privately: love languages, budget in naira, free time, kids, interests, surprise vs planned | Answers personalise date ideas; framed as self-reflection |
| F5 | Three privacy levels | Every item is Private to me, Shared with partner, or Mutual reveal | Server rules prevent a partner from reading private items |
| F6 | App lock | Optional PIN or device biometrics (WebAuthn) to open the app; screen blurs when the app loses focus | Lock works on Android Chrome and iOS Safari installed app |
| F7 | Discreet notifications | Web push with neutral wording; quiet hours; per-feature on/off | No notification text contains sensitive words |
| F8 | Settings and privacy dashboard | Shows what is stored, who sees it, export data, delete account | Export produces a file; delete removes data |
| F9 | PWA install and offline | Installable, works offline for viewing plans and memories | Lighthouse PWA checks pass; logged-out users see no cached private data |
| F10 | Faith pack (optional) | Opt-in devotionals and prayers for couples | Off by default; each partner chooses |

### Connect (daily, always optional)

| ID | Feature | What it does | Done when |
| --- | --- | --- | --- |
| C1 | Daily question | One question a day; both answer privately; answers reveal only when both reply | Reveal is enforced on the server, not just hidden in the screen |
| C2 | Emotional weather | Private mood check-in (happy, connected, tired, overwhelmed, need support) | Partner sees only what the owner chooses to share, with a kind suggested response |
| C3 | How can I love you today? | One-tap request: encouragement, listening, practical help, quiet time, time together | Partner gets a neutral notification and can respond in one tap |
| C4 | Thank you for… | Appreciation notes, including invisible household work | Notes save to the shared appreciation wall |
| C5 | Love notes | Write now or schedule for later | Scheduled notes arrive on time |
| C6 | Little habits | Small ideas like a long hug before work or a six-second kiss | Shown as gentle suggestions, never tasks |

### Discover

| ID | Feature | What it does | Done when |
| --- | --- | --- | --- |
| D1 | Understanding Me | Private profile: what makes me feel loved, neglected, supported, what I need when overwhelmed | Owner chooses which answers to share |
| D2 | Unspoken conversations | Guided topics: money, in-laws and extended family, parenting, ambitions, chores, future dreams | Private reflection first, then shared discussion; pause and skip anytime |
| D3 | Little things I noticed | Private vault of gift ideas and partner preferences | Never visible to partner; reminders before birthdays and anniversaries |
| D4 | Couple bucket list | Shared dreams and experiences to try | Both can add, tick off and turn items into plans |

### Experience (the four 2's)

| ID | Feature | What it does | Done when |
| --- | --- | --- | --- |
| E1 | Date generator | Ideas filtered by naira budget (free, low, splurge), setting (home, outdoors, out) and energy level | At least 150 seeded ideas; filters work offline |
| E2 | Date planner | Pick a date and time, take turns as planner, one-tap accept for the other partner | A planned date appears for both with a gentle reminder |
| E3 | Surprise date mode | Planner hides the details; partner sees only time and dress code | Details reveal at the chosen time |
| E4 | Desire Matcher (opt-in) | Each partner privately swipes on intimacy and closeness ideas; only mutual yeses are shown | Unmatched answers are never shown, stored encrypted, and deletable |
| E5 | Overnight planner | Twice-a-year overnight: place, dates, childcare, packing list, countdown | Both see the plan and countdown |
| E6 | Getaway planner | Every-two-years trip: dream board, milestones months ahead | Milestones send gentle reminders |
| E7 | Escape fund | Shared savings goal with progress, in naira (a tracker, not a bank account) | Both can log contributions |
| E8 | Sitter dossier | Kids' routines, allergies, emergency contacts, sent to a sitter or grandparent via WhatsApp | One tap opens WhatsApp with the formatted message |
| E9 | Family support circle | Invite a trusted relative or sitter for childcare scheduling only | Invitees see only childcare requests, nothing else |
| E10 | Memory capture | After any date or trip: optional photo and a line about the best moment | Saves to the timeline and grows the garden |

### Grow

| ID | Feature | What it does | Done when |
| --- | --- | --- | --- |
| G1 | Seasons of life | Couple picks a season: new baby, pregnancy, busy, long distance, illness, grief, rediscovery, growing together | Suggestions and reminders adjust to the season |
| G2 | Low-power mode | One tap pauses all rhythms and dims reminders during hard times | Only supportive prompts show; resume anytime |
| G3 | Weekly check-in | 10-15 minute guide: what went well, what was hard, what I need next week | Can be done together on one phone or separately |
| G4 | Pause and repair | "I need a pause" signal with a timer, calming exercise and repair phrases | Partner receives a kind, neutral notice |
| G5 | Decision space | Work through shared decisions (moving, big purchase, holiday) with each partner's view | Both views shown side by side |
| G6 | Get more help | Gentle pointer to counselling and safety resources | Reachable from settings and from repeated hard check-ins |
| G7 | Optional collections | Themed sets like 30 days of appreciation, with no daily pressure | Missing a day changes nothing |

### Remember

| ID | Feature | What it does | Done when |
| --- | --- | --- | --- |
| R1 | Our Story timeline | All memories, dates, trips and milestones in one scrolling timeline | Photos stored privately, visible only to the couple |
| R2 | Remember when? | Resurfaces past memories ("two years ago today…") | Appears gently on the home screen |
| R3 | Time capsule | Messages to future selves, opened in 6 or 12 months | Locked until the chosen date |
| R4 | Year in review | Annual recap of memories and moments | Generated on the anniversary; shareable as an image only if both agree |
| R5 | Milestones | Celebrate anniversaries, birthdays and personal wins | Reminders a few days before |

### Garden

| ID | Feature | What it does | Done when |
| --- | --- | --- | --- |
| GA1 | Shared garden | Conversations grow flowers, memories grow trees, appreciation brings butterflies, milestones unlock decorations | The garden only ever grows; no wilting or loss |
| GA2 | Garden visits | Tap items to revisit the moment that grew them | Each item links to its memory or note |

### Premium and payments

| ID | Feature | What it does | Done when |
| --- | --- | --- | --- |
| P1 | Tend Plus | One subscription covers both partners: unlimited ideas, full planners, extra packs, advanced garden | Paystack checkout in naira works; both partners unlock |
| P2 | Gift a subscription | Friends or family gift a year to newlyweds or for an anniversary | Gift code redeems correctly |

**Free forever:** linking, daily question, basic date ideas, appreciation, love notes, memories, weekly check-in, basic garden and all privacy features. Never charge for feeling safe or connected.

## 5. Tech stack and architecture

The app is one Next.js web app (installable as a PWA) talking to Supabase for the database, login, files and live updates, hosted on Vercel. This stack is well known to Claude Code, has generous free tiers, and avoids separate iOS and Android apps.

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js (App Router) with TypeScript | One codebase for screens and server logic |
| Styling | Tailwind CSS with design tokens from section 7 | Fast, consistent styling |
| UI parts | shadcn/ui components, restyled | Accessible building blocks |
| PWA | Serwist (service worker) and a web app manifest | Install, offline caching, push |
| Backend | Supabase: Postgres, Auth, Row Level Security, Storage, Realtime, Edge Functions | Database and security rules in one place |
| Data fetching | TanStack Query | Caching and offline-friendly state |
| Validation | Zod | Checks every input on the server |
| Push | Web Push with VAPID keys, sent from a Supabase Edge Function | Works on Android and on iOS once the app is installed |
| Encryption (sensitive features) | libsodium, encrypted on the device before saving | Desire Matcher and private journal unreadable on the server |
| Payments | Paystack (naira, cards, bank transfer); Stripe later for international | Built for Nigeria |
| Sharing | WhatsApp share links (wa.me) | No API approval needed |
| Hosting | Vercel | Simple deploys from GitHub |
| Testing | Vitest (logic), Playwright (two-partner flows) | Catches privacy bugs before users do |
| Analytics | Privacy-friendly, aggregate only (for example PostHog with no personal content) | Measure usage without reading relationships |
| AI (later, optional) | Server-side calls with explicit consent, minimum data | Personalised date ideas |

**Important note for Claude Code:** check the current stable version of each library before installing, and prefer versions released at least two weeks ago.

**Folder structure**

```
tend/
  CLAUDE.md
  docs/            PLAN.md, PROGRESS.md, decisions
  app/             screens (routes) grouped by area
    (auth)/        sign up, log in, invite
    (app)/home, connect, discover, experience, grow, remember, garden, settings
  components/      shared UI parts
  lib/             supabase client, crypto, validation, helpers
  content/         seeded date ideas, questions, conversation topics (JSON)
  supabase/
    migrations/    database tables and security rules
    functions/     push sender, scheduled notes, reveal logic, payments webhook
  public/          icons, manifest, garden art
  tests/           unit and two-partner end-to-end tests
```

**How a request flows:** the phone app sends a request with the user's login token, Supabase checks the Row Level Security rules for that user and couple, and only then returns or saves data. Time-based jobs (scheduled love notes, time capsules, reminders) run as scheduled Edge Functions that send discreet push notifications.

**PWA reality check:** on iPhones, push notifications only work after the user adds the app to the home screen, so onboarding must guide iPhone users through that step. Features should never assume push is available.

## 6. Data model, privacy and security

Privacy is enforced by the database itself (Row Level Security), not just hidden on screen, so even a bug in the app can't show one partner the other's private content. Every table below gets its security rules in the same migration that creates it.

### The three privacy levels

| Level | Who can see it | Examples |
| --- | --- | --- |
| Private to me | Only the owner | Journal, mood check-ins, gift vault, Understanding Me drafts, Desire Matcher swipes |
| Shared with partner | Both partners | Date plans, memories, bucket list, escape fund, appreciation wall |
| Mutual reveal | Each sees the other's answer only after both answer | Daily question, reflection prompts, time capsule |

Rule: content never changes level unless its owner takes a deliberate action, and linking or unlinking a partner never changes existing levels.

### Main tables

| Table | Key fields | Who can access |
| --- | --- | --- |
| profiles | user id, display name, avatar, settings | Owner; partner sees name and avatar |
| couples | couple id, created by, season, anniversary date, plan (free or plus) | Both members |
| couple\_members | couple id, user id, role, joined at | Both members |
| invites | code, couple id, expires at, used at | Creator; redeemed once via a server function |
| private\_entries | owner id, type, content (encrypted for sensitive types), created at | Owner only |
| shared\_items | couple id, type (memory, plan, bucket item, note), content, created by | Both members |
| questions | question id, text, category | Everyone (read only) |
| question\_answers | question id, user id, couple id, answer, answered at | Owner always; partner only after both answered (enforced by a database function) |
| date\_ideas | idea id, title, budget band, setting, energy, season tags | Everyone (read only) |
| plans | couple id, kind (date, overnight, getaway), details, surprise flag, reveal at, status | Both members; surprise details hidden from non-planner until reveal |
| desire\_cards and desire\_swipes | card id; user id, card id, encrypted answer | Swipes owner only; matches computed so only mutual yeses are revealed |
| support\_requests | from user, to user, type, created at, responded at | Both members |
| memories | couple id, plan id, photo path, caption, date | Both members; photos in a private storage bucket |
| fund\_goals and fund\_entries | couple id, target in naira, amounts | Both members |
| sitter\_dossiers | couple id, children details, routines, contacts | Both members; shared outward only as a WhatsApp message |
| circle\_members and childcare\_requests | couple id, invitee, scope (childcare only) | Couple plus invitee, childcare requests only |
| garden\_items | couple id, item type, source item, position, earned at | Both members |
| push\_subscriptions | user id, endpoint, keys | Owner only |
| subscriptions | couple id, provider, status, renews at | Both members read; written only by payments webhook |

### Security requirements

- Row Level Security on every table, with automated tests that try to read another user's private rows and must fail.
- All permission checks happen on the server; the screens never decide who sees what.
- Sensitive content (Desire Matcher, private journal, intimacy-related notes) is encrypted on the device before upload, so the server stores only scrambled data.
- Photos live in a private storage bucket and are served through short-lived signed links.
- Service worker caches never store private content; logging out clears all local caches and storage.
- Push notification text comes from a fixed list of neutral messages; no user content goes into a notification.
- Sessions can be viewed and revoked from settings; optional app lock with PIN or biometrics.
- Encrypted backups, clear retention periods, full data export and verifiable account deletion.
- Payments are confirmed only through Paystack webhooks verified with the secret key, never trusted from the phone.

### Nigerian data protection

The app handles sensitive personal data, so it must comply with the Nigeria Data Protection Act 2023, overseen by the Nigeria Data Protection Commission (NDPC). Before launch:

- [ ] Get a lawyer's review of consent, retention, users' rights and data stored outside Nigeria (Supabase and Vercel servers abroad)
- [ ] Publish a plain-language privacy policy and terms
- [ ] Collect explicit consent for sensitive features and for any AI processing
- [ ] Confirm whether NDPC registration or audits apply at your expected user numbers

## 7. Design system

The app should feel like a beautiful shared journal with a botanical touch, not a productivity dashboard. Claude Code should build these as design tokens (CSS variables and Tailwind theme) in phase 1, so every screen stays consistent.

### Colours

| Token | Light mode | Dark mode | Use |
| --- | --- | --- | --- |
| background | #F8F5EF warm cream | #1E211D | Page background |
| surface | #FFFFFF | #2A2E28 | Cards |
| text | #2C302E soft charcoal | #EDEAE3 | Body text |
| primary | #3D5A4C forest sage | #8FAE96 | Main buttons, navigation |
| accent | #C86446 terracotta | #E08A6E | Highlights, dates and plans |
| tender | #D9B6B2 dusty rose | #B98F8A | Emotional moments, love notes |
| milestone | #D7B875 soft gold | #D7B875 | Milestones, garden rewards |
| muted | #82977B sage | #6F8468 | Secondary text, borders |

Avoid bright reds, neon pinks, corporate blues, and heavy hearts or wedding imagery.

### Typography

- Headings: Fraunces (serif), with Georgia as fallback.
- Interface and body text: Inter or DM Sans, with system sans-serif fallback.
- Minimum body size 16px; generous line height; large tap targets (at least 44px).

### Layout and feel

- Mobile-first, bottom navigation with five tabs: Home, Connect, Plan (Experience), Us (Discover, Grow, Remember), Garden.
- Rounded cards, soft shadows, plenty of breathing room.
- Gentle, short animations; respect the phone's reduce-motion setting.
- Accessible contrast in both light and dark modes; screen-reader labels on every control.
- Works well on modest Android phones and slow networks: small images, lazy loading, offline-first for key screens.

### The garden

- Drawn as illustrated SVG pieces on a gently scrolling landscape.
- Flowers from conversations and daily answers, trees from memories, butterflies from appreciation, paths and benches from trips, special decorations for milestones.
- New items arrive with a small bloom animation. Nothing ever wilts, disappears or shows decline.

### Home screen

One calm screen, not a dashboard: today's question, any support request or note from your partner, the next plan with a countdown, one "Remember when?" memory, and a peek at the garden. Each card can be dismissed.

## 8. Build phases and Claude Code prompts

The complete app is built in 13 phases, each ending with something you can test on your phone. Paste each prompt into Claude Code in plan mode, review its plan, then let it build. Don't start a phase until the previous one passes its checkpoint.

Every prompt assumes `CLAUDE.md` and `docs/PLAN.md` are in place. Feature IDs refer to section 4.

### Phase 0: Project setup

```
Read CLAUDE.md and docs/PLAN.md fully. Set up the project described in section 5: Next.js with TypeScript and App Router, Tailwind, shadcn/ui, ESLint, Prettier, Vitest and Playwright. Create the folder structure from section 5, a .env.example listing every environment variable we will need, and docs/PROGRESS.md. Connect the Supabase project (I will give you the keys) and set up local Supabase migrations. Check current stable library versions before installing. Explain each step in plain language as you go, because I am not a developer.
```

Checkpoint: the app runs locally and shows a placeholder page; tests run and pass.

### Phase 1: Design system and app shell (F1, F9)

```
Build the design system from section 7 as CSS variables and a Tailwind theme, with light and dark mode. Add fonts with fallbacks. Build the app shell: bottom navigation with the five tabs, empty screens for each area, and a calm placeholder home screen. Make it an installable PWA with Serwist: manifest, icons, offline fallback page. Then build accounts (F1) with Supabase Auth: sign up, log in, log out, magic link, password reset. Follow the tone of voice in section 3 for all text.
```

Checkpoint: you can install the app on your phone, sign up and log in, and it looks like the design system.

### Phase 2: Couple linking and privacy core (F2, F3, F5)

```
Build couple linking (F2), unlinking (F3) and the three privacy levels (F5) from sections 4 and 6. Create the profiles, couples, couple_members, invites, private_entries and shared_items tables with Row Level Security in the same migration. Invites use a 6-digit code and a link that can be shared through WhatsApp, expire after 7 days and can be used once, redeemed through a server function. Write automated tests proving a user cannot read another user's private entries or another couple's data. Write a Playwright test with two browser sessions acting as two partners.
```

Checkpoint: on two phones, one partner invites the other through WhatsApp, both join, and the privacy tests pass.

### Phase 3: Onboarding and settings (F4, F8, F10)

```
Build private onboarding (F4) for each partner as a warm, skippable flow: love languages, budget band in naira, free time, kids, interests, surprise vs planned. Frame results as self-reflection, never as a report on the partner. For iPhone users, include a friendly step showing how to add the app to the home screen. Build settings and the privacy dashboard (F8): what is stored, who sees it, data export as a file, and full account deletion. Add the faith pack toggle (F10), off by default, per partner.
```

Checkpoint: both partners complete onboarding, export their data and see the privacy dashboard.

### Phase 4: Connect and notifications (C1-C6, F7)

```
Build the Connect area: daily question with mutual reveal enforced in a database function (C1), emotional weather (C2), How can I love you today (C3), Thank you for notes (C4), love notes with scheduling (C5) and little habits (C6). Seed at least 365 daily questions in content/ as JSON. Then build discreet push notifications (F7): Web Push with VAPID keys, subscriptions table, an Edge Function sender, quiet hours and per-feature toggles. Notification text must come only from a fixed list of neutral messages. Use Supabase Realtime so a partner's answer appears without refreshing.
```

Checkpoint: both partners answer the daily question and see the reveal; a love note scheduled for 5 minutes later arrives as a neutral notification.

### Phase 5: Dates (E1, E2, E3, E10)

```
Build the date generator (E1) with at least 150 seeded ideas tagged by naira budget band, setting, energy and season, filterable offline, personalised by onboarding answers. Include many free and home ideas. Build the date planner (E2) with turn-taking and one-tap accept, surprise date mode (E3) where details stay hidden from the non-planner on the server until the reveal time, and memory capture after a date (E10) with an optional photo in a private storage bucket.
```

Checkpoint: plan a surprise date on one phone and confirm the other phone cannot see the details until the reveal.

### Phase 6: Trips and family logistics (E5-E9)

```
Build the overnight planner (E5), getaway planner with dream board and milestones (E6), escape fund in naira (E7), sitter dossier with a one-tap WhatsApp share using wa.me links (E8), and the family support circle (E9) where invitees can only see and respond to childcare requests. Test the circle permissions as strictly as couple privacy.
```

Checkpoint: send a sitter dossier to WhatsApp, and invite a test relative who sees only childcare requests.

### Phase 7: Sensitive features and app lock (F6, E4)

```
Add on-device encryption with libsodium for sensitive private content, with keys that never reach the server in readable form. Design key backup carefully and explain the trade-offs to me before building. Build the opt-in Desire Matcher (E4): each partner swipes privately, only mutual yeses are revealed, unmatched answers are never shown and can be deleted, and nothing is ever counted or charted. Build the app lock (F6) with PIN and WebAuthn biometrics, plus screen blur when the app loses focus. Make sure logout clears all caches and local storage.
```

Checkpoint: the database shows only scrambled data for Desire Matcher swipes, and the lock works on both phones.

### Phase 8: Discover (D1-D4)

```
Build Understanding Me (D1) with per-answer sharing choices, Unspoken conversations (D2) covering money, in-laws and extended family, parenting, ambitions, chores and future dreams, with private reflection before shared discussion and a pause option on every step. Build the private gift vault with reminders before birthdays and anniversaries (D3) and the shared bucket list that can turn items into plans (D4).
```

Checkpoint: an Understanding Me answer stays hidden until its owner shares it.

### Phase 9: Grow (G1-G7)

```
Build seasons of life (G1) and make date ideas, reminders and suggestions adapt to the chosen season. Build low-power mode (G2) that pauses all rhythms in one tap, the weekly check-in guide (G3), pause and repair (G4), the decision space (G5), the get more help page with counselling and safety resources (G6), and optional collections with no daily pressure (G7). Review every message in this phase against the principles in section 3.
```

Checkpoint: switching to the New baby season changes suggestions; low-power mode silences reminders.

### Phase 10: Remember, Garden and Home (R1-R5, GA1-GA2)

```
Build Our Story timeline (R1), Remember when resurfacing (R2), time capsules locked until their date (R3), year in review generated on the anniversary (R4) and milestones (R5). Build the shared garden (GA1, GA2) as illustrated SVG pieces from section 7, growing from real activity, where nothing ever wilts or disappears, and each item links back to its moment. Then finish the home screen from section 7.
```

Checkpoint: a saved memory grows a tree, and tapping it opens that memory.

### Phase 11: Premium and payments (P1, P2)

```
Add Tend Plus (P1) with Paystack in naira: one subscription unlocks both partners, confirmed only through a verified Paystack webhook. Add gift subscriptions with redeemable codes (P2). Keep everything listed as free forever in section 4 free. Use Paystack test mode until I say otherwise.
```

Checkpoint: a test payment unlocks Plus for both partners; a gift code redeems once.

### Phase 12: Polish, security review and launch prep

```
Do a full review: accessibility (contrast, screen readers, tap sizes), performance on a modest Android phone and slow network, offline behaviour, Lighthouse PWA checks, and a security review of every table's Row Level Security, every server function and every notification text. Fix what you find. Seed final content. Set up production on Vercel with a custom domain, error monitoring and privacy-friendly analytics. Write a short guide for me on how to deploy updates.
```

Checkpoint: the launch checklist in section 9 is complete.

## 9. Testing, couple research and launch

Before public launch, test the finished app with 15 to 20 real couples for at least four weeks and fix what they find uncomfortable or confusing. Their feedback matters more than any feature on this list.

### Who to recruit

Aim for a mix: newlyweds, parents of young children, couples married 10 years or more, couples without children, one or two in a long-distance season, and a range of budgets and faith backgrounds.

### What to ask them

- Which features did you actually use, and which did you ignore?
- Did anything make you feel pressured, judged or uncomfortable?
- Did you trust that your private answers were private?
- Did the app lead to real time together away from the phone?
- What would you pay for, and how much per month in naira?

### Launch checklist

- [ ] All 13 build phases pass their checkpoints
- [ ] Privacy and permission tests pass for every table
- [ ] Tested on Android Chrome and iPhone Safari (installed to home screen)
- [ ] Tested with 15-20 couples for 4+ weeks and feedback addressed
- [ ] Legal review under the Nigeria Data Protection Act done; privacy policy and terms published
- [ ] Final app name checked for domain, trademark and social handles
- [ ] Paystack switched from test to live mode
- [ ] Error monitoring and backups confirmed working
- [ ] Support email and a simple help page live

### Metrics that define success

| Metric | What it tells you |
| --- | --- |
| Couple activation | Did both partners join after the first invite? |
| First shared experience | Did the couple complete a date or memory within 14 days? |
| 30-day and 90-day couple retention | Is the app becoming part of their life? |
| Plans accepted | Are date and trip ideas relevant? |
| Memories saved | Are couples creating real moments? |
| Notification opt-outs | Are reminders becoming annoying? |
| Meaningful connection rate | Share of couples who say the app helped them have a meaningful moment this month (optional survey) |

Never measure success by how much time couples spend inside the app.

## 10. Starter CLAUDE.md

The project's `CLAUDE.md` at the repository root is the live version of this section.
