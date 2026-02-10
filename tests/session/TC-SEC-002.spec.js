import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { DashboardPage } from "../../pages/DashboardPage";
import { registerNewUser } from "../../utils/authHelpers";
import { getCurrentUserFromStorages } from "../../utils/storageHelpers";

test("TC-SEC-002 @defect(BUG-001) — New login overwrites previous user auth state (no storage mismatch)", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // Setup: create User A
  const { data: userA } = await registerNewUser(page);

  // Setup: create User B (different user)
  const { data: userB } = await registerNewUser(page);

  // Login as User A
  await loginPage.goto();
  await loginPage.login(userA.email, userA.password);
  await loginPage.expectSuccessMessage();
  await loginPage.expectRedirectToDashboard();
  await dashboardPage.expectLoaded();

  // Logout
  await dashboardPage.logout();
  await expect(page).toHaveURL(/index\.html/);

  // Login as User B
  await loginPage.goto();
  await loginPage.login(userB.email, userB.password);
  await loginPage.expectSuccessMessage();
  await loginPage.expectRedirectToDashboard();
  await dashboardPage.expectLoaded();

  // Refresh / direct access to confirm state remains User B
  await page.reload();
  await dashboardPage.expectLoaded();

  const { sessionUser, localUser } = await getCurrentUserFromStorages(page);

  // Both storages should reflect User B email (or at least should NOT contain User A email)
  expect(sessionUser?.email).toBe(userB.email);
  expect(localUser?.email).toBe(userB.email);

  expect(sessionUser?.email).not.toBe(userA.email);
  expect(localUser?.email).not.toBe(userA.email);
});
