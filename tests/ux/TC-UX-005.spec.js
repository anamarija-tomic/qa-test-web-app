import { test, expect } from "@playwright/test";
import { RegisterPage } from "../../pages/RegisterPage";
import { LoginPage } from "../../pages/LoginPage";
import { ForgotPasswordPage } from "../../pages/ForgotPasswordPage";
import { buildValidRegistrationData } from "../../utils/testData";

test.describe("TC-UX-005 @defect(BUG-014) — Validation feedback visible/readable (cross-page, cross-viewport)", () => {
  test("Register: email validation error is visible", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const data = buildValidRegistrationData({ email: "test" });

    await registerPage.goto();
    await registerPage.fillForm(data);
    await registerPage.submit();

    // Expected: visible error message. Current CSS hides it on mobile -> expected FAIL until BUG-014 is fixed.
    await registerPage.expectEmailValidationErrorVisible();
  });

  test("Login: email validation error is visible", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login("test", "AnyPassword123");

    // Expected: visible error message. Current CSS hides it on mobile -> expected FAIL until BUG-014 is fixed.
    await loginPage.expectEmailValidationErrorVisible();
  });

  test("Forgot Password: email validation error is visible", async ({
    page,
  }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();
    await forgotPasswordPage.submitResetRequest("test");

    // Expected: visible error message. Current CSS hides it on mobile -> expected FAIL until BUG-014 is fixed.
    await forgotPasswordPage.expectEmailValidationErrorVisible();
  });
});
