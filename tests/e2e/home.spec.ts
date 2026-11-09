import { expect, test } from "@playwright/test";

test("placeholder page loads on a phone", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Tend" })).toBeVisible();
  await expect(page).toHaveTitle("Tend");
});
