import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { DashboardPage } from "../../pages/DashboardPage";
import { registerNewUser } from "../../utils/authHelpers";
import { clearStorages } from "../../utils/storageHelpers";

test.describe("TC-LOG-003 — Remember Me functionality (persistence behavior)", () => {
  test("Case A (Checked): session persists after browser restart (expected FAIL) @defect(BUG-010)", async ({
    browser,
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Precondition: create a valid user (registration only)
    const { data } = await registerNewUser(page);

    // Clean start (mitigate BUG-001 contamination)
    await page.goto("/");
    await clearStorages(page);

    // Login with Remember Me checked
    await loginPage.goto();
    await loginPage.login(data.email, data.password, { rememberMe: true });

    await loginPage.expectSuccessMessage();
    await loginPage.expectRedirectToDashboard();
    await dashboardPage.expectLoaded();

    // Simulate "close browser and reopen" by starting a new context
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();

    const loginPage2 = new LoginPage(page2);
    const dashboardPage2 = new DashboardPage(page2);

    // Reopen and navigate to Login page (or site root)
    await loginPage2.goto();

    // Expected target behavior: should already be authenticated and land on Dashboard
    // Current app: Remember Me not wired -> likely FAIL (BUG-010)
    await dashboardPage2.expectLoaded();

    await context2.close();
  });

  test("Case B (Unchecked): session does NOT persist after browser restart", async ({
    browser,
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    const { data } = await registerNewUser(page);

    await page.goto("/");
    await clearStorages(page);

    // Login with Remember Me unchecked
    await loginPage.goto();
    await loginPage.login(data.email, data.password, { rememberMe: false });

    await loginPage.expectSuccessMessage();
    await loginPage.expectRedirectToDashboard();
    await dashboardPage.expectLoaded();

    // New context == "reopen browser"
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    const loginPage2 = new LoginPage(page2);

    await loginPage2.goto();

    // Expected target behavior: user should NOT be authenticated; stay on Login
    await expect(page2).toHaveURL(/index\.html/);

    await context2.close();
  });
});
