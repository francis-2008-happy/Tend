import { describe, expect, it } from "vitest";
import {
  QUESTIONS,
  labelsFor,
  parseAnswer,
  sharingSchema,
} from "@/lib/about-me/options";
import { isInstalled, isIos } from "@/lib/device";

describe("about me answers", () => {
  it("accepts allowed choices and turns single answers into one value", () => {
    expect(parseAnswer("budget_band", ["free"])).toEqual({
      ok: true,
      field: "budget_band",
      value: "free",
    });
    expect(parseAnswer("interests", ["food", "music"])).toMatchObject({
      ok: true,
      value: ["food", "music"],
    });
    expect(parseAnswer("kids", [])).toMatchObject({ ok: true, value: null });
  });

  it("turns down anything outside the list, or too many choices", () => {
    expect(parseAnswer("budget_band", ["millions"]).ok).toBe(false);
    expect(parseAnswer("budget_band", ["free", "under_10k"]).ok).toBe(false);
    expect(parseAnswer("love_languages", ["words", "time", "gifts"]).ok).toBe(
      false,
    );
    expect(parseAnswer("user_id", ["x"]).ok).toBe(false);
  });

  it("only shares known answers", () => {
    expect(sharingSchema.safeParse(["budget_band"]).success).toBe(true);
    expect(sharingSchema.safeParse(["email"]).success).toBe(false);
  });

  it("reads answers back in plain words, with naira", () => {
    expect(labelsFor("budget_band", "10k_30k")).toEqual(["₦10,000 to ₦30,000"]);
    expect(labelsFor("love_languages", ["time"])).toEqual(["Time together"]);
    expect(labelsFor("kids", null)).toEqual([]);
  });

  it("frames every question as being about you, with a photo", () => {
    for (const q of QUESTIONS) {
      expect(q.title).not.toMatch(/partner|spouse|husband|wife/i);
      expect(q.photo).toMatch(/^\/photos\/.+\.webp$/);
      expect(q.photoAlt.length).toBeGreaterThan(10);
    }
  });
});

describe("iPhone home screen tip", () => {
  it("knows iPhones and iPads, not Android", () => {
    expect(
      isIos("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)"),
    ).toBe(true);
    expect(isIos("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)", 5)).toBe(
      true,
    );
    expect(isIos("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)", 0)).toBe(
      false,
    );
    expect(isIos("Mozilla/5.0 (Linux; Android 14; Pixel 7)")).toBe(false);
  });

  it("skips the tip once Tend is on the home screen", () => {
    expect(isInstalled(true)).toBe(true);
    expect(isInstalled(false, true)).toBe(true);
    expect(isInstalled(false)).toBe(false);
  });
});
