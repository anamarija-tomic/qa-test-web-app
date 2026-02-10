import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { DashboardPage } from "../../pages/DashboardPage";
import { registerNewUser } from "../../utils/authHelpers";

test("TC-SEC-001 @defect(BUG-001) — Logout invalidates session and blocks direct dashboard access", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  // Setup: create user in backend
  const { data } = await registerNewUser(page);

  // Login
  await loginPage.goto();
  await loginPage.login(data.email, data.password);

  await loginPage.expectSuccessMessage();
  await loginPage.expectRedirectToDashboard();
  await dashboardPage.expectLoaded();

  // Logout
  await dashboardPage.logout();
  await expect(page).toHaveURL(/index\.html/);

  // Try direct dashboard access
  await page.goto("/dashboard.html");

  // Expected: should redirect back to login (will FAIL until BUG-001 is fixed)
  await expect(page).toHaveURL(/index\.html/);
});
