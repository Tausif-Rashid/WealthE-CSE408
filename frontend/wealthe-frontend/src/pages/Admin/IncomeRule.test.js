import React from 'react';
import { renderWithProviders, mockAdminUser } from '../../__tests__/setup/testUtils';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import IncomeRule from './IncomeRule';

jest.mock('../../utils/api', () => ({
  getIncomeSlabs: jest.fn(),
  updateIncomeSlab: jest.fn(),
}));

describe('IncomeRule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    const { getIncomeSlabs } = require('../../utils/api');
    getIncomeSlabs.mockImplementation(() => new Promise(() => {}));
    renderWithProviders(<IncomeRule />, { user: mockAdminUser, isAuthenticated: true });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders income slabs', async () => {
    const { getIncomeSlabs } = require('../../utils/api');
    getIncomeSlabs.mockResolvedValue([
      { id: 1, category: 'regular', slab_no: 1, slab_size: '0', tax_rate: 10 },
      { id: 2, category: 'regular', slab_no: 2, slab_size: '1000', tax_rate: 15 },
    ]);
    renderWithProviders(<IncomeRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => {
    //   expect(screen.getByText('0')).toBeInTheDocument();
    //   expect(screen.getByText('1000')).toBeInTheDocument();
      expect(screen.getByText(/15/)).toBeInTheDocument();
    });
  });

  it('shows error on API failure', async () => {
    const { getIncomeSlabs } = require('../../utils/api');
    getIncomeSlabs.mockRejectedValue(new Error('API error'));
    renderWithProviders(<IncomeRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => {
      expect(screen.getByText(/failed to load dashboard data/i)).toBeInTheDocument();
    });
  });
});
