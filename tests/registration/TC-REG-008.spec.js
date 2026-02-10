import { test } from "@playwright/test";
import { RegisterPage } from "../../pages/RegisterPage";
import { buildValidRegistrationData } from "../../utils/testData";

test.describe("TC-REG-008 — Terms and Conditions must be required", () => {
  test("blocks registration when Terms is unchecked @defect(BUG-009)", async ({
    page,
  }) => {
    const registerPage = new RegisterPage(page);
    const data = buildValidRegistrationData({ terms: false });

    await registerPage.goto();
    await registerPage.fillForm(data);
    await registerPage.submit();

    // Expected behavior (not implemented in app) — this test should FAIL until BUG-009 fixed.
    await registerPage.notExpectSuccessMessage();
    await registerPage.expectNotRedirectToLoginWithRegisteredTrue();
    await registerPage.expectTermsRequiredMessage();
  });

  test("allows registration when Terms is checked", async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const data = buildValidRegistrationData();

    await registerPage.goto();
    await registerPage.fillForm(data);
    await registerPage.submit();

    await registerPage.expectSuccessMessage();
    await registerPage.expectRedirectToLoginWithRegisteredTrue();
  });
});
