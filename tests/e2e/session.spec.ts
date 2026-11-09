import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

/**
 * Real sign-in against the Supabase project: creates a throwaway,
 * already-confirmed user with the secret key, logs in through the screens,
 * logs out, checks the phone is wiped, then deletes the user.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;

test.describe("real account", () => {
  test.skip(!url || !secret, "Supabase keys not available");

  const admin = createClient(url ?? "http://x", secret ?? "x", {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  let userId: string | undefined;
  let email = "";
  const password = `Garden-${randomUUID()}`;

  test.beforeEach(async ({}, info) => {
    email = `tend-e2e-${info.project.name}-${Date.now()}@example.com`;
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: "Ada" },
    });
    if (error) throw error;
    userId = data.user.id;
  });

  test.afterEach(async () => {
    if (userId) await admin.auth.admin.deleteUser(userId);
  });

  test("log in, see Home, log out, and the phone is wiped", async ({
    page,
  }) => {
    await page.goto("/home");
    await expect(page).toHaveURL(/\/login/);

    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Log in" }).click();

    await expect(page).toHaveURL(/\/home$/);
    await expect(
      page.getByRole("heading", { name: "Hello, Ada" }),
    ).toBeVisible();

    // Logged-in visitors skip the welcome and login screens.
    await page.goto("/login");
    await expect(page).toHaveURL(/\/home$/);

    // Leave something on the device, then log out.
    await page.evaluate(() => localStorage.setItem("draft", "private words"));
    await page.getByRole("link", { name: "Settings" }).click();
    await expect(page.getByText(`Signed in as ${email}`)).toBeVisible();
    await page.getByRole("button", { name: "Log out" }).click();

    await expect(page).toHaveURL(/\/$/);
    expect(await page.evaluate(() => localStorage.length)).toBe(0);

    await page.goto("/home");
    await expect(page).toHaveURL(/\/login/);
  });
});
