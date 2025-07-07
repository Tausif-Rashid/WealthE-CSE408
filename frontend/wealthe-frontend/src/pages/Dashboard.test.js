import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders, mockUser } from '../../__tests__/setup/testUtils';
import Dashboard from '../Dashboard';
import { mockApiResponses } from '../../__tests__/mocks/apiMocks';

// Mock the utils
jest.mock('../../utils/api', () => ({
  getUserInfo: jest.fn(),
  getTaxInfo: jest.fn(),
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    const { getUserInfo, getTaxInfo } = require('../../utils/api');
    
    // Mock APIs to return pending promises
    getUserInfo.mockImplementation(() => new Promise(() => {}));
    getTaxInfo.mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<Dashboard />, {
      user: mockUser,
      isAuthenticated: true,
    });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays user information after successful fetch', async () => {
    const { getUserInfo, getTaxInfo } = require('../../utils/api');
    
    const mockUserData = [
      {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        totalIncome: 50000,
        totalExpenses: 30000,
      }
    ];

    const mockTaxData = [
      {
        id: 1,
        email: 'test@example.com',
        taxAmount: 5000,
        taxableIncome: 45000,
      }
    ];

    getUserInfo.mockResolvedValue(mockUserData);
    getTaxInfo.mockResolvedValue(mockTaxData);

    renderWithProviders(<Dashboard />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('50000')).toBeInTheDocument(); // Income
    expect(screen.getByText('30000')).toBeInTheDocument(); // Expenses
  });

  it('displays error message when user info fetch fails', async () => {
    const { getUserInfo, getTaxInfo } = require('../../utils/api');
    
    getUserInfo.mockRejectedValue(new Error('Failed to fetch user info'));
    getTaxInfo.mockResolvedValue([]);

    renderWithProviders(<Dashboard />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to load user information')).toBeInTheDocument();
    });
  });

  it('displays error message when tax info fetch fails', async () => {
    const { getUserInfo, getTaxInfo } = require('../../utils/api');
    
    getUserInfo.mockResolvedValue([mockUser]);
    getTaxInfo.mockRejectedValue(new Error('Failed to fetch tax info'));

    renderWithProviders(<Dashboard />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to load tax information')).toBeInTheDocument();
    });
  });

  it('handles empty user data gracefully', async () => {
    const { getUserInfo, getTaxInfo } = require('../../utils/api');
    
    getUserInfo.mockResolvedValue(null);
    getTaxInfo.mockResolvedValue([]);

    renderWithProviders(<Dashboard />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to load user information')).toBeInTheDocument();
    });
  });

  it('handles empty tax data gracefully', async () => {
    const { getUserInfo, getTaxInfo } = require('../../utils/api');
    
    getUserInfo.mockResolvedValue([mockUser]);
    getTaxInfo.mockResolvedValue(null);

    renderWithProviders(<Dashboard />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to load tax information')).toBeInTheDocument();
    });
  });

  it('updates auth context user when tax info is fetched', async () => {
    const { getUserInfo, getTaxInfo } = require('../../utils/api');
    
    const mockTaxData = [
      {
        id: 1,
        email: 'updated@example.com',
        taxAmount: 5000,
      }
    ];

    getUserInfo.mockResolvedValue([mockUser]);
    getTaxInfo.mockResolvedValue(mockTaxData);

    const mockSetUser = jest.fn();
    
    renderWithProviders(<Dashboard />, {
      user: mockUser,
      isAuthenticated: true,
      setUser: mockSetUser,
    });

    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith({
        email: 'updated@example.com',
        id: 1,
      });
    });
  });

  it('displays dashboard sections', async () => {
    const { getUserInfo, getTaxInfo } = require('../../utils/api');
    
    getUserInfo.mockResolvedValue([mockUser]);
    getTaxInfo.mockResolvedValue([{ id: 1, email: 'test@example.com' }]);

    renderWithProviders(<Dashboard />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check if dashboard sections are rendered
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  it('makes API calls on component mount', async () => {
    const { getUserInfo, getTaxInfo } = require('../../utils/api');
    
    getUserInfo.mockResolvedValue([mockUser]);
    getTaxInfo.mockResolvedValue([{ id: 1, email: 'test@example.com' }]);

    renderWithProviders(<Dashboard />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(getUserInfo).toHaveBeenCalledTimes(1);
      expect(getTaxInfo).toHaveBeenCalledTimes(1);
    });
  });
});
