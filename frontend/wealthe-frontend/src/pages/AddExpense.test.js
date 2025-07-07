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

  it('handles form input changes', async () => {
    renderWithProviders(<AddExpense />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    });

    const amountInput = screen.getByLabelText(/amount/i);
    const descriptionInput = screen.getByLabelText(/description/i);

    await user.type(amountInput, '100');
    await user.type(descriptionInput, 'Test expense');

    expect(amountInput).toHaveValue('100');
    expect(descriptionInput).toHaveValue('Test expense');
  });

  it('handles category selection', async () => {
    renderWithProviders(<AddExpense />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    });

    const typeSelect = screen.getByLabelText(/type/i);
    await user.selectOptions(typeSelect, 'FOOD');

    expect(typeSelect).toHaveValue('FOOD');
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
      expect(screen.getByText(/please select a type/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter amount/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter description/i)).toBeInTheDocument();
      expect(screen.getByText(/please select date/i)).toBeInTheDocument();
    });
  });

  it('validates amount is positive', async () => {
    renderWithProviders(<AddExpense />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    });

    const amountInput = screen.getByLabelText(/amount/i);
    const submitButton = screen.getByRole('button', { name: /add expense/i });

    await user.type(amountInput, '-100');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/amount must be positive/i)).toBeInTheDocument();
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
    await user.selectOptions(screen.getByLabelText(/type/i), 'FOOD');
    await user.type(screen.getByLabelText(/amount/i), '50');
    await user.type(screen.getByLabelText(/description/i), 'Lunch');
    await user.type(screen.getByLabelText(/date/i), '2023-01-01');

    const submitButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(addExpense).toHaveBeenCalledWith({
        type: 'FOOD',
        amount: '50',
        description: 'Lunch',
        date: '2023-01-01',
        isRecurring: false,
        recurrenceType: '',
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/expenses');
  });

  it('handles expense submission error', async () => {
    const { addExpense } = require('../../utils/api');
    addExpense.mockRejectedValue(new Error('Failed to add expense'));
    
    renderWithProviders(<AddExpense />, {
      user: mockUser,
      isAuthenticated: true,
    });

    await waitFor(() => {
      expect(screen.getByLabelText(/type/i)).toBeInTheDocument();
    });

    // Fill out the form
    await user.selectOptions(screen.getByLabelText(/type/i), 'FOOD');
    await user.type(screen.getByLabelText(/amount/i), '50');
    await user.type(screen.getByLabelText(/description/i), 'Lunch');
    await user.type(screen.getByLabelText(/date/i), '2023-01-01');

    const submitButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to add expense/i)).toBeInTheDocument();
    });
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
    await user.selectOptions(screen.getByLabelText(/type/i), 'FOOD');
    await user.type(screen.getByLabelText(/amount/i), '50');
    await user.type(screen.getByLabelText(/description/i), 'Monthly groceries');
    await user.type(screen.getByLabelText(/date/i), '2023-01-01');
    
    // Set as recurring
    const recurringYes = screen.getByLabelText(/yes/i);
    await user.click(recurringYes);
    
    // Select recurrence type
    const monthlyOption = screen.getByLabelText(/monthly/i);
    await user.click(monthlyOption);

    const submitButton = screen.getByRole('button', { name: /add expense/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(addExpense).toHaveBeenCalledWith({
        type: 'FOOD',
        amount: '50',
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
});
