import { test } from "@playwright/test";
import { RegisterPage } from "../../pages/RegisterPage";
import { buildValidRegistrationData } from "../../utils/testData";

test("TC-REG-001 @smoke — Register with valid data (Happy Path)", async ({ page }) => {
  const registerPage = new RegisterPage(page);
  const data = buildValidRegistrationData();

  await registerPage.goto();
  await registerPage.fillForm(data); 
  await registerPage.submit();

  await registerPage.expectSuccessMessage();
  await registerPage.expectRedirectToLoginWithRegisteredTrue();
});
