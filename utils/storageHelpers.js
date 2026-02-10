// utils/storageHelpers.js

/**
 * Clear both sessionStorage and localStorage for the current origin.
 * This is critical for tests affected by BUG-001 (storage rehydration / "zombie user").
 *
 * Note:
 * - Must be executed after we have a page on the same origin (e.g., after page.goto(baseURL)).
 * - Use this before auth-sensitive flows (Remember Me, logout/session checks, etc.).
 */
export async function clearStorages(page) {
  await page.evaluate(() => {
    sessionStorage.clear();
    localStorage.clear();
  });
}

/**
 * Read and parse currentUser from the requested storage type.
 * Returns null if not present or invalid JSON.
 */
export async function getStoredCurrentUser(page, storageType) {
  return page.evaluate((type) => {
    try {
      const storage = type === "local" ? localStorage : sessionStorage;
      const raw = storage.getItem("currentUser");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, storageType);
}

/**
 * Convenience helper: returns both session and local stored users.
 */
export async function getAuthStorageSnapshot(page) {
  const [sessionUser, localUser] = await Promise.all([
    getStoredCurrentUser(page, "session"),
    getStoredCurrentUser(page, "local"),
  ]);

  return { sessionUser, localUser };
}

/**
 * Reads currentUser from sessionStorage and localStorage and safely parses JSON.
 * Returns { sessionUser, localUser, raw } for assertions and debugging (BUG-001).
 */
export async function getCurrentUserFromStorages(page) {
  const { ssRaw, lsRaw } = await page.evaluate(() => ({
    ssRaw: sessionStorage.getItem("currentUser"),
    lsRaw: localStorage.getItem("currentUser"),
  }));

  const safeParse = (raw) => {
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  return {
    sessionUser: safeParse(ssRaw),
    localUser: safeParse(lsRaw),
    raw: { ssRaw, lsRaw },
  };
}
