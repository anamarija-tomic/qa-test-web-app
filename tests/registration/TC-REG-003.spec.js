import { test } from "@playwright/test";
import { RegisterPage } from "../../pages/RegisterPage";
import { buildValidRegistrationData } from "../../utils/testData";

const passwordCases = [
  {
    name: "too short @defect(BUG-003)",
    password: "Pass12",
    confirmPassword: "Pass12",
    shouldPass: false,
  },
  {
    name: "no uppercase @defect(BUG-003)",
    password: "password123",
    confirmPassword: "password123",
    shouldPass: false,
  },
  {
    name: "no lowercase @defect(BUG-003)",
    password: "PASSWORD123",
    confirmPassword: "PASSWORD123",
    shouldPass: false,
  },
  {
    name: "no number @defect(BUG-003)",
    password: "Password",
    confirmPassword: "Password",
    shouldPass: false,
  },
  {
    name: "valid",
    password: "Password123",
    confirmPassword: "Password123",
    shouldPass: true,
  },
];

test.describe("TC-REG-003 — Password policy enforcement", () => {
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
        await registerPage.expectPasswordValidationError();
      }
    });
  }
});
