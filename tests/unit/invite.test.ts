import { describe, expect, it } from "vitest";
import {
  REDEEM_MESSAGES,
  inviteLink,
  inviteMessage,
  isInviteToken,
  joinCodeSchema,
  redeemMessage,
  spacedCode,
  whatsappShareUrl,
} from "@/lib/couple/invite";

const token = "a".repeat(64);

describe("partner invites", () => {
  it("builds the join link from the site address", () => {
    expect(inviteLink("https://tend-weld.vercel.app", token)).toBe(
      `https://tend-weld.vercel.app/join/${token}`,
    );
  });

  it("writes a warm WhatsApp message with the link and an easy-to-read code", () => {
    const text = inviteMessage("Ada", "https://x/join/t", "123456");
    expect(text).toContain("Ada would love you to join");
    expect(text).toContain("https://x/join/t");
    expect(text).toContain("123 456");
    expect(whatsappShareUrl(text)).toBe(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
    );
  });

  it("still reads naturally without a name", () => {
    expect(inviteMessage("", "l", "123456")).toMatch(/^I'd love you to join/);
  });

  it("accepts codes typed with a space, and nothing else", () => {
    expect(joinCodeSchema.parse({ code: "123 456" }).code).toBe("123456");
    expect(joinCodeSchema.safeParse({ code: "12345" }).success).toBe(false);
    expect(joinCodeSchema.safeParse({ code: "abcdef" }).success).toBe(false);
  });

  it("only treats 64-character tokens as invite links", () => {
    expect(isInviteToken(token)).toBe(true);
    expect(isInviteToken("123456")).toBe(false);
    expect(isInviteToken("../etc")).toBe(false);
  });

  it("has a kind message for every way joining can go wrong", () => {
    for (const message of Object.values(REDEEM_MESSAGES)) {
      expect(message).not.toMatch(/error|invalid|denied|failed/i);
    }
    expect(redeemMessage("something-new")).toMatch(/try again/);
    expect(spacedCode("654321")).toBe("654 321");
  });
});
