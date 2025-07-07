import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockUser } from '../../__tests__/setup/testUtils';
import Register from '../Register';
import { mockNavigate, setupRouterMocks, resetUtilMocks } from '../../__tests__/mocks/utilMocks';

// Mock the utils
jest.mock('../../utils/api', () => ({
  register: jest.fn(),
}));

jest.mock('../../utils/auth', () => ({
  setAuthRole: jest.fn(),
  setAuthToken: jest.fn(),
  validateEmail: jest.fn(),
  validatePassword: jest.fn(),
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

describe('Register Component', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    setupRouterMocks();
    const { useNavigate } = require('react-router');
    useNavigate.mockReturnValue(mockNavigate);
    
    const { validateEmail, validatePassword } = require('../../utils/auth');
    validateEmail.mockImplementation(email => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    });
    validatePassword.mockImplementation(password => {
      return password.length >= 8;
    });
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    resetUtilMocks();
  });

  it('renders register form elements', () => {
    renderWithProviders(<Register />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    renderWithProviders(<Register />);

    const submitButton = screen.getByRole('button', { name: /register/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    renderWithProviders(<Register />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
    });
  });

  it('shows validation error for weak password', async () => {
    renderWithProviders(<Register />);

    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    await user.type(passwordInput, '123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument();
    });
  });

  it('shows validation error for password mismatch', async () => {
    renderWithProviders(<Register />);

    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'differentpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('clears errors when user starts typing', async () => {
    renderWithProviders(<Register />);

    const nameInput = screen.getByLabelText(/name/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    // First trigger validation error
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    // Then start typing to clear error
    await user.type(nameInput, 'John Doe');
    
    await waitFor(() => {
      expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
    });
  });

  it('handles successful registration', async () => {
    const { register } = require('../../utils/api');
    const { setAuthToken, setAuthRole } = require('../../utils/auth');
    
    register.mockResolvedValue({
      token: 'test-token',
      user: { ...mockUser, name: 'John Doe' },
    });

    renderWithProviders(<Register />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
    });

    expect(setAuthToken).toHaveBeenCalledWith('test-token');
    expect(setAuthRole).toHaveBeenCalledWith('user');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('handles registration failure', async () => {
    const { register } = require('../../utils/api');
    
    register.mockRejectedValue(new Error('Email already exists'));

    renderWithProviders(<Register />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument();
    });
  });

  it('shows loading state during registration', async () => {
    const { register } = require('../../utils/api');
    
    // Create a promise that we can control
    let resolveRegister;
    const registerPromise = new Promise(resolve => {
      resolveRegister = resolve;
    });
    register.mockReturnValue(registerPromise);

    renderWithProviders(<Register />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitButton);

    // Check if loading state is shown
    expect(submitButton).toBeDisabled();

    // Resolve the promise
    resolveRegister({ token: 'test-token', user: mockUser });
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('renders login link', () => {
    renderWithProviders(<Register />);

    const loginLink = screen.getByText(/already have an account/i).closest('a');
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('handles form submission with Enter key', async () => {
    const { register } = require('../../utils/api');
    register.mockResolvedValue({
      token: 'test-token',
      user: mockUser,
    });

    renderWithProviders(<Register />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      expect(register).toHaveBeenCalled();
    });
  });

  it('validates name field on blur', async () => {
    renderWithProviders(<Register />);

    const nameInput = screen.getByLabelText(/name/i);
    
    // Focus and blur without typing
    await user.click(nameInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
  });

  it('handles admin registration', async () => {
    const { register } = require('../../utils/api');
    const { setAuthToken, setAuthRole } = require('../../utils/auth');
    
    const adminUser = { ...mockUser, role: 'admin' };
    register.mockResolvedValue({
      token: 'admin-token',
      user: adminUser,
    });

    renderWithProviders(<Register />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /register/i });

    await user.type(nameInput, 'Admin User');
    await user.type(emailInput, 'admin@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(setAuthToken).toHaveBeenCalledWith('admin-token');
      expect(setAuthRole).toHaveBeenCalledWith('admin');
      expect(mockNavigate).toHaveBeenCalledWith('/admin/dashboard');
    });
  });
});
