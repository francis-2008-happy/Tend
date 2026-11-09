import { afterEach, describe, expect, it, vi } from "vitest";
import { clearDeviceData } from "@/lib/auth/clear-device";

describe("clearDeviceData (logout)", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("deletes every cache, local storage, session storage and IndexedDB", async () => {
    const deleted: string[] = [];
    vi.stubGlobal("caches", {
      keys: async () => [
        "tend-static",
        "tend-public-images",
        "serwist-precache",
      ],
      delete: async (key: string) => deleted.push(key),
    });
    const deletedDbs: string[] = [];
    vi.stubGlobal("indexedDB", {
      databases: async () => [{ name: "tend-drafts" }],
      deleteDatabase: (name: string) => {
        deletedDbs.push(name);
        const req: Record<string, () => void> = {};
        queueMicrotask(() => req.onsuccess?.());
        return req;
      },
    });
    localStorage.setItem("draft", "private words");
    sessionStorage.setItem("tab", "connect");

    await clearDeviceData();

    expect(deleted).toEqual([
      "tend-static",
      "tend-public-images",
      "serwist-precache",
    ]);
    expect(deletedDbs).toEqual(["tend-drafts"]);
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
  });
});
