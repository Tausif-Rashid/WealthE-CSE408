import React from 'react';
import { renderWithProviders, mockAdminUser } from '../../__tests__/setup/testUtils';
import { screen, waitFor } from '@testing-library/react';
import InvestmentRule from './InvestmentRule';

// Add mocks for update, add, and delete API functions
jest.mock('../../utils/api', () => ({
  getInvestmentCategories: jest.fn(),
  updateInvestmentCategory: jest.fn(),
  addInvestmentCategory: jest.fn(),
  deleteInvestmentCategory: jest.fn(),
}));

describe('InvestmentRule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    const { getInvestmentCategories } = require('../../utils/api');
    getInvestmentCategories.mockImplementation(() => new Promise(() => {}));
    renderWithProviders(<InvestmentRule />, { user: mockAdminUser, isAuthenticated: true });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders investment categories', async () => {
    const { getInvestmentCategories } = require('../../utils/api');
    getInvestmentCategories.mockResolvedValue([
      { id: 1, title: 'Stocks', rate_rebate: 10 },
      { id: 2, title: 'Bonds', rate_rebate: 5 },
    ]);
    renderWithProviders(<InvestmentRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => {
      expect(screen.getByText('Stocks')).toBeInTheDocument();
      expect(screen.getByText('Bonds')).toBeInTheDocument();
    });
  });

  it('shows error on API failure', async () => {
    const { getInvestmentCategories } = require('../../utils/api');
    getInvestmentCategories.mockRejectedValue(new Error('API error'));
    renderWithProviders(<InvestmentRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => {
      expect(screen.getByText(/failed to load investment data/i)).toBeInTheDocument();
    });
  });

  it('allows editing an investment category', async () => {
    const { getInvestmentCategories, updateInvestmentCategory } = require('../../utils/api');
    getInvestmentCategories.mockResolvedValue([
      { id: 1, title: 'Stocks', rate_rebate: 10 },
    ]);
    updateInvestmentCategory.mockResolvedValue({ id: 1, title: 'Stocks', rate_rebate: 15 });
    renderWithProviders(<InvestmentRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => expect(screen.getByText('Stocks')).toBeInTheDocument());
    // Simulate edit button click (assume button has text 'Edit')
    screen.getByText('Edit').click();
    // Simulate input change (assume input for rate_rebate)
    const input = screen.getByLabelText(/rate_rebate/i);
    input.value = '15';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    // Simulate save button click
    screen.getByText('Save').click();
    await waitFor(() => expect(updateInvestmentCategory).toHaveBeenCalled());
  });

  it('shows error on failed edit', async () => {
    const { getInvestmentCategories, updateInvestmentCategory } = require('../../utils/api');
    getInvestmentCategories.mockResolvedValue([
      { id: 1, title: 'Stocks', rate_rebate: 10 },
    ]);
    updateInvestmentCategory.mockRejectedValue(new Error('Update failed'));
    renderWithProviders(<InvestmentRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => expect(screen.getByText('Stocks')).toBeInTheDocument());
    screen.getByText('Edit').click();
    const input = screen.getByLabelText(/rate_rebate/i);
    input.value = '15';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    screen.getByText('Save').click();
    await waitFor(() => expect(screen.getByText(/failed/i)).toBeInTheDocument());
  });

  it('allows adding a new investment category', async () => {
    const { getInvestmentCategories, addInvestmentCategory } = require('../../utils/api');
    getInvestmentCategories.mockResolvedValue([]);
    addInvestmentCategory.mockResolvedValue({ id: 2, title: 'Mutual Funds', rate_rebate: 8 });
    renderWithProviders(<InvestmentRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => expect(screen.getByText(/add/i)).toBeInTheDocument());
    // Simulate add form input and submit
    const input = screen.getByLabelText(/title/i);
    input.value = 'Mutual Funds';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    screen.getByText('Add').click();
    await waitFor(() => expect(addInvestmentCategory).toHaveBeenCalled());
  });

  it('shows error on failed add', async () => {
    const { getInvestmentCategories, addInvestmentCategory } = require('../../utils/api');
    getInvestmentCategories.mockResolvedValue([]);
    addInvestmentCategory.mockRejectedValue(new Error('Add failed'));
    renderWithProviders(<InvestmentRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => expect(screen.getByText(/add/i)).toBeInTheDocument());
    const input = screen.getByLabelText(/title/i);
    input.value = 'Mutual Funds';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    screen.getByText('Add').click();
    await waitFor(() => expect(screen.getByText(/failed/i)).toBeInTheDocument());
  });

  it('allows deleting an investment category', async () => {
    const { getInvestmentCategories, deleteInvestmentCategory } = require('../../utils/api');
    getInvestmentCategories.mockResolvedValue([
      { id: 1, title: 'Stocks', rate_rebate: 10 },
    ]);
    deleteInvestmentCategory.mockResolvedValue({});
    renderWithProviders(<InvestmentRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => expect(screen.getByText('Stocks')).toBeInTheDocument());
    // Simulate delete button click (assume button has text 'Delete')
    screen.getByText('Delete').click();
    // Simulate confirm in dialog
    screen.getByText('Confirm').click();
    await waitFor(() => expect(deleteInvestmentCategory).toHaveBeenCalled());
  });

  it('shows error on failed delete', async () => {
    const { getInvestmentCategories, deleteInvestmentCategory } = require('../../utils/api');
    getInvestmentCategories.mockResolvedValue([
      { id: 1, title: 'Stocks', rate_rebate: 10 },
    ]);
    deleteInvestmentCategory.mockRejectedValue(new Error('Delete failed'));
    renderWithProviders(<InvestmentRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => expect(screen.getByText('Stocks')).toBeInTheDocument());
    screen.getByText('Delete').click();
    screen.getByText('Confirm').click();
    await waitFor(() => expect(screen.getByText(/failed/i)).toBeInTheDocument());
  });

  it('shows validation error for invalid input', async () => {
    const { getInvestmentCategories, updateInvestmentCategory } = require('../../utils/api');
    getInvestmentCategories.mockResolvedValue([
      { id: 1, title: 'Stocks', rate_rebate: 10 },
    ]);
    updateInvestmentCategory.mockResolvedValue({ id: 1, title: 'Stocks', rate_rebate: 10 });
    renderWithProviders(<InvestmentRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => expect(screen.getByText('Stocks')).toBeInTheDocument());
    screen.getByText('Edit').click();
    const input = screen.getByLabelText(/rate_rebate/i);
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    screen.getByText('Save').click();
    await waitFor(() => expect(screen.getByText(/please enter/i)).toBeInTheDocument());
  });
});
