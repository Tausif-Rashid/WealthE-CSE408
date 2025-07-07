// Test configuration constants
export const TEST_TIMEOUT = 10000;
export const ASYNC_TIMEOUT = 5000;

// Test data generators
export const generateMockUser = (overrides = {}) => ({
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  ...overrides,
});

export const generateMockExpense = (overrides = {}) => ({
  id: 1,
  amount: 100,
  description: 'Test expense',
  category: 'Food',
  date: '2023-01-01',
  type: 'FOOD',
  ...overrides,
});

export const generateMockExpenses = (count = 3) => {
  return Array.from({ length: count }, (_, index) => 
    generateMockExpense({
      id: index + 1,
      amount: (index + 1) * 50,
      description: `Test expense ${index + 1}`,
    })
  );
};

// Test utilities
export const waitForLoadingToFinish = async (timeout = ASYNC_TIMEOUT) => {
  const { waitForElementToBeRemoved, screen } = await import('@testing-library/react');
  
  try {
    await waitForElementToBeRemoved(
      () => screen.queryByText(/loading/i),
      { timeout }
    );
  } catch (error) {
    // If loading element is not found, it's probably already finished
  }
};

export const expectElementToBeInDocument = (element) => {
  expect(element).toBeInTheDocument();
};

export const expectElementNotToBeInDocument = (element) => {
  expect(element).not.toBeInTheDocument();
};

// Custom matchers for better assertions
export const expectFormToBeValid = (form) => {
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    expect(input).toBeValid();
  });
};

export const expectFormToHaveErrors = (form) => {
  const errorElements = form.querySelectorAll('[data-testid*="error"], .error, .invalid');
  expect(errorElements.length).toBeGreaterThan(0);
};

// Test helpers for common patterns
export const fillForm = async (user, formData) => {
  const { screen } = await import('@testing-library/react');
  
  for (const [fieldName, value] of Object.entries(formData)) {
    const field = screen.getByLabelText(new RegExp(fieldName, 'i'));
    
    if (field.type === 'select-one') {
      await user.selectOptions(field, value);
    } else if (field.type === 'checkbox') {
      if (value) {
        await user.check(field);
      } else {
        await user.uncheck(field);
      }
    } else {
      await user.clear(field);
      await user.type(field, value);
    }
  }
};

export const submitForm = async (user, formSelector = 'form') => {
  const { screen } = await import('@testing-library/react');
  
  const submitButton = screen.getByRole('button', { name: /submit|save|create|add|login|register/i });
  await user.click(submitButton);
};

// Mock response helpers
export const createMockResponse = (data, success = true) => {
  if (success) {
    return Promise.resolve(data);
  } else {
    return Promise.reject(new Error(data.message || 'Mock error'));
  }
};

export const createMockApiResponse = (data, options = {}) => {
  const { delay = 0, shouldFail = false, errorMessage = 'API Error' } = options;
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error(errorMessage));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

// Test environment helpers
export const setupConsoleError = () => {
  const originalError = console.error;
  console.error = jest.fn();
  
  return () => {
    console.error = originalError;
  };
};

export const setupConsoleWarn = () => {
  const originalWarn = console.warn;
  console.warn = jest.fn();
  
  return () => {
    console.warn = originalWarn;
  };
};

// Performance testing helpers
export const measureRenderTime = (renderFn) => {
  const start = performance.now();
  const result = renderFn();
  const end = performance.now();
  
  return {
    result,
    renderTime: end - start,
  };
};

// Accessibility testing helpers
export const expectElementToBeAccessible = (element) => {
  // Check for basic accessibility attributes
  if (element.tagName === 'BUTTON') {
    expect(element).toHaveAttribute('type');
  }
  
  if (element.tagName === 'INPUT') {
    expect(element).toHaveAttribute('type');
    
    // Check for labels
    const label = element.closest('label') || 
                  document.querySelector(`label[for="${element.id}"]`);
    expect(label).toBeInTheDocument();
  }
  
  // Check for ARIA attributes where appropriate
  if (element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby')) {
    expect(element).toHaveAttribute('aria-label');
  }
};

// Test cleanup helpers
export const cleanupMocks = () => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
};

export const resetAllStores = () => {
  // Reset any global state stores if used
  localStorage.clear();
  sessionStorage.clear();
};
