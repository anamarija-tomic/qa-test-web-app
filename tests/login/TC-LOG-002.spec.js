import { test } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { registerNewUser } from "../../utils/authHelpers";

test.describe("TC-LOG-002 — Login rejects invalid credentials", () => {
  test("blocks login for existing email + wrong password", async ({ page }) => {
    const loginPage = new LoginPage(page);

    const { data } = await registerNewUser(page);

    await loginPage.goto();
    await loginPage.login(data.email, "WrongPassword123");

    await loginPage.expectInvalidCredentialsMessage();
    await loginPage.expectNotRedirectedToDashboard();
  });

  test("blocks login for non-existing email", async ({ page }) => {
    const loginPage = new LoginPage(page);

    const nonExistingEmail = `non.existing${Date.now()}@example.com`;

    await loginPage.goto();
    await loginPage.login(nonExistingEmail, "AnyPassword123");

    await loginPage.expectInvalidCredentialsMessage();
    await loginPage.expectNotRedirectedToDashboard();
  });
});
