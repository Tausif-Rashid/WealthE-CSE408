# End-to-End Tests for WealthE Application

This directory contains Playwright end-to-end tests for the WealthE application, focusing on critical user flows including login, expense management, and navigation.

## Setup

### Prerequisites
- Node.js (v16 or higher)
- The WealthE frontend application running on `http://localhost:3000`

### Installation

1. Navigate to the e2e directory:
```bash
cd e2e
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Basic Test Execution

Run all tests:
```bash
npm test
```

Run tests with browser UI (headed mode):
```bash
npm run test:headed
```

Run tests with Playwright UI (interactive mode):
```bash
npm run test:ui
```

Debug tests:
```bash
npm run test:debug
```

### Specific Test Files

Run a specific test file:
```bash
npx playwright test expenses-flow.spec.js
```

Run tests matching a pattern:
```bash
npx playwright test --grep "login"
```

### Test Reports

Generate and view HTML report:
```bash
npm run test:report
```

## Test Structure

### Test Files

- `tests/login-expenses-edit.spec.js` - Basic login → expenses → edit flow
- `tests/expenses-flow.spec.js` - Comprehensive expense management flow with page objects
- `tests/helpers/pageObjects.js` - Page Object Model classes and test utilities

### Page Objects

The tests use the Page Object Model pattern for better maintainability:

- `LoginPage` - Login form interactions
- `ExpensesPage` - Expense list and management
- `AddExpensePage` - Add expense form
- `DashboardPage` - Dashboard navigation
- `AuthHelpers` - Common authentication actions

### Test Data

Common test data is defined in `helpers/pageObjects.js`:

- User credentials (regular and admin)
- Sample expense data
- Test configurations

## Test Scenarios

### Core Flows

1. **Login → Expenses → Edit Flow**
   - User logs in with valid credentials
   - Navigates to expenses page
   - Views expense list
   - Attempts to edit an expense

2. **Expense Management**
   - Add new expenses
   - Filter expenses by category
   - Navigate between expense views
   - Handle empty expense lists

3. **Navigation Testing**
   - Page-to-page navigation
   - URL validation
   - Back/forward navigation

4. **Error Handling**
   - Invalid login credentials
   - Network errors
   - Form validation errors

### Test Coverage

- ✅ User authentication
- ✅ Expense list viewing
- ✅ Expense filtering
- ✅ Add expense functionality
- ✅ Edit expense button interaction
- ✅ Delete expense button interaction
- ✅ Navigation between pages
- ✅ Error handling
- ✅ Form validation

## Configuration

### Playwright Configuration

The tests are configured in `playwright.config.js`:

- **Base URL**: `http://localhost:3000`
- **Browsers**: Chrome, Firefox, Safari
- **Test Directory**: `./tests`
- **Reports**: HTML report generation
- **Screenshots**: On failure only
- **Video**: Retained on failure
- **Traces**: On retry

### Environment Setup

Before running tests, ensure:

1. **Frontend Server**: Start the React development server
```bash
cd ../frontend/wealthe-frontend
npm start
```

2. **Backend Server**: Ensure the backend API is running and accessible

3. **Database**: Ensure the database is set up with test data

## Test Data Requirements

### User Accounts

The tests expect these user accounts to exist:

- **Regular User**: `user1@test.com` / `123`
- **Admin User**: `admin@test.com` / `admin123`

### Test Environment

- Backend API should be running
- Database should be accessible
- Test data should be available (users, some expenses)

## Troubleshooting

### Common Issues

1. **Tests timeout**: Increase timeout in `playwright.config.js`
2. **Server not starting**: Check if frontend server is running on port 3000
3. **Element not found**: Verify selectors match actual DOM structure
4. **Network errors**: Ensure backend API is accessible

### Debug Mode

For debugging failing tests:

```bash
npx playwright test --debug
```

This opens the Playwright inspector for step-by-step debugging.

### Screenshots and Videos

Failed tests automatically capture:
- Screenshots (saved to `test-results/`)
- Videos (saved to `test-results/`)
- Traces (viewable with `npx playwright show-trace`)

## CI/CD Integration

The tests are configured for CI/CD with:

- Retry on failure (CI only)
- Parallelization control
- Artifact collection
- HTML report generation

### GitHub Actions Example

```yaml
- name: Run E2E Tests
  run: |
    cd e2e
    npm install
    npx playwright install
    npm test
```

## Extending Tests

### Adding New Tests

1. Create new test file in `tests/`
2. Import page objects from `helpers/pageObjects.js`
3. Follow existing test patterns
4. Add appropriate test data

### Adding New Page Objects

1. Create class in `helpers/pageObjects.js`
2. Define locators and actions
3. Add helper methods
4. Export for use in tests

### Best Practices

- Use Page Object Model for maintainability
- Keep tests focused and independent
- Use descriptive test names and steps
- Handle async operations properly
- Mock external dependencies when needed
- Clean up test data after tests

## Maintenance

### Regular Updates

- Update selectors when UI changes
- Add new test scenarios for new features
- Update test data as needed
- Review and update page objects

### Performance

- Keep tests focused and efficient
- Use appropriate waiting strategies
- Avoid unnecessary delays
- Optimize test data setup
