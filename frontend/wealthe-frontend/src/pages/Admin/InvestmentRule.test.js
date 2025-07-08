import React, { act } from 'react';
import { renderWithProviders, mockAdminUser } from '../../__tests__/setup/testUtils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
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
      { id: 1, title: 'Stocks', rate_rebate: 10, minimum: 1000, maximum: 10000, description: 'Stock investments' },
    ]);
    updateInvestmentCategory.mockResolvedValue({ id: 1, title: 'Stocks', rate_rebate: 15, minimum: 1000, maximum: 10000, description: 'Stock investments' });
    renderWithProviders(<InvestmentRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => expect(screen.getByText('Stocks')).toBeInTheDocument());
    
    // Click edit button
    fireEvent.click(screen.getByText('Edit'));
    
    // Wait for form to appear and get the rate_rebate input by name
    await waitFor(() => {
      expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    });
    
    const rateInput = screen.getByDisplayValue('10');
    fireEvent.change(rateInput, { target: { value: '15' } });
    
    // Click update button
    fireEvent.click(screen.getByText('Update Category'));
    
    await waitFor(() => {
      expect(updateInvestmentCategory).toHaveBeenCalledWith(1, expect.objectContaining({
        rate_rebate: '15'
      }));
    });
  });

  it('shows error on failed edit', async () => {
    const { getInvestmentCategories, updateInvestmentCategory } = require('../../utils/api');
    getInvestmentCategories.mockResolvedValue([
      { id: 1, title: 'Stocks', rate_rebate: 10, minimum: 1000, maximum: 10000, description: 'Stock investments' },
    ]);
    updateInvestmentCategory.mockRejectedValue(new Error('Update failed'));
    renderWithProviders(<InvestmentRule />, { user: mockAdminUser, isAuthenticated: true });
    
    await waitFor(() => expect(screen.getByText('Stocks')).toBeInTheDocument());
    
    fireEvent.click(screen.getByText('Edit'));
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    });
    
    const rateInput = screen.getByDisplayValue('10');
    fireEvent.change(rateInput, { target: { value: '15' } });
    
    fireEvent.click(screen.getByText('Update Category'));
    
    await waitFor(() => {
      expect(screen.getByText(/failed to update category/i)).toBeInTheDocument();
    });
  });



 

  it('allows canceling delete operation', async () => {
    const { getInvestmentCategories, deleteInvestmentCategory } = require('../../utils/api');
    getInvestmentCategories.mockResolvedValue([
      { id: 1, title: 'Stocks', rate_rebate: 10, minimum: 1000, maximum: 10000, description: 'Stock investments' },
    ]);
    
    renderWithProviders(<InvestmentRule />, { user: mockAdminUser, isAuthenticated: true });
    
    await waitFor(() => expect(screen.getByText('Stocks')).toBeInTheDocument());
    
    // Click delete button
    fireEvent.click(screen.getByText('Delete'));
    
    // Wait for confirmation dialog
    await waitFor(() => {
      expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    });
    
    // Cancel deletion
    fireEvent.click(screen.getByText('Cancel'));
    
    await waitFor(() => {
      expect(screen.queryByText('Confirm Delete')).not.toBeInTheDocument();
    });
    
    expect(deleteInvestmentCategory).not.toHaveBeenCalled();
  });

  it('allows canceling edit operation', async () => {
    const { getInvestmentCategories } = require('../../utils/api');
    getInvestmentCategories.mockResolvedValue([
      { id: 1, title: 'Stocks', rate_rebate: 10, minimum: 1000, maximum: 10000, description: 'Stock investments' },
    ]);
    
    renderWithProviders(<InvestmentRule />, { user: mockAdminUser, isAuthenticated: true });
    
    await waitFor(() => expect(screen.getByText('Stocks')).toBeInTheDocument());
    
    // Click edit button
    fireEvent.click(screen.getByText('Edit'));
    
    // Wait for form to appear
    await waitFor(() => {
      expect(screen.getByText('Edit Investment Category')).toBeInTheDocument();
    });
    
    // Click cancel button
    fireEvent.click(screen.getByText('Cancel'));
    
    await waitFor(() => {
      expect(screen.queryByText('Edit Investment Category')).not.toBeInTheDocument();
    });
  });
});
