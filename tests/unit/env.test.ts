import { afterEach, describe, expect, it, vi } from "vitest";
import { getPublicEnv } from "@/lib/env";

describe("getPublicEnv", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("returns the Supabase settings when they are present", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");
    expect(getPublicEnv().NEXT_PUBLIC_SUPABASE_URL).toBe(
      "https://example.supabase.co",
    );
  });

  it("explains what to do when settings are missing", () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "");
    expect(() => getPublicEnv()).toThrow(/\.env\.local/);
  });
});
