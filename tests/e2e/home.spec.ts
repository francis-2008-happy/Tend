import { expect, test } from "@playwright/test";

test("welcome screen loads on a phone", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Tend" })).toBeVisible();
  await expect(page).toHaveTitle("Tend");
  await page.getByRole("link", { name: "Get started" }).click();
  await expect(page).toHaveURL(/\/signup$/);
  await expect(
    page.getByRole("heading", { name: "Let's get you started" }),
  ).toBeVisible();
});

test("the app can be installed: manifest and icons are served", async ({
  request,
}) => {
  const res = await request.get("/manifest.webmanifest");
  expect(res.ok()).toBe(true);
  const manifest = await res.json();
  expect(manifest.name).toBe("Tend");
  expect(manifest.display).toBe("standalone");
  for (const icon of manifest.icons) {
    expect((await request.get(icon.src)).ok(), icon.src).toBe(true);
  }
});

test("offline screen is friendly", async ({ page }) => {
  await page.goto("/~offline");
  await expect(
    page.getByRole("heading", { name: "You're offline" }),
  ).toBeVisible();
});
