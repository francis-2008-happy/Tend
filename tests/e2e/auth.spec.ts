import { expect, test } from "@playwright/test";

test("signed-out visitors are sent to log in, then back where they were going", async ({
  page,
}) => {
  await page.goto("/settings");
  await expect(page).toHaveURL(/\/login\?next=%2Fsettings$/);
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
});

test("login explains missing details kindly", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByText("Please enter your email.")).toBeVisible();
  await expect(page.getByText("Please enter your password.")).toBeVisible();
});

test("wrong password gets a gentle message", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("nobody@example.com");
  await page.getByLabel("Password").fill("not-the-password");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(
    page.getByText("That email and password don't match.", { exact: false }),
  ).toBeVisible();
});

test("sign-up checks the form before sending anything", async ({ page }) => {
  await page.goto("/signup");
  await page.getByLabel("Your first name").fill("Tolu");
  await page.getByLabel("Email").fill("tolu@");
  await page.getByLabel("Password").fill("short");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(
    page.getByText("That email doesn't look quite right."),
  ).toBeVisible();
  await expect(page.getByText("Use at least 8 characters.")).toBeVisible();
});

test("every button and link on the auth screens is at least 44px tall", async ({
  page,
}) => {
  for (const path of ["/", "/login", "/signup", "/forgot-password"]) {
    await page.goto(path);
    for (const el of await page.locator("main button, main a").all()) {
      const box = await el.boundingBox();
      expect(
        box?.height ?? 0,
        `${path}: ${await el.textContent()}`,
      ).toBeGreaterThanOrEqual(44);
    }
  }
});
