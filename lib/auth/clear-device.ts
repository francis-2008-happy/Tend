/**
 * Removes everything Tend stored on this phone: service-worker caches,
 * local and session storage, and IndexedDB. Called on logout
 * (CLAUDE.md security rule: logout clears all local data).
 */
export async function clearDeviceData() {
  if (typeof caches !== "undefined") {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }

  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {
    // Storage can be blocked (private browsing); nothing to clear then.
  }

  if (typeof indexedDB !== "undefined" && "databases" in indexedDB) {
    const dbs = await indexedDB.databases();
    await Promise.all(
      dbs
        .map((db) => db.name)
        .filter((name): name is string => Boolean(name))
        .map(
          (name) =>
            new Promise<void>((resolve) => {
              const req = indexedDB.deleteDatabase(name);
              req.onsuccess = req.onerror = req.onblocked = () => resolve();
            }),
        ),
    );
  }
}
