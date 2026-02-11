import { expect } from "@playwright/test";

export class LoginPage {
  constructor(page) {
    this.page = page;

    this.email = page.locator("#loginEmail");
    this.password = page.locator("#loginPassword");
    this.rememberMe = page.locator("#rememberMe");
    this.submitBtn = page.locator('button[type="submit"]');
    this.message = page.locator("#loginMessage");
    this.emailError = page.locator("#loginEmailError");
  }

  async goto() {
    await this.page.goto("/index.html");
  }

  /**
   * Perform login.
   * @param {string} email
   * @param {string} password
   * @param {{ rememberMe?: boolean }} [options]
   */
  async login(email, password, options = {}) {
    await this.email.fill(email);
    await this.password.fill(password);

    // "Remember Me" is currently a non-functional checkbox (BUG-010),
    // but we still model it as part of the expected user behavior.
    if (options.rememberMe) {
      await this.rememberMe.check();
    } else {
      if (await this.rememberMe.isChecked()) {
        await this.rememberMe.uncheck();
      }
    }

    await this.submitBtn.click();
  }

  async expectSuccessMessage() {
    await expect(this.message).toContainText(
      "Login successful! Redirecting...",
    );
  }

  async expectRedirectToDashboard() {
    await this.page.waitForURL(/dashboard\.html/);
  }

  async expectNotRedirectedToDashboard() {
    // Workaround due to missing submit-level failure feedback (BUG-026)
    await this.page.waitForTimeout(500);
    await expect(this.page).not.toHaveURL(/dashboard\.html/);
  }

  async expectInvalidCredentialsMessage() {
    await expect(this.message).toContainText("Invalid email or password");
  }

  async expectEmailValidationErrorVisible() {
    await expect(this.emailError).toBeVisible();
    await expect(this.emailError).toContainText("Invalid email address");
  }
}
