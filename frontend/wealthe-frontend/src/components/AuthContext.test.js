import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders, mockUser, mockAdminUser } from '../../__tests__/setup/testUtils';
import { AuthProvider, useAuth } from '../AuthContext';
import { mockApi, setupDefaultMocks, resetAllMocks } from '../../__tests__/mocks/apiMocks';
import { mockAuthUtils, setupAuthMocks, resetUtilMocks } from '../../__tests__/mocks/utilMocks';

// Mock the utils
jest.mock('../../utils/auth', () => ({
  getAuthToken: jest.fn(),
  removeAuthToken: jest.fn(),
  removeAuthRole: jest.fn(),
}));

jest.mock('../../utils/api', () => ({
  getUserInfo: jest.fn(),
}));

// Test component to access auth context
const TestComponent = () => {
  const { user, loading, isAuthenticated, login, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="user-info">
        {user ? user.email : 'No user'}
      </div>
      <div data-testid="loading">
        {loading ? 'Loading' : 'Not loading'}
      </div>
      <div data-testid="authenticated">
        {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
      </div>
      <button onClick={() => login(mockUser, 'token')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    setupDefaultMocks();
    setupAuthMocks();
    jest.clearAllMocks();
  });

  afterEach(() => {
    resetAllMocks();
    resetUtilMocks();
  });

  it('should throw error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      renderWithProviders(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');

    console.error = originalError;
  });

  it('should provide initial state when no token exists', async () => {
    const { getAuthToken } = require('../../utils/auth');
    getAuthToken.mockReturnValue(null);

    renderWithProviders(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
    });

    expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('Not authenticated');
  });

  it('should authenticate user when valid token exists', async () => {
    const { getAuthToken } = require('../../utils/auth');
    const { getUserInfo } = require('../../utils/api');
    
    getAuthToken.mockReturnValue('valid-token');
    getUserInfo.mockResolvedValue(mockUser);

    renderWithProviders(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
  });

  it('should handle authentication failure', async () => {
    const { getAuthToken, removeAuthToken } = require('../../utils/auth');
    const { getUserInfo } = require('../../utils/api');
    
    getAuthToken.mockReturnValue('invalid-token');
    getUserInfo.mockRejectedValue(new Error('Invalid token'));

    renderWithProviders(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('Not authenticated');
    expect(removeAuthToken).toHaveBeenCalled();
  });

  it('should handle null user data', async () => {
    const { getAuthToken, removeAuthToken } = require('../../utils/auth');
    const { getUserInfo } = require('../../utils/api');
    
    getAuthToken.mockReturnValue('valid-token');
    getUserInfo.mockResolvedValue(null);

    renderWithProviders(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
    });

    expect(screen.getByTestId('authenticated')).toHaveTextContent('Not authenticated');
    expect(removeAuthToken).toHaveBeenCalled();
  });

  it('should handle login function', async () => {
    const { getAuthToken } = require('../../utils/auth');
    getAuthToken.mockReturnValue(null);

    renderWithProviders(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
    });

    // Click login button
    const loginButton = screen.getByText('Login');
    loginButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toHaveTextContent(mockUser.email);
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
    });
  });

  it('should handle logout function', async () => {
    const { getAuthToken, removeAuthToken, removeAuthRole } = require('../../utils/auth');
    const { getUserInfo } = require('../../utils/api');
    
    getAuthToken.mockReturnValue('valid-token');
    getUserInfo.mockResolvedValue(mockUser);

    renderWithProviders(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
    });

    // Click logout button
    const logoutButton = screen.getByText('Logout');
    logoutButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not authenticated');
      expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
    });

    expect(removeAuthToken).toHaveBeenCalled();
    expect(removeAuthRole).toHaveBeenCalled();
  });
});
