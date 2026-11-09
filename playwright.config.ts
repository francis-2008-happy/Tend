import { loadEnvConfig } from "@next/env";
import { defineConfig, devices } from "@playwright/test";

// Same settings as the app (.env.local), so tests can reach Supabase.
loadEnvConfig(process.cwd());

// Uses your running `npm run dev` on port 3000 if there is one (Next only
// allows one dev server per project), otherwise starts it.
// E2E_PORT points the tests at another copy of the app, e.g. one built
// against the local Supabase database.
const PORT = Number(process.env.E2E_PORT ?? 3000);

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  // Tend is mobile-first, so tests run on phone-sized screens.
  projects: [
    { name: "android", use: { ...devices["Pixel 7"] } },
    { name: "iphone", use: { ...devices["iPhone 14"] } },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
