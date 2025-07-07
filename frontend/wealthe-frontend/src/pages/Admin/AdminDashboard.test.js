import React from 'react';
import { renderWithProviders, mockAdminUser } from '../../__tests__/setup/testUtils';
import { screen, waitFor } from '@testing-library/react';
import AdminDashboard from './AdminDashboard';

jest.mock('../../utils/api', () => ({
  getTotalUsers: jest.fn(),
  getUserInfo: jest.fn(),
}));

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    const { getTotalUsers, getUserInfo } = require('../../utils/api');
    getTotalUsers.mockImplementation(() => new Promise(() => {}));
    getUserInfo.mockImplementation(() => new Promise(() => {}));
    renderWithProviders(<AdminDashboard />, { user: mockAdminUser, isAuthenticated: true });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders dashboard stats and user info', async () => {
    const { getTotalUsers, getUserInfo } = require('../../utils/api');
    getTotalUsers.mockResolvedValue({ total: 42 });
    getUserInfo.mockResolvedValue([{ id: 2, email: 'admin@example.com', name: 'Admin User' }]);
    renderWithProviders(<AdminDashboard />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    expect(screen.getByText(/42/)).toBeInTheDocument();
    expect(screen.getByText(/admin@example.com/i)).toBeInTheDocument();
  });

  it('shows error on API failure', async () => {
    const { getTotalUsers } = require('../../utils/api');
    getTotalUsers.mockRejectedValue(new Error('API error'));
    renderWithProviders(<AdminDashboard />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => {
      expect(screen.getByText(/failed to load dashboard statistics/i)).toBeInTheDocument();
    });
  });
});
