import { test, expect } from "@playwright/test";
import { RegisterPage } from "../../pages/RegisterPage";
import { buildValidRegistrationData } from "../../utils/testData";

test("TC-REG-010 — Registration blocks duplicate email", async ({ page }) => {
  const registerPage = new RegisterPage(page);
  const data = buildValidRegistrationData();

  // First registration (happy path)
  await registerPage.goto();
  await registerPage.fillForm(data);
  await registerPage.submit();
  await registerPage.expectSuccessMessage();
  await registerPage.expectRedirectToLoginWithRegisteredTrue();

  // Second registration with the same email should be blocked
  await registerPage.goto();
  await registerPage.fillForm(data);
  await registerPage.submit();

  await registerPage.notExpectSuccessMessage();
  await registerPage.expectNotRedirectToLoginWithRegisteredTrue();

  // App returns a message "User with this email already exists"
  await expect(registerPage.message).toContainText(
    "User with this email already exists",
  );
});
