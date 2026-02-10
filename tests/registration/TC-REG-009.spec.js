import { test } from "@playwright/test";
import { RegisterPage } from "../../pages/RegisterPage";
import { buildValidRegistrationData } from "../../utils/testData";

const spaces = "               ";

const cases = [
  {
    name: "Email whitespace-only",
    overrides: { email: spaces },
    expect: "emailError",
  },
  {
    name: "Phone whitespace-only",
    overrides: { phone: spaces },
    expect: "phoneError",
  },
  {
    name: "ZIP whitespace-only",
    overrides: { zipCode: spaces },
    expect: "zipError",
  },
  {
    name: "Password whitespace-only",
    overrides: { password: spaces, confirmPassword: spaces },
    expect: "passwordError",
  },

  // fields WITHOUT error spans: assert only that registration is blocked
  {
    name: "First Name whitespace-only",
    overrides: { firstName: spaces },
    expect: "blockedOnly",
  },
  {
    name: "Last Name whitespace-only",
    overrides: { lastName: spaces },
    expect: "blockedOnly",
  },
  {
    name: "City whitespace-only",
    overrides: { city: spaces },
    expect: "blockedOnly",
  },
  {
    name: "Address whitespace-only",
    overrides: { address: spaces },
    expect: "blockedOnly",
  },
];

test.describe("TC-REG-009 — Required fields reject whitespace-only input @defect(BUG-007,BUG-008)", () => {
  for (const tc of cases) {
    test(tc.name, async ({ page }) => {
      const registerPage = new RegisterPage(page);
      const data = buildValidRegistrationData({ ...tc.overrides });

      await registerPage.goto();
      await registerPage.fillForm(data);
      await registerPage.submit();

      await registerPage.notExpectSuccessMessage();
      await registerPage.expectNotRedirectToLoginWithRegisteredTrue();

      if (tc.expect === "emailError")
        await registerPage.expectEmailValidationError();
      if (tc.expect === "phoneError")
        await registerPage.expectPhoneValidationError();
      if (tc.expect === "zipError")
        await registerPage.expectZipValidationError();
      if (tc.expect === "passwordError")
        await registerPage.expectPasswordValidationError();
    });
  }
});
