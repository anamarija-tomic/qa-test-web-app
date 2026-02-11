import { expect } from "@playwright/test";

export class ForgotPasswordPage {
  constructor(page) {
    this.page = page;

    this.email = page.locator("#resetEmail");
    this.emailError = page.locator("#resetEmailError");
    // Security Q/A UI exists on the Forgot Password page,
    // but it cannot be validated end-to-end because Registration does not collect it (BUG-013).
    // Locators are prepared for future end-to-end tests; currently not used because Security Q/A is not implemented in registration
    this.securityQuestion = page.locator("#securityQuestion");
    this.securityAnswer = page.locator("#securityAnswer");

    this.submitBtn = page.locator('button[type="submit"]');

    this.message = page.locator("#forgotPasswordMessage");
  }

  async goto() {
    await this.page.goto("/forgot-password.html");
  }

  async submitResetRequest(email) {
    await this.email.fill(email);
    await this.submitBtn.click();
  }
  // this is for happy testing which is not possible now because we can't test security Q&A (BUG-13)
  //   async expectSuccessMessage() {
  //     await expect(this.message).toContainText(
  //       "Password reset link has been sent to your email!",
  //     );
  //   }

  async notExpectSuccessMessage() {
    //Workaround due to missing submit-level failure feedback (BUG-026)
    await this.page.waitForTimeout(500);
    await expect(this.message).not.toContainText(
      "Password reset link has been sent to your email!",
    );
  }

  async expectEmailValidationErrorVisible() {
    await expect(this.emailError).toBeVisible();
    await expect(this.emailError).toContainText("Invalid email address");
  }
}
