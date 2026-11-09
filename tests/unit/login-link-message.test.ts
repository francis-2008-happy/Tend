import { describe, expect, it } from "vitest";
import { loginLinkMessage } from "@/app/(auth)/login/login-forms";

describe("messages after an email link", () => {
  it("tells people their email is confirmed when the sign-up link opened in another browser", () => {
    expect(loginLinkMessage("elsewhere", "signup")).toMatch(
      /Your email is confirmed/,
    );
  });

  it("explains a sign-in link that opened outside the app, without calling it expired", () => {
    const message = loginLinkMessage("elsewhere", "signin");
    expect(message).toMatch(/opened outside the Tend app/);
    expect(message).not.toMatch(/expired/);
  });

  it("only says expired when the link really was", () => {
    expect(loginLinkMessage("expired", "signin")).toMatch(/expired/);
    expect(loginLinkMessage(null, null)).toBeNull();
  });
});
