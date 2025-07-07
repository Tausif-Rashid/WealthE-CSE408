# Testing Guide for WealthE Frontend

This guide covers the comprehensive testing setup for the WealthE React frontend application.

## Test Structure

```
src/
├── __tests__/
│   ├── setup/
│   │   └── testUtils.js          # Custom render functions and utilities
│   ├── mocks/
│   │   ├── apiMocks.js           # API response mocks
│   │   └── utilMocks.js          # Utility function mocks
│   ├── integration/
│   │   └── userFlow.test.js      # Integration tests
│   └── utils/
│       └── testHelpers.js        # Test helper functions
├── components/
│   ├── AuthContext.test.js       # Auth context unit tests
│   ├── Sidebar.test.js           # Sidebar component tests
│   └── ProtectedRoute.test.js    # Protected route tests
├── pages/
│   ├── Login.test.js             # Login page tests
│   ├── Register.test.js          # Register page tests
│   ├── Dashboard.test.js         # Dashboard page tests
│   ├── AddExpense.test.js        # Add expense page tests
│   └── Expenses.test.js          # Expenses page tests
└── App.test.js                   # Main app component tests
```

## Test Types

### 1. Unit Tests
- **Purpose**: Test individual components in isolation
- **Location**: Alongside component files (e.g., `Login.test.js`)
- **What they test**:
  - Component rendering
  - Props handling
  - State management
  - Event handlers
  - Form validation

### 2. Integration Tests
- **Purpose**: Test component interactions and data flow
- **Location**: `src/__tests__/integration/`
- **What they test**:
  - Auth flow from login to dashboard
  - Form submission with API calls
  - Context updates across components
  - Error handling across components

### 3. Mocking Strategy
- **API Mocks**: Mock all API calls to avoid network dependencies
- **Router Mocks**: Mock navigation for testing route changes
- **Auth Mocks**: Mock authentication utilities
- **Component Mocks**: Mock child components for focused testing

## Test Utilities

### Custom Render Functions
```javascript
// Basic render with providers
renderWithProviders(<Component />, {
  user: mockUser,
  isAuthenticated: true
});

// Router-only render
renderWithRouter(<Component />);
```

### Mock Data
```javascript
// Use predefined mock data
import { mockUser, mockAdminUser, mockApiResponses } from './setup/testUtils';

// Or generate custom mock data
import { generateMockUser, generateMockExpense } from './utils/testHelpers';
```

### Test Helpers
```javascript
// Fill form fields
await fillForm(user, {
  email: 'test@example.com',
  password: 'password123'
});

// Submit form
await submitForm(user);

// Wait for loading to finish
await waitForLoadingToFinish();
```

## Running Tests

### Development
```bash
# Run all tests in watch mode
npm run test

# Run tests with coverage
npm run test:coverage

# Run specific test types
npm run test:component
npm run test:pages
npm run test:integration
```

### CI/CD
```bash
# Run tests in CI mode
npm run test:ci

# Debug mode
npm run test:debug
```

## Test Coverage Goals

- **Components**: 90%+ coverage
- **Pages**: 85%+ coverage  
- **Utils**: 95%+ coverage
- **Integration**: Key user flows covered

## Best Practices

### 1. Test Naming
```javascript
describe('Component Name', () => {
  it('should render correctly', () => {});
  it('should handle user interaction', () => {});
  it('should display error messages', () => {});
});
```

### 2. Setup and Cleanup
```javascript
beforeEach(() => {
  setupMocks();
  jest.clearAllMocks();
});

afterEach(() => {
  resetMocks();
  cleanup();
});
```

### 3. Async Testing
```javascript
it('should handle async operations', async () => {
  renderWithProviders(<Component />);
  
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

### 4. Error Testing
```javascript
it('should handle API errors', async () => {
  mockApi.getData.mockRejectedValue(new Error('API Error'));
  
  renderWithProviders(<Component />);
  
  await waitFor(() => {
    expect(screen.getByText('Error loading data')).toBeInTheDocument();
  });
});
```

### 5. User Interaction Testing
```javascript
it('should handle form submission', async () => {
  const user = userEvent.setup();
  renderWithProviders(<LoginForm />);
  
  await user.type(screen.getByLabelText(/email/i), 'test@example.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /login/i }));
  
  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalled();
  });
});
```

## Test Configuration

### Jest Configuration
The project uses Create React App's built-in Jest configuration with these additions:

- `setupTests.js` - Global test setup
- Custom matchers from `@testing-library/jest-dom`
- TextEncoder/TextDecoder polyfills for Node.js 16+

### Environment Variables
```javascript
// In tests, you can set environment variables
process.env.REACT_APP_API_URL = 'http://localhost:3001';
```

## Debugging Tests

### Common Issues
1. **Act warnings**: Wrap state updates in `act()`
2. **Async timeouts**: Increase timeout for slow operations
3. **Mock not working**: Ensure mocks are setup before imports

### Debug Commands
```bash
# Run specific test file
npm test -- Login.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should handle login"

# Run in debug mode
npm run test:debug
```

## Integration with CI/CD

The test suite is configured to run in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm run test:ci
  
- name: Upload coverage
  uses: codecov/codecov-action@v1
  with:
    file: ./coverage/lcov.info
```

## Contributing

When adding new features:

1. Write tests before implementing (TDD approach)
2. Ensure all tests pass
3. Maintain coverage thresholds
4. Update this documentation if needed

## Troubleshooting

### Common Test Failures
- **Component not rendering**: Check if all required props are provided
- **API calls not mocked**: Verify mock setup in beforeEach
- **Async operations failing**: Use waitFor for async assertions
- **Navigation not working**: Check if router mocks are properly configured

### Performance
- Use `screen.debug()` to inspect rendered DOM
- Use `screen.logTestingPlaygroundURL()` for element selectors
- Profile test execution with `--verbose` flag
