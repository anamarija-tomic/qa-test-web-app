# QA Test Web App — Playwright Automation

**Base URL:** https://qa-test-web-app.vercel.app

Automated functional, negative, session, and cross-viewport UX tests for the QA Test Web Application using **Playwright (JavaScript)** and the **Page Object Model (POM)** pattern.

---

## Prerequisites

- **Node.js:** 18+ (tested on **v24.13.0**)
- **npm:** comes with Node (tested on **11.6.2**)

Check versions:

```bash
node -v
npm -v
```

---

## Tech Stack

- Playwright Test (JavaScript, ESM)
- Page Object Model (POM)
- Playwright HTML Reporter

---

## Project Structure

- `pages/` → Page Objects (locators + page actions/assertions)
- `utils/` → test data + helpers (e.g., registration data builder)
- `tests/`
  - `registration/` → registration test cases
  - `login/` → login test cases (including Remember Me)
  - `forgot-password/` → forgot password test cases
  - `session/` → session/auth tests (logout, direct dashboard access)
  - `dashboard/` → dashboard logic tests (e.g., “Last login”)
  - `ux/` → UX tests (cross-viewport)

---

## Install

From the project root:

```bash
npm install
```

Install Playwright browsers (if needed):

```bash
npx playwright install
```

---

## How to Run Tests

Run the full suite (headless):

```bash
npm test
```

Run tests in headed mode:

```bash
npm run test:headed
```

Open Playwright UI mode (interactive):

```bash
npm run test:ui
```

Run only UX tests:

```bash
npm run test:ux
```

Run only core smoke tests (happy paths):

```bash
npm run test:smoke
```

---

## CI (GitHub Actions)

The test suite runs automatically on every push and pull request via GitHub Actions.

- Workflow file: `.github/workflows/playwright.yml`
- Where to see results: GitHub → **Actions** tab → select the latest run
- The Playwright HTML report is uploaded as an artifact (download it from the workflow run page).
- Note: artifacts are kept for a limited retention period (14 days).
- In the run page, scroll to **Artifacts** → download **playwright-report**.

---

## Documentation

- Test Documentation (PDF): `docs/QA_Test_Web_Application_Test_Documentation.pdf`
- Repository: https://github.com/anamarija-tomic/qa-test-web-app

---

## HTML Report (Local)

Generate/open the report:

```bash
npm run test:report
```

Report output is generated in:

- `playwright-report/index.html`

Open it in a browser after the run.

---

## Projects and Viewports

The Playwright configuration defines three projects:

- `chromium` (Desktop Chrome) — runs all functional/session/dashboard/registration/login/forgot-password tests + UX tests (desktop)
- `tablet` (iPad gen 7) — runs UX tests only (`tests/ux/`)
- `mobile` (Pixel 5) — runs UX tests only (`tests/ux/`)

---

## Important Execution Notes

- The suite runs with **workers=1** to reduce flakiness caused by shared state / race conditions during user creation and immediate navigation after registration.
- Some tests may fail due to **known product defects** documented in the Test Report (Appendix B), e.g.:
  - weak/missing validation rules
  - missing submit-level failure feedback (BUG-026)
  - storage-driven auth persistence/rehydration (BUG-001)
- Tests involving authentication may clear `sessionStorage` and `localStorage` pre-run to reduce cross-test contamination caused by the application's current storage behavior.

---

## Test Strategy (High Level)

- Happy path tests validate critical user journeys (registration, login).
- Negative tests validate input validation and error handling.
- Session tests verify authentication, logout, and direct URL access.
- Dashboard tests validate user-facing data accuracy and session semantics (e.g., “Last login” behavior).
- UX tests validate usability across Desktop, Tablet, and Mobile viewports.
- Data-driven tests are used for validation scenarios (email, password, phone, ZIP, whitespace handling).
