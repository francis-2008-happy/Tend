import { describe, expect, it } from "vitest";
import {
  codeSchema,
  fieldErrorsFrom,
  logInSchema,
  newPasswordSchema,
  safeNextPath,
  signUpSchema,
} from "@/lib/auth/schemas";

describe("sign-up rules", () => {
  it("accepts a valid sign-up and tidies the email", () => {
    const r = signUpSchema.safeParse({
      name: " Tolu ",
      email: " Tolu@Example.com ",
      password: "garden123",
    });
    expect(r.success).toBe(true);
    expect(r.data).toEqual({
      name: "Tolu",
      email: "tolu@example.com",
      password: "garden123",
    });
  });

  it("explains each problem in plain words", () => {
    const r = signUpSchema.safeParse({
      name: "",
      email: "not-an-email",
      password: "short",
    });
    expect(r.success).toBe(false);
    const errors = fieldErrorsFrom(r.error!);
    expect(errors.name).toBe("What should we call you?");
    expect(errors.email).toBe("That email doesn't look quite right.");
    expect(errors.password).toBe("Use at least 8 characters.");
  });
});

describe("login and codes", () => {
  it("asks for a password when it is missing", () => {
    const r = logInSchema.safeParse({ email: "a@b.co", password: "" });
    expect(fieldErrorsFrom(r.error!).password).toBe(
      "Please enter your password.",
    );
  });

  it("only accepts 6-digit codes", () => {
    expect(
      codeSchema.safeParse({ email: "a@b.co", code: "123456" }).success,
    ).toBe(true);
    expect(
      codeSchema.safeParse({ email: "a@b.co", code: "12345" }).success,
    ).toBe(false);
    expect(
      codeSchema.safeParse({ email: "a@b.co", code: "12345a" }).success,
    ).toBe(false);
  });

  it("checks the two new passwords match", () => {
    const r = newPasswordSchema.safeParse({
      password: "garden123",
      confirm: "garden124",
    });
    expect(fieldErrorsFrom(r.error!).confirm).toBe(
      "The two passwords don't match.",
    );
  });
});

describe("safeNextPath", () => {
  it("keeps pages inside Tend", () => {
    expect(safeNextPath("/settings")).toBe("/settings");
  });

  it("never redirects to another website", () => {
    expect(safeNextPath("https://evil.example")).toBe("/home");
    expect(safeNextPath("//evil.example")).toBe("/home");
    expect(safeNextPath("/\\evil.example")).toBe("/home");
    expect(safeNextPath(null)).toBe("/home");
  });
});
