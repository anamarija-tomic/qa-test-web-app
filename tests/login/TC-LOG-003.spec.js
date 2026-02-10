// tests/login/TC-LOG-003.spec.js
import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { registerNewUser } from "../../utils/authHelpers";
import {
  clearStorages,
  getAuthStorageSnapshot,
} from "../../utils/storageHelpers";

test.describe("TC-LOG-003 — Remember Me functionality (persistence behavior)", () => {
  test("checked: should persist auth state (expected FAIL until BUG-010 is fixed)", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    // Precondition: create a valid user.
    const { data } = await registerNewUser(page);

    // BUG-001 mitigation: clear storages to avoid picking up a stale/zombie user.
    await page.goto("/");
    await clearStorages(page);

    await loginPage.goto();
    await loginPage.login(data.email, data.password, { rememberMe: true });

    await loginPage.expectSuccessMessage();
    await loginPage.expectRedirectToDashboard();

    // Expected behavior:
    // - If "Remember Me" is checked, the app should persist auth state (e.g., localStorage).
    // Current behavior: checkbox has no effect -> this assertion should FAIL (BUG-010).
    const { sessionUser, localUser } = await getAuthStorageSnapshot(page);

    await expect(sessionUser?.email).toBe(data.email);
    await expect(localUser?.email).toBe(data.email);
  });

  test("unchecked: should not persist auth state (expected FAIL until BUG-010 is fixed) @defect(BUG-010) ", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    const { data } = await registerNewUser(page);

    await page.goto("/");
    await clearStorages(page);

    await loginPage.goto();
    await loginPage.login(data.email, data.password, { rememberMe: false });

    await loginPage.expectSuccessMessage();
    await loginPage.expectRedirectToDashboard();

    // Expected behavior:
    // - Unchecked: auth should be session-only (no localStorage persistence).
    // This may PASS/FAIL depending on implementation; currently the feature is not wired (BUG-010).
    const { sessionUser, localUser } = await getAuthStorageSnapshot(page);

    await expect(sessionUser?.email).toBe(data.email);
    await expect(localUser).toBe(null);
  });
});
