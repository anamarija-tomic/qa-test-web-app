import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { DashboardPage } from "../../pages/DashboardPage";
import { registerNewUser } from "../../utils/authHelpers";
import { clearStorages } from "../../utils/storageHelpers";

test("TC-DASH-003 @defect(BUG-017) — “Last login” shows previous login time (expected FAIL until BUG-017 is fixed)", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  const { data } = await registerNewUser(page);

  // BUG-001A/B mitigation
  await page.goto("/");
  await clearStorages(page);

  // Login #1
  await loginPage.goto();
  await loginPage.login(data.email, data.password);

  await loginPage.expectSuccessMessage();
  await loginPage.expectRedirectToDashboard();
  await dashboardPage.expectLoaded();

  const firstText = await dashboardPage.getLastLoginText();
  await expect(firstText).not.toBe("N/A");

  const firstDate = await dashboardPage.getLastLoginDate();

  // Logout
  await dashboardPage.logout();
  await expect(page).toHaveURL(/index\.html/);

  // Small delay to make the second login distinguishable.
  await page.waitForTimeout(2000);

  // Login #2
  await loginPage.goto();
  await loginPage.login(data.email, data.password);

  await loginPage.expectSuccessMessage();
  await loginPage.expectRedirectToDashboard();
  await dashboardPage.expectLoaded();

  const secondDate = await dashboardPage.getLastLoginDate();
  const diffMs = Math.abs(secondDate.getTime() - firstDate.getTime());

  // Expected: should show previous session time (~same as first login).
  // Current BUG-017: shows current login -> diff will be several seconds.
  await expect(diffMs).toBeLessThanOrEqual(2000);
});
