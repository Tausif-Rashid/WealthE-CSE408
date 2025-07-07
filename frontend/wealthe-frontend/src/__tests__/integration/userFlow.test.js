import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockUser } from '../__tests__/setup/testUtils';
import { setupDefaultMocks, resetAllMocks } from '../__tests__/mocks/apiMocks';
import { setupAuthMocks, resetUtilMocks } from '../__tests__/mocks/utilMocks';

// Import actual components for integration testing
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import { AuthProvider } from '../components/AuthContext';

// Mock API calls
jest.mock('../utils/api', () => ({
  login: jest.fn(),
  getUserInfo: jest.fn(),
  getTaxInfo: jest.fn(),
}));

jest.mock('../utils/auth', () => ({
  getAuthRole: jest.fn(),
  setAuthRole: jest.fn(),
  setAuthToken: jest.fn(),
  validateEmail: jest.fn(),
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => jest.fn(),
}));

describe('Integration Tests', () => {
  beforeEach(() => {
    setupDefaultMocks();
    setupAuthMocks();
    jest.clearAllMocks();
  });

  afterEach(() => {
    resetAllMocks();
    resetUtilMocks();
  });

  describe('Login to Dashboard Flow', () => {
    it('successfully logs in and displays dashboard', async () => {
      const user = userEvent.setup();
      const { login } = require('../utils/api');
      const { setAuthToken, setAuthRole, validateEmail } = require('../utils/auth');
      
      // Setup mocks
      login.mockResolvedValue({
        token: 'test-token',
        user: mockUser,
      });
      validateEmail.mockImplementation(email => email.includes('@'));
      
      // Render login page
      renderWithProviders(<Login />);
      
      // Fill in login form
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      // Verify API calls
      await waitFor(() => {
        expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(setAuthToken).toHaveBeenCalledWith('test-token');
        expect(setAuthRole).toHaveBeenCalledWith('user');
      });
    });

    it('handles login failure and shows error message', async () => {
      const user = userEvent.setup();
      const { login } = require('../utils/api');
      const { validateEmail } = require('../utils/auth');
      
      // Setup mocks
      login.mockRejectedValue(new Error('Invalid credentials'));
      validateEmail.mockImplementation(email => email.includes('@'));
      
      // Render login page
      renderWithProviders(<Login />);
      
      // Fill in login form
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitButton);
      
      // Verify error message is shown
      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });
  });

  describe('Authentication Context Integration', () => {
    it('updates auth context when user logs in', async () => {
      const user = userEvent.setup();
      const { login } = require('../utils/api');
      const { validateEmail } = require('../utils/auth');
      
      // Setup mocks
      login.mockResolvedValue({
        token: 'test-token',
        user: mockUser,
      });
      validateEmail.mockImplementation(email => email.includes('@'));
      
      // Custom AuthProvider to test context updates
      const TestAuthProvider = ({ children }) => {
        const [authState, setAuthState] = React.useState({
          user: null,
          isAuthenticated: false,
        });
        
        const login = (userData, token) => {
          setAuthState({
            user: userData,
            isAuthenticated: true,
          });
        };
        
        return (
          <AuthProvider value={{ ...authState, login }}>
            {children}
          </AuthProvider>
        );
      };
      
      renderWithProviders(
        <TestAuthProvider>
          <Login />
        </TestAuthProvider>
      );
      
      // Perform login
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login/i });
      
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);
      
      // Verify login was called
      await waitFor(() => {
        expect(login).toHaveBeenCalled();
      });
    });
  });

  describe('Form Validation Integration', () => {
    it('validates email format and shows appropriate errors', async () => {
      const user = userEvent.setup();
      const { validateEmail } = require('../utils/auth');
      
      // Setup email validation
      validateEmail.mockImplementation(email => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      });
      
      renderWithProviders(<Login />);
      
      // Test invalid email
      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /login/i });
      
      await user.type(emailInput, 'invalid-email');
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
      });
      
      // Test valid email
      await user.clear(emailInput);
      await user.type(emailInput, 'valid@example.com');
      
      await waitFor(() => {
        expect(screen.queryByText('Please enter a valid email')).not.toBeInTheDocument();
      });
    });

    it('clears errors when user corrects input', async () => {
      const user = userEvent.setup();
      const { validateEmail } = require('../utils/auth');
      
      validateEmail.mockImplementation(email => email.includes('@'));
      
      renderWithProviders(<Login />);
      
      // Trigger validation error
      const submitButton = screen.getByRole('button', { name: /login/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Email is required')).toBeInTheDocument();
      });
      
      // Fix the error
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test@example.com');
      
      await waitFor(() => {
        expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
      });
    });
  });

  describe('Dashboard Data Loading Integration', () => {
    it('loads user and tax information on dashboard mount', async () => {
      const { getUserInfo, getTaxInfo } = require('../utils/api');
      
      // Setup mocks
      getUserInfo.mockResolvedValue([mockUser]);
      getTaxInfo.mockResolvedValue([{
        id: 1,
        email: 'test@example.com',
        taxAmount: 5000,
      }]);
      
      renderWithProviders(<Dashboard />, {
        user: mockUser,
        isAuthenticated: true,
      });
      
      // Verify API calls are made
      await waitFor(() => {
        expect(getUserInfo).toHaveBeenCalledTimes(1);
        expect(getTaxInfo).toHaveBeenCalledTimes(1);
      });
    });

    it('handles API errors gracefully', async () => {
      const { getUserInfo, getTaxInfo } = require('../utils/api');
      
      // Setup mocks to fail
      getUserInfo.mockRejectedValue(new Error('Network error'));
      getTaxInfo.mockRejectedValue(new Error('Network error'));
      
      renderWithProviders(<Dashboard />, {
        user: mockUser,
        isAuthenticated: true,
      });
      
      // Verify error messages are shown
      await waitFor(() => {
        expect(screen.getByText('Failed to load user information')).toBeInTheDocument();
        expect(screen.getByText('Failed to load tax information')).toBeInTheDocument();
      });
    });
  });

  describe('User Role Integration', () => {
    it('handles different user roles correctly', async () => {
      const { getAuthRole } = require('../utils/auth');
      
      // Test regular user
      getAuthRole.mockReturnValue('user');
      
      renderWithProviders(<Dashboard />, {
        user: mockUser,
        isAuthenticated: true,
      });
      
      // Verify user can access dashboard
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
      
      // Test admin user
      getAuthRole.mockReturnValue('admin');
      const adminUser = { ...mockUser, role: 'admin' };
      
      renderWithProviders(<Dashboard />, {
        user: adminUser,
        isAuthenticated: true,
      });
      
      // Verify admin can access dashboard
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });
  });
});
