import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { renderWithProviders, mockUser } from '../../__tests__/setup/testUtils';
import Expenses from '../Expenses';

// Mock the API
jest.mock('../../utils/api', () => ({
  getExpenses: jest.fn(),
  deleteExpense: jest.fn(),
}));

describe('Expenses Component', () => {
  const mockExpenses = [
    {
      id: 1,
      amount: 100,
      description: 'Groceries',
      category: 'Food',
      date: '2023-01-01',
      type: 'FOOD',
    },
    {
      id: 2,
      amount: 50,
      description: 'Bus fare',
      category: 'Transport',
      date: '2023-01-02',
      type: 'TRANSPORT',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders expenses list', async () => {
    const { getExpenses } = require('../../utils/api');
    getExpenses.mockResolvedValue(mockExpenses);

    renderWithProviders(<Expenses />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByText('Groceries')).toBeInTheDocument();
      expect(screen.getByText('Bus fare')).toBeInTheDocument();
    });
  });

  it('shows loading state', () => {
    const { getExpenses } = require('../../utils/api');
    getExpenses.mockImplementation(() => new Promise(() => {}));

    renderWithProviders(<Expenses />, {
      user: mockUser,
      isAuthenticated: true,
    });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles empty expenses list', async () => {
    const { getExpenses } = require('../../utils/api');
    getExpenses.mockResolvedValue([]);

    renderWithProviders(<Expenses />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByText(/no expenses found/i)).toBeInTheDocument();
    });
  });

  it('handles API error', async () => {
    const { getExpenses } = require('../../utils/api');
    getExpenses.mockRejectedValue(new Error('Failed to fetch expenses'));

    renderWithProviders(<Expenses />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('displays expense details correctly', async () => {
    const { getExpenses } = require('../../utils/api');
    getExpenses.mockResolvedValue(mockExpenses);

    renderWithProviders(<Expenses />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByText('$100')).toBeInTheDocument();
      expect(screen.getByText('$50')).toBeInTheDocument();
      expect(screen.getByText('Food')).toBeInTheDocument();
      expect(screen.getByText('Transport')).toBeInTheDocument();
    });
  });

  it('handles expense deletion', async () => {
    const { getExpenses, deleteExpense } = require('../../utils/api');
    getExpenses.mockResolvedValue(mockExpenses);
    deleteExpense.mockResolvedValue({ success: true });

    renderWithProviders(<Expenses />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByText('Groceries')).toBeInTheDocument();
    });

    // Find and click delete button
    const deleteButton = screen.getAllByText(/delete/i)[0];
    deleteButton.click();

    await waitFor(() => {
      expect(deleteExpense).toHaveBeenCalledWith(1);
    });
  });
});
