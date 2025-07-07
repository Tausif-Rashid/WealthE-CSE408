import React from 'react';
import { screen, render } from '@testing-library/react';
import { renderWithProviders, mockUser } from '../../__tests__/setup/testUtils';
import ProtectedRoute from '../ProtectedRoute';
import { mockNavigate, setupRouterMocks, resetUtilMocks } from '../../__tests__/mocks/utilMocks';

// Mock react-router
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}));

const TestComponent = () => <div>Protected Content</div>;

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    setupRouterMocks();
    const { useNavigate } = require('react-router');
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    resetUtilMocks();
    jest.clearAllMocks();
  });

  it('renders children when user is authenticated', () => {
    renderWithProviders(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
      {
        user: mockUser,
        isAuthenticated: true,
      }
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows loading when authentication is in progress', () => {
    renderWithProviders(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
      {
        user: null,
        isAuthenticated: false,
        loading: true,
      }
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    renderWithProviders(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
      {
        user: null,
        isAuthenticated: false,
        loading: false,
      }
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('does not redirect when user is authenticated', () => {
    renderWithProviders(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
      {
        user: mockUser,
        isAuthenticated: true,
        loading: false,
      }
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles role-based access for admin routes', () => {
    const adminUser = { ...mockUser, role: 'admin' };
    
    renderWithProviders(
      <ProtectedRoute requiredRole="admin">
        <TestComponent />
      </ProtectedRoute>,
      {
        user: adminUser,
        isAuthenticated: true,
        loading: false,
      }
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects when user does not have required role', () => {
    renderWithProviders(
      <ProtectedRoute requiredRole="admin">
        <TestComponent />
      </ProtectedRoute>,
      {
        user: mockUser, // regular user
        isAuthenticated: true,
        loading: false,
      }
    );

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('allows access when no specific role is required', () => {
    renderWithProviders(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>,
      {
        user: mockUser,
        isAuthenticated: true,
        loading: false,
      }
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
