import React from 'react';
import { renderWithProviders, mockAdminUser } from '../../__tests__/setup/testUtils';
import { screen, waitFor } from '@testing-library/react';
import RebateRule from './RebateRule';

jest.mock('../../utils/api', () => ({
  getRebateRules: jest.fn(),
}));

describe('RebateRule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    const { getRebateRules } = require('../../utils/api');
    getRebateRules.mockImplementation(() => new Promise(() => {}));
    renderWithProviders(<RebateRule />, { user: mockAdminUser, isAuthenticated: true });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders rebate rule data', async () => {
    const { getRebateRules } = require('../../utils/api');
    getRebateRules.mockResolvedValue([{ id: 1, maximum: 1000, max_of_income: 20 }]);
    renderWithProviders(<RebateRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => {
      // expect(screen.getByText('1000')).toBeInTheDocument();
      expect(screen.getByText(/20/)).toBeInTheDocument();
    });
  });

  it('shows error on API failure', async () => {
    const { getRebateRules } = require('../../utils/api');
    getRebateRules.mockRejectedValue(new Error('API error'));
    renderWithProviders(<RebateRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => {
      expect(screen.getByText(/failed to load rebate rules/i)).toBeInTheDocument();
    });
  });
});
