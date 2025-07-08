import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockUser } from '../../__tests__/setup/testUtils';
import AddExpense from '../AddExpense';
import { mockNavigate, setupRouterMocks, resetUtilMocks } from '../../__tests__/mocks/utilMocks';

// Mock the utils
jest.mock('../../utils/api', () => ({
  getExpenseCategories: jest.fn(),
  addExpense: jest.fn(),
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}));

describe('AddExpense Component', () => {
  const user = userEvent.setup();
  
  const mockCategories = [
    { id: 1, name: 'Food', type: 'FOOD' },
    { id: 2, name: 'Transport', type: 'TRANSPORT' },
    { id: 3, name: 'Entertainment', type: 'ENTERTAINMENT' },
  ];

  beforeEach(() => {
    setupRouterMocks();
    const { useNavigate } = require('react-router');
    useNavigate.mockReturnValue(mockNavigate);
    
    const { getExpenseCategories, addExpense } = require('../../utils/api');
    getExpenseCategories.mockResolvedValue(mockCategories);
    addExpense.mockResolvedValue({ id: 1, success: true });
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    resetUtilMocks();
  });

  it('renders add expense form', async () => {
    renderWithProviders(<AddExpense />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByText(/add expense/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
  });

  it('loads expense categories on mount', async () => {
    const { getExpenseCategories } = require('../../utils/api');
    
    renderWithProviders(<AddExpense />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(getExpenseCategories).toHaveBeenCalledTimes(1);
    });

    // Check if categories are rendered in the select
    await waitFor(() => {
      expect(screen.getByText('Food')).toBeInTheDocument();
      expect(screen.getByText('Transport')).toBeInTheDocument();
      expect(screen.getByText('Entertainment')).toBeInTheDocument();
    });
  });

  
  it('handles recurring expense toggle', async () => {
    renderWithProviders(<AddExpense />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByText(/recurring/i)).toBeInTheDocument();
    });

    const recurringYes = screen.getByLabelText(/yes/i);
    await user.click(recurringYes);

    expect(recurringYes).toBeChecked();
    
    // Should show recurrence type options
    expect(screen.getByText(/weekly/i)).toBeInTheDocument();
    expect(screen.getByText(/monthly/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithProviders(<AddExpense />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByText(/add expense/i)).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please fill in all required fields/i)).toBeInTheDocument();
    });
  });

  it('handles form validation with HTML5 constraints', async () => {
    renderWithProviders(<AddExpense />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    });

    const amountInput = screen.getByLabelText(/amount/i);
    
    // Test that the input has the correct constraints
    expect(amountInput).toHaveAttribute('min', '0');
    expect(amountInput).toHaveAttribute('type', 'number');
    expect(amountInput).toHaveAttribute('step', '0.01');
    expect(amountInput).toHaveAttribute('required');
  });

  it('validates recurrence type when recurring is selected', async () => {
    renderWithProviders(<AddExpense />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    });

    // Fill out form but leave recurrence type empty
    await user.selectOptions(screen.getByLabelText(/type/i), 'Food');
    await user.type(screen.getByLabelText(/amount/i), '50');
    await user.type(screen.getByLabelText(/description/i), 'Test expense');
    await user.type(screen.getByLabelText(/date/i), '2023-01-01');
    
    // Set as recurring but don't select recurrence type
    const recurringYes = screen.getByLabelText(/yes/i);
    await user.click(recurringYes);

    const submitButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please select a recurrence type/i)).toBeInTheDocument();
    });
  });

  it('successfully submits expense', async () => {
    const { addExpense } = require('../../utils/api');
    
    renderWithProviders(<AddExpense />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    });

    // Fill out the form
    await user.selectOptions(screen.getByLabelText(/type/i), 'Food');
    await user.type(screen.getByLabelText(/amount/i), '50');
    await user.type(screen.getByLabelText(/description/i), 'Lunch');
    await user.type(screen.getByLabelText(/date/i), '2023-01-01');

    const submitButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(addExpense).toHaveBeenCalledWith({
        type: 'Food',
        amount: 50,
        description: 'Lunch',
        date: '2023-01-01',
        isRecurring: false,
        recurrenceType: null,
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/expenses');
  });

 

  it('handles recurring expense submission', async () => {
    const { addExpense } = require('../../utils/api');
    
    renderWithProviders(<AddExpense />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    });

    // Fill out the form with recurring expense
    await user.selectOptions(screen.getByLabelText(/type/i), 'Food');
    await user.type(screen.getByLabelText(/amount/i), '50');
    await user.type(screen.getByLabelText(/description/i), 'Monthly groceries');
    await user.type(screen.getByLabelText(/date/i), '2023-01-01');
    
    // Set as recurring
    const recurringYes = screen.getByLabelText(/yes/i);
    await user.click(recurringYes);
    
    // Wait for recurrence type dropdown to appear
    await waitFor(() => {
      expect(screen.getByLabelText(/recurrence type/i)).toBeInTheDocument();
    });
    
    // Select recurrence type
    await user.selectOptions(screen.getByLabelText(/recurrence type/i), 'monthly');

    const submitButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(addExpense).toHaveBeenCalledWith({
        type: 'Food',
        amount: 50,
        description: 'Monthly groceries',
        date: '2023-01-01',
        isRecurring: true,
        recurrenceType: 'monthly',
      });
    });
  });

  it('shows loading state during category fetch', () => {
    const { getExpenseCategories } = require('../../utils/api');
    
    // Mock to return a pending promise
    getExpenseCategories.mockImplementation(() => new Promise(() => {}));
    
    renderWithProviders(<AddExpense />, {
      user: mockUser,
      isAuthenticated: true,
    });

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles category fetch error', async () => {
    const { getExpenseCategories } = require('../../utils/api');
    getExpenseCategories.mockRejectedValue(new Error('Failed to fetch categories'));
    
    renderWithProviders(<AddExpense />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByText(/failed to load expense categories/i)).toBeInTheDocument();
    });
  });

  it('hides recurrence type when recurring is set to no', async () => {
    renderWithProviders(<AddExpense />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByText(/recurring/i)).toBeInTheDocument();
    });

    // First select "Yes" for recurring
    const recurringYes = screen.getByLabelText(/yes/i);
    await user.click(recurringYes);

    // Verify recurrence type dropdown appears
    await waitFor(() => {
      expect(screen.getByLabelText(/recurrence type/i)).toBeInTheDocument();
    });

    // Then select "No" for recurring
    const recurringNo = screen.getByLabelText(/no/i);
    await user.click(recurringNo);

    // Verify recurrence type dropdown disappears
    await waitFor(() => {
      expect(screen.queryByLabelText(/recurrence type/i)).not.toBeInTheDocument();
    });
  });
});
