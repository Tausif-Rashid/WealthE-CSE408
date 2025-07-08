import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockUser, mockApiResponses } from '../../__tests__/setup/testUtils';
import Login from '../Login';
import { mockNavigate, setupRouterMocks, resetUtilMocks } from '../../__tests__/mocks/utilMocks';

// Mock the utils
jest.mock('../../utils/api', () => ({
  login: jest.fn(),
}));

// Mock AuthContext
// const mockAuthLogin = jest.fn();
// jest.mock('../../components/AuthContext', () => ({
//   useAuth: jest.fn(() => ({
//     login: mockAuthLogin,
//     user: null,
//     isAuthenticated: false,
//   })),
// }));

jest.mock('../../utils/auth', () => ({
  getAuthRole: jest.fn(),
  setAuthRole: jest.fn(),
  setAuthToken: jest.fn(),
  validateEmail: jest.fn(),
  getAuthToken: jest.fn(),
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  Link: ({ to, children, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  useNavigate: jest.fn(),
}));




describe('Login Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    setupRouterMocks();
    const { useNavigate } = require('react-router');
    useNavigate.mockReturnValue(mockNavigate);
    
    const { validateEmail, getAuthToken } = require('../../utils/auth');
    validateEmail.mockImplementation(email => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    });
    
    // Reset the mock auth login function
    //mockAuthLogin.mockClear();
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    resetUtilMocks();
  });

  it('renders login form elements', () => {
    renderWithProviders(<Login />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithProviders(<Login />);

    const submitButton = screen.getByRole('button', { name: /Sign In/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
    });
  });

  it('clears errors when user starts typing', async () => {
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    // First trigger validation error
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    // Then start typing to clear error
    await user.type(emailInput, 'test@example.com');
    
    await waitFor(() => {
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    });
  });

  it('handles successful login for regular user', async () => {
    const { login } = require('../../utils/api');
    const { setAuthToken, setAuthRole } = require('../../utils/auth');
    
    login.mockResolvedValue({
      token: 'test-token',
      user: { ...mockUser, role: 'user' },
    });

    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(setAuthToken).toHaveBeenCalledWith('test-token');
      expect(setAuthRole).toHaveBeenCalledWith('user');
      //expect(mockAuthLogin).toHaveBeenCalledWith({ ...mockUser, role: 'user' }, 'test-token');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles successful login for admin user', async () => {
    const { login } = require('../../utils/api');
    const { setAuthToken, setAuthRole } = require('../../utils/auth');

    
    login.mockResolvedValue({
      token: 'admin-token',
      user: { ...mockUser, role: 'admin' },
    });

    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    await user.type(emailInput, 'admin@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('admin@example.com', 'password123');
      expect(setAuthToken).toHaveBeenCalledWith('admin-token');
      expect(setAuthRole).toHaveBeenCalledWith('admin');
      //expect(mockAuthLogin).toHaveBeenCalledWith({ ...mockUser, role: 'admin' }, 'admin-token');
      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  it('handles login failure', async () => {
    const { login } = require('../../utils/api');
    
    login.mockRejectedValue(new Error('Invalid credentials'));

    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

//   it('shows loading state during login', async () => {
//     const { useAuth } = require('../../components/AuthContext');
//     jest.mock('../../components/AuthContext');
//     // Create a promise that we can control
//     let resolveLogin;
//     const loginPromise = new Promise(resolve => {
//       resolveLogin = resolve;
//     });
    
//     //useAuth.mockReturnValue(loginPromise);
//      // Mock useAuth to return the login function
//     useAuth.mockReturnValue({
//       login: jest.fn(() => loginPromise),
//       user: null,
//     });

//     renderWithProviders(<Login />);

//     const emailInput = screen.getByLabelText(/email/i);
//     const passwordInput = screen.getByLabelText(/password/i);
//     const submitButton = screen.getByRole('button', { name: /Sign In/i });

//     await user.type(emailInput, 'test@example.com');
//     await user.type(passwordInput, 'password123');
//     await user.click(submitButton);

//     // Check if loading state is shown
//     //expect(submitButton).toHaveTextContent(/Signing/i);
//     expect(submitButton).toBeDisabled();

//     // Resolve the promise
//     resolveLogin({ token: 'test-token', user: mockUser });
    
//     await waitFor(() => {
//       expect(submitButton).not.toBeDisabled();
//     });
//   });

  it('renders register link', () => {
    renderWithProviders(<Login />);

    const registerLink = screen.getByText(/Sign Up/i).closest('a');
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('handles form submission with Enter key', async () => {
    const { login } = require('../../utils/api');
    login.mockResolvedValue({
      token: 'test-token',
      user: mockUser,
    });

    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});
