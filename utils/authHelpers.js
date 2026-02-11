import { RegisterPage } from "../pages/RegisterPage";
import { buildValidRegistrationData } from "./testData";

export async function registerNewUser(page, overrides = {}) {
  const registerPage = new RegisterPage(page);
  const data = buildValidRegistrationData({ ...overrides });

  await registerPage.goto();
  await registerPage.fillForm(data);
  await registerPage.submit();
  await registerPage.expectSuccessMessage();
  await registerPage.expectRedirectToLoginWithRegisteredTrue();

  return { data };
}
