import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { registerNewUser } from "../../utils/authHelpers";

test("TC-LOG-001 @smoke — Login with valid credentials (Happy Path)", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);

  // Precondition setup: create user
  const { data } = await registerNewUser(page);

  // Act: login
  await loginPage.goto();
  await loginPage.login(data.email, data.password);

  // Assert: success + redirect to dashboard
  await loginPage.expectSuccessMessage();
  await loginPage.expectRedirectToDashboard();

  // Strong assert: dashboard has userName element
  await expect(page.locator("#userName")).toBeVisible();
});
