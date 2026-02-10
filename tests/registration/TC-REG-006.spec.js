import { test } from "@playwright/test";
import { RegisterPage } from "../../pages/RegisterPage";
import { buildValidRegistrationData } from "../../utils/testData";

const zipCases = [
  { zipCode: "ABCD", shouldPass: false },
  { zipCode: "12A", shouldPass: false },
  { zipCode: "10000", shouldPass: true },
];

test.describe("TC-REG-006 — ZIP validation (numeric only)", () => {
  for (const tc of zipCases) {
    test(`${tc.shouldPass ? "allows" : "blocks @defect(BUG-006)"} ZIP: ${tc.zipCode}`, async ({
      page,
    }) => {
      const registerPage = new RegisterPage(page);
      const data = buildValidRegistrationData({ zipCode: tc.zipCode });

      await registerPage.goto();
      await registerPage.fillForm(data);
      await registerPage.submit();

      if (tc.shouldPass) {
        await registerPage.expectSuccessMessage();
        await registerPage.expectRedirectToLoginWithRegisteredTrue();
      } else {
        await registerPage.notExpectSuccessMessage();
        await registerPage.expectNotRedirectToLoginWithRegisteredTrue();
        await registerPage.expectZipValidationError();
      }
    });
  }
});
