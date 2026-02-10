// @ts-check
import { defineConfig, devices } from "@playwright/test";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",

  // Execution stability: the app uses shared / temporary state, and auth state can race after registration.
  // Keep it serial to reduce flakiness and improve diagnosability.
  workers: 1,
  fullyParallel: false,

  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  reporter: [["html", { open: "never" }]],

  use: {
    baseURL: "https://qa-test-web-app.vercel.app",

    // Timeouts that reduce accidental "hangs" when navigation doesn't happen.
    actionTimeout: 10_000,
    navigationTimeout: 15_000,

    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // Tablet runs ONLY UX tests
    {
      name: "tablet",
      testMatch: /ux\/.*\.spec\.js/,
      use: { ...devices["iPad (gen 7)"] },
    },

    // Mobile runs ONLY UX tests
    {
      name: "mobile",
      testMatch: /ux\/.*\.spec\.js/,
      use: { ...devices["Pixel 5"] },
    },
  ],
});
