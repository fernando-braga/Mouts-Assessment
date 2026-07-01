# Mouts Assessment — Cypress E2E & API Test Automation

Automated test suite built with **Cypress** and **JavaScript** for the [ServeRest](https://serverest.dev/) application, covering frontend E2E and API scenarios.

---

## 📁 Project Structure

```
cypress/
├── e2e/
│   ├── front-end/
│   │   ├── login.cy.js               # Login flow tests
│   │   ├── registerProduct.cy.js     # Product registration tests
│   │   └── listProduct.cy.js         # Product listing, edit, and delete tests
│   ├── api/
│   │   └── usuarios.cy.js            # API tests for user management
│   └── pages/
│       ├── Utils.js                  # Shared utilities and reusable methods
│       ├── listProducts.js           # Page Object for product listing
│       └── registerProducts.js       # Page Object for product registration
├── fixtures/
│   └── images/
│       └── televisao-retro.jpg       # Image used in product registration tests
└── support/
    ├── commands.js
    └── e2e.js
.github/
└── workflows/
    └── cypress.yml                   # GitHub Actions CI/CD pipeline
cypress.config.js
```

---

## 🧪 Test Scenarios

### Frontend E2E

#### Login (`login.cy.js`)
| Scenario | Type | Status |
|---|---|---|
| Should login successfully with valid credentials | Positive | ✅ |
| Should display error with invalid credentials | Negative | ✅ |
| Should logout successfully | Positive | ✅ |

#### Register Product (`registerProduct.cy.js`)
| Scenario | Type | Status |
|---|---|---|
| Should register a product successfully | Positive | ✅ |
| Should display error when required fields are empty | Negative | ✅ |

#### List Products (`listProduct.cy.js`)
| Scenario | Type | Status |
|---|---|---|
| Should list a created product successfully | Positive | ✅ |
| Edit a product — known bug | Bug | ❌ (intentional) |
| Should delete a product successfully | Positive | ✅ |

### API

#### Usuarios (`api/usuarios.cy.js`)
| Scenario | Type | Status |
|---|---|---|
| Should create a user successfully | Positive | ✅ |
| Should list users successfully | Positive | ✅ |
| Should delete all users with @qatest.com domain | Cleanup | ✅ |

---

## 🐛 Known Bug

During test execution, a bug was identified in the product listing page:

> **Edit button does not perform any action when clicked.**
> - **Expected:** clicking "Editar" should navigate to the edit product page or open an edit modal.
> - **Actual:** nothing happens on click — the page remains on `/admin/listarprodutos`.

The test `edit a product - known bug` was intentionally kept as a **failing test** to document this defect. This is a deliberate quality decision: the automation surfaces the bug rather than ignoring it.

---

## 🏗️ Architecture Decisions

### Page Object Model
Each feature has its own Page Object encapsulating selectors and interactions. This keeps test files clean and makes maintenance easier — a selector change only needs to be updated in one place.

### Shared Utils
The `Utils.js` file centralizes reusable methods shared across all spec files: `generateAdminUser()`, `generateProduct()`, `setupAdminUser()`, `login()`, and `logOut()`. This avoids duplication and keeps each spec focused on behavior.

### Test Data with Faker
All test data (user names, emails, passwords, product names, prices, descriptions) is dynamically generated using `@faker-js/faker`. This ensures:
- No hardcoded data that could cause conflicts
- Each test run uses unique, realistic data
- Users created by tests are identifiable by the `@qatest.com` email domain

### Test Isolation
Each `describe` block creates its own user via `before()` and shares it across `it()` blocks within that suite. This balances **isolation** (each spec is self-contained) with **performance** (no repeated setup per test). Tests within a suite share context but do not depend on each other's outcomes.

In a real production scenario, the expected approach would be a single dedicated automation account shared across all specs, with credentials stored securely (e.g. in `cypress.env.json` or CI/CD secrets) and a single centralized login method. The dynamic user creation approach was chosen here because ServeRest is a public environment with no pre-existing automation account — ensuring each spec is fully autonomous and self-contained without relying on external state.

### Complementary Coverage Strategy
While the frontend tests focus on the **product domain** (registration, listing, deletion), the API tests focus on the **user domain** (creation, listing, cleanup). This was a deliberate choice to maximize end-to-end coverage across different layers and domains without duplicating the same flows — frontend and API complement each other rather than repeat each other.

### Login as Setup, Not Test
In specs where login is a prerequisite (e.g. product tests), the login is performed in `beforeEach()` via `cy.visit('/login')` and the shared `utils.login()` method — not as a test scenario. This follows best practices: test what matters, use setup for infrastructure.

### API Cleanup Strategy
The API test suite includes a cleanup routine (`should delete all users with @qatest.com domain`) that deletes all users created during test runs. This prevents data pollution in the shared ServeRest environment across multiple runs.

> In a real production scenario, sensitive data such as passwords, tokens, and API keys would be stored in a `cypress.env.json` file listed in `.gitignore` to prevent exposure in the repository. For this project, since ServeRest is a public test environment with no sensitive credentials, all configuration is kept in `cypress.config.js` for ease of evaluation.

### Assertion Strategy
- `cy.url().should('include', ...)` — validates navigation after actions
- `cy.contains(text).should('be.visible')` — validates dynamic messages and feedback
- `cy.get('table', { timeout: 10000 }).should('not.contain', name)` — validates deletion with an extended timeout to account for the page reloading after the delete request. This is a deliberate choice over `cy.wait()` (which is a fixed blind wait) — the timeout allows Cypress to retry the assertion until the condition is true or time runs out.
- `expect(response.status).to.eq(...)` and `expect(response.body).to.have.property(...)` — validates API responses at both status code and body level

### Logging
`cy.log()` is used throughout tests to provide visibility into what data is being used and what assertions are being made. This is especially useful in CI/CD environments where test runners don't have a visual interface, making it easier to debug failures from logs alone.

### Dynamic Selectors
When elements lack `data-testid` attributes (e.g. product table rows), tests use content-anchored selectors:
```javascript
cy.contains('tbody tr', product.nome).find('button').contains('Excluir').click()
```
This is more resilient than positional selectors (`nth-child`) which break when the DOM structure changes.

---

## ⚙️ CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/cypress.yml`) that:
- Runs automatically on every push or pull request to `main`
- Uploads **screenshots** as artifacts when tests fail
- Uploads **videos** as artifacts after every run

This allows reviewers to inspect failures directly from the GitHub Actions tab without running the project locally.

---

## 🚀 How to Run

### Prerequisites
- Node.js v18+
- npm

### Install dependencies
```bash
npm install
```

### Run all tests (headless)
```bash
npx cypress run
```

### Open Cypress interactive mode
```bash
npx cypress open
```

### Run a specific spec
```bash
npx cypress run --spec "cypress/e2e/front-end/login.cy.js"
```

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| Cypress 14 | Test framework |
| JavaScript | Language |
| @faker-js/faker | Dynamic test data generation |
| cypress-file-upload | File input handling |
| GitHub Actions | CI/CD pipeline |

---

## 🌐 Application Under Test

| Layer | URL |
|---|---|
| Frontend | https://front.serverest.dev |
| API | https://serverest.dev |
| Swagger | https://serverest.dev/ |

> **Note:** ServeRest is a public shared test environment. Intermittent failures may occur due to response time variability or environment load. Test setup was designed to be resilient to these conditions by avoiding strict URL assertions in setup hooks.
