// pages/RegisterPage.js
import { expect } from "@playwright/test";

export class RegisterPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.firstName = page.locator("#firstName");
    this.lastName = page.locator("#lastName");
    this.email = page.locator("#email");
    this.phone = page.locator("#phone");
    this.address = page.locator("#address");
    this.city = page.locator("#city");
    this.zipCode = page.locator("#zipCode");
    this.password = page.locator("#password");
    this.confirmPassword = page.locator("#confirmPassword");
    this.terms = page.locator("#terms");
    this.submitBtn = page.locator('button[type="submit"]');
    this.message = page.locator("#registerMessage");

    this.successMessageText =
      "Registration successful! Redirecting to login...";

    // Field-level error messages.
    // Note: The commented ones do not exist in the test app (missing UI feedback is tracked as  - BUG-008).

    // this.firstNameError = page.locator("#firstNameError");
    // this.lastNameError = page.locator("#lastNameError");
    this.emailError = page.locator("#emailError");
    this.phoneError = page.locator("#phoneError");
    // this.addressError = page.locator("#addressError");
    // this.cityError = page.locator("#cityError");
    this.zipError = page.locator("#zipError");
    this.passwordError = page.locator("#passwordError");
    this.confirmPasswordError = page.locator("#confirmPasswordError");
  }

  async goto() {
    await this.page.goto("/register.html");
  }

  /**
   * Fill the registration form.
   * @param {Object} data
   */
  async fillForm(data) {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.email.fill(data.email);
    await this.phone.fill(data.phone);
    await this.address.fill(data.address);
    await this.city.fill(data.city);
    await this.zipCode.fill(data.zipCode);
    await this.password.fill(data.password);
    await this.confirmPassword.fill(data.confirmPassword);

    if (data.terms) {
      await this.terms.check();
    } else {
      if (await this.terms.isChecked()) {
        await this.terms.uncheck();
      }
    }
  }

  async submit() {
    await this.submitBtn.click();
  }

  async expectSuccessMessage() {
    await expect(this.message).toContainText(this.successMessageText);
  }

  async notExpectSuccessMessage() {
    // Workaround due to missing submit-level failure feedback (BUG-026) and missing validation for some required fields (BUG-008).
    await this.page.waitForTimeout(500);
    await expect(this.message).not.toContainText(this.successMessageText);
  }

  async expectRedirectToLoginWithRegisteredTrue() {
    await this.page.waitForURL(/index\.html\?registered=true/);
  }

  async expectEmailValidationError() {
    await expect(this.emailError).toContainText("Invalid email address");
  }

  async expectEmailValidationErrorVisible() {
    await expect(this.emailError).toBeVisible();
    await expect(this.emailError).toContainText("Invalid email address");
  }

  async expectNotRedirectToLoginWithRegisteredTrue() {
    // Workaround due to missing submit-level failure feedback (BUG-026) and missing validation for some required fields (BUG-008).
    await this.page.waitForTimeout(1500);
    await expect(this.page).not.toHaveURL(/index\.html\?registered=true/);
    await expect(this.page).toHaveURL(/register\.html/);
  }

  // Password message is NOT fully implemented in the app (current message: "Password must be at least 4 characters").
  // We still define a broad assertion to document the bug.
  // Expected examples (future behavior):
  // - "Password must be at least 8 characters"
  // - "Password must contain at least one uppercase letter"
  // - "Password must contain at least one lowercase letter"
  // - "Password must contain at least one number"
  async expectPasswordValidationError() {
    await expect(this.passwordError).toContainText("Password must");
  }

  // Password mismatch message is NOT implemented in the app.
  // We still define the expected message to document the bug.
  async expectConfirmPasswordMismatchError() {
    await expect(this.confirmPasswordError).toContainText(
      "Passwords do not match",
    );
  }

  // Phone message is NOT implemented in the app.
  // We still define the expected message to document the bug.
  async expectPhoneValidationError() {
    await expect(this.phoneError).toContainText("Invalid phone number");
  }

  // ZIP message is NOT implemented in the app.
  // We still define the expected message to document the bug.
  async expectZipValidationError() {
    await expect(this.zipError).toContainText("Invalid ZIP code");
  }

  // Terms message is NOT implemented in the app.
  // We still define the expected message to document the bug.
  async expectTermsRequiredMessage() {
    await expect(this.message).toContainText(
      "You must accept the terms and conditions",
    );
  }
}
