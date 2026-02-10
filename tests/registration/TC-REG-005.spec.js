import { test } from "@playwright/test";
import { RegisterPage } from "../../pages/RegisterPage";
import { buildValidRegistrationData } from "../../utils/testData";

const phoneCases = [
  { phone: "abcXYZ", shouldPass: false },
  { phone: "12ab34", shouldPass: false },
  { phone: "!!!!", shouldPass: false },
  { phone: "123", shouldPass: false },
  { phone: "+385/91-123 4567", shouldPass: true },
  { phone: "+385 91 123 4567", shouldPass: true },
];

test.describe("TC-REG-005 — Phone validation (allowed characters only)", () => {
  for (const tc of phoneCases) {
    test(`${tc.shouldPass ? "allows" : "blocks @defect(BUG-005)"} phone: ${tc.phone}`, async ({
      page,
    }) => {
      const registerPage = new RegisterPage(page);
      const data = buildValidRegistrationData({ phone: tc.phone });

      await registerPage.goto();
      await registerPage.fillForm(data);
      await registerPage.submit();

      if (tc.shouldPass) {
        await registerPage.expectSuccessMessage();
        await registerPage.expectRedirectToLoginWithRegisteredTrue();
      } else {
        await registerPage.notExpectSuccessMessage();
        await registerPage.expectNotRedirectToLoginWithRegisteredTrue();
        await registerPage.expectPhoneValidationError();
      }
    });
  }
});
