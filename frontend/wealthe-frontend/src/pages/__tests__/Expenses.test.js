import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { renderWithProviders, mockUser } from '../../__tests__/setup/testUtils';
import Expenses from '../Expenses';
import { act } from '@testing-library/react';

// Mock the API
jest.mock('../../utils/api', () => ({
  getUserExpense: jest.fn(),
  getExpenseCategories: jest.fn(),
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
    const { getUserExpense, getExpenseCategories } = require('../../utils/api');
    getUserExpense.mockResolvedValue(mockExpenses);
    getExpenseCategories.mockResolvedValue([
      { id: 1, name: 'Food' },
      { id: 2, name: 'Transport' },
    ]);

    renderWithProviders(<Expenses />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByText('Groceries')).toBeInTheDocument();
      expect(screen.getByText('Bus fare')).toBeInTheDocument();
    });
  });

  // it('shows loading state', () => {
  //   const { getUserExpense } = require('../../utils/api');
  //   getUserExpense.mockImplementation(() => new Promise(() => {}));

  //   renderWithProviders(<Expenses />, {
  //     user: mockUser,
  //     isAuthenticated: true,
  //   });

  //   expect(screen.getByText(/loading/i)).toBeInTheDocument();
  // });

  it('handles empty expenses list', async () => {
    const { getUserExpense,getExpenseCategories } = require('../../utils/api');
    getUserExpense.mockResolvedValue([]);
    getExpenseCategories.mockResolvedValue([
      { id: 1, name: 'Food' },
      { id: 2, name: 'Transport' },
    ]);

    renderWithProviders(<Expenses />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByText(/no expenses found/i)).toBeInTheDocument();
    });
  });

  it('handles API error', async () => {
    const { getUserExpense, getExpenseCategories } = require('../../utils/api');
    getUserExpense.mockRejectedValue(new Error('Failed to fetch expenses'));
    

    renderWithProviders(<Expenses />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('displays expense details correctly', async () => {
    const { getUserExpense,getExpenseCategories } = require('../../utils/api');
    getUserExpense.mockResolvedValue(mockExpenses);
    getExpenseCategories.mockResolvedValue([
      { id: 1, name: 'Food' },
      { id: 2, name: 'Transport' },
    ]);

    renderWithProviders(<Expenses />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByText(/100/)).toBeInTheDocument();
      expect(screen.getByText(/50/)).toBeInTheDocument();
      expect(screen.getByText(/Food/i)).toBeInTheDocument();
      expect(screen.getByText(/Transport/i)).toBeInTheDocument();
    });
  });

  it('handles expense deletion', async () => {
    const { getUserExpense, deleteExpense, getExpenseCategories } = require('../../utils/api');
    getUserExpense.mockResolvedValue(mockExpenses);
    getExpenseCategories.mockResolvedValue([
      { id: 1, name: 'Food' },
      { id: 2, name: 'Transport' },
    ]);
    deleteExpense.mockResolvedValue({ success: true });

    renderWithProviders(<Expenses />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByText('Groceries')).toBeInTheDocument();
    });

    // Find and click delete button to open dialog
    expect(screen.getAllByText(/delete/i).length).toBeGreaterThan(0);
    const deleteButton = screen.getAllByText(/delete/i)[0];
    act(() => {fireEvent.click(deleteButton)});
    //deleteButton.click();

    // Wait for confirmation dialog to appear
    await waitFor(() => {
      expect(screen.getByText(/are you sure you want to delete this expense/i)).toBeInTheDocument();
    });

    // Click the confirm delete button in the dialog
    const confirmDeleteButton = screen.getAllByRole('button', { name: /confirm delete/i });
    //confirmDeleteButton[0].click();

    act(() => {
      /* fire events that update state */
      // Verify the dialog is closed
      fireEvent.click(confirmDeleteButton[0]);
    });


    // Verify the API was called
    await waitFor(() => {
      expect(deleteExpense).toHaveBeenCalledWith(1);
    });
  });

  it('handles expense deletion cancellation', async () => {
    const { getUserExpense, deleteExpense, getExpenseCategories } = require('../../utils/api');
    getUserExpense.mockResolvedValue(mockExpenses);
    getExpenseCategories.mockResolvedValue([
      { id: 1, name: 'Food' },
      { id: 2, name: 'Transport' },
    ]);
    deleteExpense.mockResolvedValue({ success: true });

    renderWithProviders(<Expenses />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByText('Groceries')).toBeInTheDocument();
    });

    // Find and click delete button to open dialog
    const deleteButton = screen.getAllByText(/delete/i)[0];
    act(() => {fireEvent.click(deleteButton)});
    

    // Wait for confirmation dialog to appear
    await waitFor(() => {
      expect(screen.getByText(/are you sure you want to delete this expense/i)).toBeInTheDocument();
    });

    // Click the cancel button in the dialog
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    act(() => {
      /* fire events that update state */
      //cancelButton.click();
      fireEvent.click(cancelButton);
    });
    
    

    // Verify the dialog is closed and API was not called
    await waitFor(() => {
      expect(screen.queryByText(/are you sure you want to delete this expense/i)).not.toBeInTheDocument();
    });
    expect(deleteExpense).not.toHaveBeenCalled();
  });

  // it('handles expense deletion API error', async () => {
  //   const { getUserExpense, deleteExpense, getExpenseCategories } = require('../../utils/api');
  //   getUserExpense.mockResolvedValue(mockExpenses);
  //   getExpenseCategories.mockResolvedValue([
  //     { id: 1, name: 'Food' },
  //     { id: 2, name: 'Transport' },
  //   ]);
  //   deleteExpense.mockRejectedValue(new Error('Failed to delete expense'));

  //   renderWithProviders(<Expenses />, {
  //     user: mockUser,
  //     isAuthenticated: true,
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByText('Groceries')).toBeInTheDocument();
  //   });

  //   // Find and click delete button to open dialog
  //   const deleteButton = screen.getAllByText(/delete/i)[0];
  //   deleteButton.click();

  //   // Wait for confirmation dialog to appear
  //   await waitFor(() => {
  //     expect(screen.getByText(/are you sure you want to delete this expense/i)).toBeInTheDocument();
  //   });

  //   // Click the confirm delete button in the dialog
  //   const confirmDeleteButton = screen.getByRole('button', { name: /delete/i });
  //   confirmDeleteButton.click();

  //   // Verify error handling
  //   await waitFor(() => {
  //     expect(deleteExpense).toHaveBeenCalledWith(1);
  //     expect(screen.getByText(/failed to delete expense/i)).toBeInTheDocument();
  //   });
  // });

  // it('handles expense editing', async () => {
  //   const { getUserExpense, getExpenseCategories } = require('../../utils/api');
  //   getUserExpense.mockResolvedValue(mockExpenses);
  //   getExpenseCategories.mockResolvedValue([
  //     { id: 1, name: 'Food' },
  //     { id: 2, name: 'Transport' },
  //   ]);

  //   const mockNavigate = jest.fn();
  //   jest.mock('react-router', () => ({
  //     ...jest.requireActual('react-router'),
  //     useNavigate: () => mockNavigate,
  //   }));

  //   renderWithProviders(<Expenses />, {
  //     user: mockUser,
  //     isAuthenticated: true,
  //   });

  //   await waitFor(() => {
  //     expect(screen.getByText('Groceries')).toBeInTheDocument();
  //   });

  //   // Find and click edit button
  //   const editButtons = screen.getAllByText(/edit/i);
  //   expect(editButtons.length).toBeGreaterThan(0);
  //   editButtons[0].click();

  //   // Verify navigation was called (edit functionality navigates to edit page)
  //   await waitFor(() => {
  //     expect(mockNavigate).toHaveBeenCalledWith('/edit-expense', { state: { expenseId: 1 } });
  //   });
  // });
});
