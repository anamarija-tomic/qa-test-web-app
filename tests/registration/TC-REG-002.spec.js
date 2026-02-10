import { test, expect } from "@playwright/test";
import { RegisterPage } from "../../pages/RegisterPage";
import { buildValidRegistrationData } from "../../utils/testData";

// These inputs should be blocked per spec, but are incorrectly accepted by the current validation (BUG-002).
const buggyAcceptedEmails = new Set([
  "test@com",
  "a@@b.com",
  "hello a@b world",
]);

const invalidEmails = [
  "test",
  "test@",
  "@test.com",
  "test@com",
  "a@@b.com",
  "hello a@b world",
];

test.describe("TC-REG-002 — Registration email validation (invalid formats)", () => {
  for (const email of invalidEmails) {
    const defectTag = buggyAcceptedEmails.has(email) ? " @defect(BUG-002)" : "";
    test(`blocks invalid email${defectTag} : ${email}`, async ({ page }) => {
      const registerPage = new RegisterPage(page);

      const data = buildValidRegistrationData({ email });

      await registerPage.goto();
      await registerPage.fillForm(data);
      await registerPage.submit();

      await registerPage.notExpectSuccessMessage();
      await registerPage.expectNotRedirectToLoginWithRegisteredTrue();
      await registerPage.expectEmailValidationError();
    });
  }
});
