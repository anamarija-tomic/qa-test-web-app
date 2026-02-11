import { expect } from "@playwright/test";
import { parseLastLoginToDate } from "../utils/dateParsers";

export class DashboardPage {
  constructor(page) {
    this.page = page;

    this.userName = page.locator("#userName");
    this.lastLogin = page.locator("#lastLogin");
    this.logoutBtn = page.locator('button:has-text("Logout")');
  }

  async expectLoaded() {
    await expect(this.userName).toBeVisible();
    await expect(this.page).toHaveURL(/dashboard\.html/);
  }

  async getLastLoginText() {
    return this.lastLogin.innerText();
  }

  async logout() {
    await this.logoutBtn.click();
  }

  /**
   * Convenience method: keeps parsing logic out of tests.
   * If the text format changes, update the parser in utils/dateParsers.js
   */
  async getLastLoginDate() {
    const text = await this.getLastLoginText();
    return parseLastLoginToDate(text);
  }
}
