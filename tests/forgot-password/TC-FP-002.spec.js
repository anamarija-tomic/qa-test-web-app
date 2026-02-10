import { test } from "@playwright/test";
import { ForgotPasswordPage } from "../../pages/ForgotPasswordPage";

test("TC-FP-002 @defect(BUG-012) — Forgot Password: non-existing email handling", async ({
  page,
}) => {
  const forgotPasswordPage = new ForgotPasswordPage(page);

  const nonExistingEmail = `non.existing.${Date.now()}@example.com`;

  await forgotPasswordPage.goto();
  await forgotPasswordPage.submitResetRequest(nonExistingEmail);

  // Expected behavior: should NOT confirm success for non-existing emails.
  // Current app shows success always -> this test should FAIL until BUG-012 is fixed.
  await forgotPasswordPage.notExpectSuccessMessage();
});
