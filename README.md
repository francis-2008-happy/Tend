# Tend

Tend to each other. An installable web app that helps married couples live
the 2-2-2-2 rule without pressure or guilt.

- Plan: [docs/PLAN.md](docs/PLAN.md)
- Progress: [docs/PROGRESS.md](docs/PROGRESS.md)

## Everyday commands

| Command             | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Start the app at http://localhost:3000        |
| `npm test`          | Run the unit tests                            |
| `npm run test:e2e`  | Run browser tests on phone-sized screens      |
| `npm run lint`      | Check code quality                            |
| `npm run typecheck` | Check types                                   |
| `npm run format`    | Tidy code formatting                          |
| `npm run db:start`  | Start Supabase locally (needs Docker Desktop) |
| `npm run db:new`    | Create a new database migration               |

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in the values.
3. `npm run dev`
