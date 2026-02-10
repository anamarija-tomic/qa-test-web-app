import { test } from "@playwright/test";
import { RegisterPage } from "../../pages/RegisterPage";
import { buildValidRegistrationData } from "../../utils/testData";

const passwordCases = [
  {
    name: "different paswords @defect(BUG-004)",
    password: "Password123",
    confirmPassword: "DiffPassword123",
    shouldPass: false,
  },
  {
    name: "valid",
    password: "Password123",
    confirmPassword: "Password123",
    shouldPass: true,
  },
];

test.describe("TC-REG-004 — Confirm Password must match Password", () => {
  for (const tc of passwordCases) {
    test(`${tc.name} — ${tc.password}`, async ({ page }) => {
      const registerPage = new RegisterPage(page);

      const data = buildValidRegistrationData({
        password: tc.password,
        confirmPassword: tc.confirmPassword,
      });

      await registerPage.goto();
      await registerPage.fillForm(data);
      await registerPage.submit();

      if (tc.shouldPass) {
        await registerPage.expectSuccessMessage();
        await registerPage.expectRedirectToLoginWithRegisteredTrue();
      } else {
        await registerPage.notExpectSuccessMessage();
        await registerPage.expectNotRedirectToLoginWithRegisteredTrue();
        await registerPage.expectConfirmPasswordMismatchError();
      }
    });
  }
});
