import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { AuthProvider } from '../../components/AuthContext';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Custom render function with providers
export const renderWithProviders = (ui, options = {}) => {
  const {
    initialEntries = ['/'],
    user = null,
    isAuthenticated = false,
    ...renderOptions
  } = options;

  const mockAuthValue = {
    user,
    loading: false,
    isAuthenticated,
    login: jest.fn(),
    logout: jest.fn(),
    setUser: jest.fn(),
  };

  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <AuthProvider value={mockAuthValue}>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Custom render for testing with router only
export const renderWithRouter = (ui, options = {}) => {
  const { initialEntries = ['/'], ...renderOptions } = options;

  const Wrapper = ({ children }) => (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Mock user data
export const mockUser = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
};

export const mockAdminUser = {
  id: 2,
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
};

// Mock API responses
export const mockApiResponses = {
  login: {
    token: 'mock-token',
    user: mockUser,
  },
  loginAdmin: {
    token: 'mock-admin-token',
    user: mockAdminUser,
  },
  userInfo: mockUser,
  expenses: [
    {
      id: 1,
      amount: 100,
      description: 'Test expense',
      category: 'Food',
      date: '2023-01-01',
    },
  ],
  dashboard: {
    totalExpenses: 1000,
    totalIncome: 5000,
    balance: 4000,
  },
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
