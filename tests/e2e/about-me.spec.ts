import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { type Browser, type Page, expect, test } from "@playwright/test";

/**
 * Phase 3 with two partners (F4, F8): Ada answers About me and shares one
 * answer; Bayo sees only that one; Ada downloads her data; Bayo deletes his
 * account and Ada keeps the space.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

test.describe("about me, privacy and deleting", () => {
  test.skip(!url || !secret || !publishable, "Supabase keys not available");
  test.setTimeout(150_000);

  const admin = createClient(url ?? "http://x", secret ?? "x", {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const password = `Garden-${randomUUID()}`;
  const made: string[] = [];

  async function person(name: string, project: string) {
    const email = `tend-e2e-${name.toLowerCase()}-${project}-${Date.now()}@example.com`;
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: name },
    });
    if (error) throw error;
    made.push(data.user.id);
    return email;
  }

  /** Signs in as someone with the public key, to link the pair quickly. */
  async function as(email: string) {
    const client = createClient(url ?? "", publishable ?? "", {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    await client.auth.signInWithPassword({ email, password });
    return client;
  }

  async function phone(browser: Browser) {
    const { use } = test.info().project;
    const context = await browser.newContext({ ...use, acceptDownloads: true });
    return context.newPage();
  }

  async function logIn(page: Page, email: string) {
    await page.goto("/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Log in" }).click();
  }

  test.afterAll(async () => {
    for (const id of made) await admin.auth.admin.deleteUser(id);
  });

  test("answer privately, share one thing, download, delete", async ({
    browser,
  }) => {
    const project = test.info().project.name;
    const ada = await person("Ada", project);
    const bayo = await person("Bayo", project);

    const adaApi = await as(ada);
    await adaApi.rpc("create_couple");
    const { data: invite } = await adaApi.rpc("create_invite");
    const bayoApi = await as(bayo);
    expect(
      (
        await bayoApi.rpc("redeem_invite", {
          code_or_token: invite?.[0]?.code ?? "",
        })
      ).data,
    ).toBe("joined");

    // Ada's first login opens About me.
    const adaPhone = await phone(browser);
    await logIn(adaPhone, ada);
    await adaPhone.waitForURL(/\/about-me$/);
    await expect(
      adaPhone.getByRole("heading", { name: "Let's get to know you" }),
    ).toBeVisible();
    await adaPhone.getByRole("button", { name: "Let's begin" }).click();

    const pick = async (label: string) =>
      adaPhone.getByRole("button", { name: label, exact: true }).click();
    const next = async () =>
      adaPhone.getByRole("button", { name: "Next" }).click();

    const ask = async (title: string) =>
      expect(adaPhone.getByRole("heading", { name: title })).toBeVisible();
    const skip = async () =>
      adaPhone.getByRole("button", { name: "Skip this one" }).click();

    await ask("What makes you feel most loved?");
    await pick("Time together");
    await next();
    await ask("What feels comfortable to spend on a date?");
    await pick("₦10,000 to ₦30,000");
    await next();
    await ask("When do you usually have time for each other?");
    await skip();
    await ask("Who's at home with you?");
    await pick("Just the two of us");
    await next();
    await ask("What do you enjoy?");
    await pick("Good food");
    await pick("Music");
    await next();
    await ask("Surprises or plans?");
    await skip();
    // iPhone in the browser gets the Home Screen tip.
    const tip = adaPhone.getByRole("heading", {
      name: "Add Tend to your Home Screen",
    });
    await expect(
      adaPhone.getByRole("heading", {
        name: /Add Tend to your Home Screen|What you told us about you/,
      }),
    ).toBeVisible();
    if (await tip.isVisible()) {
      await adaPhone.getByRole("button", { name: "Done" }).click();
    }

    await expect(
      adaPhone.getByRole("heading", { name: "What you told us about you" }),
    ).toBeVisible();
    const budget = adaPhone
      .getByRole("listitem")
      .filter({ hasText: "A comfortable date budget" });
    await budget.getByRole("switch", { name: "Show Bayo" }).click();
    await adaPhone.getByRole("button", { name: "Save and finish" }).click();
    await adaPhone.waitForURL(/\/home$/);

    // Bayo skips for now, then sees only what Ada shared.
    const bayoPhone = await phone(browser);
    await logIn(bayoPhone, bayo);
    await bayoPhone.waitForURL(/\/about-me$/);
    await bayoPhone.getByRole("button", { name: "I'll do this later" }).click();
    await bayoPhone.waitForURL(/\/home$/);
    await bayoPhone.goto("/settings");
    await expect(
      bayoPhone.getByRole("heading", { name: "What Ada shared with you" }),
    ).toBeVisible();
    await expect(bayoPhone.getByText("₦10,000 to ₦30,000")).toBeVisible();
    await expect(bayoPhone.getByText("Time together")).toHaveCount(0);
    await expect(bayoPhone.getByText("Good food")).toHaveCount(0);

    // Ada downloads her data.
    await adaPhone.goto("/settings/privacy");
    await expect(adaPhone.getByText("Seen by: Only you").first()).toBeVisible();
    // The test iPhone browser can't save files, so it reads the same file
    // directly; Android goes through a real download.
    let file;
    if (project === "iphone") {
      const response = await adaPhone.request.get("/settings/privacy/export");
      expect(response.headers()["content-disposition"]).toMatch(
        /attachment; filename="tend-my-data-\d{4}-\d{2}-\d{2}\.json"/,
      );
      file = await response.json();
    } else {
      const [download] = await Promise.all([
        adaPhone.waitForEvent("download"),
        adaPhone.getByRole("link", { name: "Download my data" }).click(),
      ]);
      expect(download.suggestedFilename()).toMatch(
        /^tend-my-data-\d{4}-\d{2}-\d{2}\.json$/,
      );
      file = JSON.parse(readFileSync((await download.path()) ?? "", "utf8"));
    }
    expect(file.about_me.budget_band).toBe("10k_30k");
    expect(file.about_me.love_languages).toEqual(["time"]);
    expect(file.account.email).toBe(ada);
    expect(JSON.stringify(file)).not.toContain(bayo);

    // Bayo deletes his account.
    await bayoPhone.goto("/settings/privacy");
    await bayoPhone.getByRole("link", { name: "Delete my account" }).click();
    await bayoPhone.getByLabel("Type DELETE to confirm").fill("DELETE");
    await bayoPhone
      .getByRole("button", { name: "Delete my account for good" })
      .click();
    await bayoPhone.waitForURL(/\/goodbye$/);
    await logIn(bayoPhone, bayo);
    await expect(
      bayoPhone.getByText("That email and password don't match."),
    ).toBeVisible();

    // Ada keeps the space on her own.
    await adaPhone.goto("/home");
    await expect(
      adaPhone.getByRole("heading", { name: "It's just you here for now" }),
    ).toBeVisible();
  });
});
