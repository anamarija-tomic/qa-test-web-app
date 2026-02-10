// utils/testData.js
import crypto from "crypto";
export function buildValidRegistrationData(overrides = {}) {
  const unique = crypto.randomUUID().replace(/-/g, "");

  return {
    firstName: "Ana",
    lastName: "Tomic",
    email: `ana.tomic.${unique}@example.com`,
    phone: "+385 91 123 4567",
    address: "Ilica 1",
    city: "Zagreb",
    zipCode: "10000",
    password: "Password123",
    confirmPassword: "Password123",
    terms: true,
    ...overrides,
  };
}
