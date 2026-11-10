import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { type Browser, type Page, expect, test } from "@playwright/test";

/**
 * Two partners, two separate browsers (F2, F3). Ada creates the space and
 * invites Bayo with the WhatsApp link; a stranger can't reuse the code;
 * Bayo leaves; Ada keeps the space but it never takes a new partner.
 * Throwaway accounts are created and deleted with the secret key.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;

test.describe("two partners", () => {
  test.skip(!url || !secret, "Supabase keys not available");
  test.setTimeout(120_000);

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
    // Already seen "About me", so login lands straight on Home.
    await admin.from("about_me").insert({ user_id: data.user.id });
    return email;
  }

  async function phone(browser: Browser) {
    const { use } = test.info().project;
    const context = await browser.newContext({ ...use });
    return context.newPage();
  }

  async function logIn(page: Page, email: string) {
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Log in" }).click();
  }

  test.afterAll(async () => {
    for (const id of made) await admin.auth.admin.deleteUser(id);
  });

  test("invite on WhatsApp, join, and leave", async ({ browser }) => {
    const project = test.info().project.name;
    const ada = await person("Ada", project);
    const bayo = await person("Bayo", project);
    const stranger = await person("Efe", project);

    // Ada creates the space and gets her invite.
    const adaPhone = await phone(browser);
    await adaPhone.goto("/login");
    await logIn(adaPhone, ada);
    await adaPhone.waitForURL(/\/home$/);
    await adaPhone
      .getByRole("button", { name: "Create our couple space" })
      .click();
    await adaPhone.waitForURL(/\/invite$/);
    const codeLabel = await adaPhone
      .getByLabel(/^Code \d/)
      .getAttribute("aria-label");
    const code = (codeLabel ?? "").replace(/\D/g, "");
    expect(code).toMatch(/^\d{6}$/);
    const whatsapp = await adaPhone
      .getByRole("link", { name: "Share on WhatsApp" })
      .getAttribute("href");
    const message = decodeURIComponent(
      (whatsapp ?? "").replace("https://wa.me/?text=", ""),
    );
    expect(message).toContain("Ada would love you to join");
    const joinPath = new URL(message.match(/https?:\/\/\S+/)?.[0] ?? "")
      .pathname;
    expect(joinPath).toMatch(/^\/join\/[0-9a-f]{64}$/);

    // Bayo taps the link on his own phone, before logging in.
    const bayoPhone = await phone(browser);
    await bayoPhone.goto(joinPath);
    await expect(
      bayoPhone.getByRole("heading", { name: "Your partner saved you a seat" }),
    ).toBeVisible();
    await bayoPhone
      .getByRole("link", { name: "I already have an account" })
      .click();
    await logIn(bayoPhone, bayo);
    await expect(
      bayoPhone.getByRole("heading", { name: "Join Ada on Tend" }),
    ).toBeVisible();
    await bayoPhone.getByRole("button", { name: "Join Ada" }).click();
    await bayoPhone.waitForURL(/\/home$/);
    await expect(
      bayoPhone.getByRole("heading", { name: "You and Ada" }),
    ).toBeVisible();

    // Ada sees Bayo.
    await adaPhone.goto("/home");
    await expect(
      adaPhone.getByRole("heading", { name: "You and Bayo" }),
    ).toBeVisible();

    // Someone else can't reuse the code.
    const strangerPhone = await phone(browser);
    await strangerPhone.goto("/login");
    await logIn(strangerPhone, stranger);
    await strangerPhone.waitForURL(/\/home$/);
    await strangerPhone.goto("/join");
    await strangerPhone.getByLabel("6-digit code").fill(code);
    await strangerPhone
      .getByRole("button", { name: "Join my partner" })
      .click();
    await expect(
      strangerPhone.getByText("We couldn't find that code."),
    ).toBeVisible();

    // Bayo leaves, after reading what happens.
    await bayoPhone.goto("/settings");
    await bayoPhone.getByRole("link", { name: "Leave couple space" }).click();
    await expect(
      bayoPhone.getByText("Your private things come with you."),
    ).toBeVisible();
    await bayoPhone.getByRole("checkbox").check();
    await bayoPhone
      .getByRole("button", { name: "Leave our couple space" })
      .click();
    await bayoPhone.waitForURL(/\/home$/);
    await expect(
      bayoPhone.getByRole("heading", { name: "Start your couple space" }),
    ).toBeVisible();

    // Ada keeps the space, on her own, and it can't take someone new.
    await adaPhone.goto("/home");
    await expect(
      adaPhone.getByRole("heading", { name: "It's just you here for now" }),
    ).toBeVisible();
    await adaPhone.goto("/invite");
    await adaPhone.waitForURL(/\/home$/);
  });
});
