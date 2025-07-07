import React from 'react';
import { renderWithProviders, mockAdminUser } from '../../__tests__/setup/testUtils';
import { screen, waitFor } from '@testing-library/react';
import TaxZoneRule from './TaxZoneRule';

jest.mock('../../utils/api', () => ({
  getMinimumTaxList: jest.fn(),
  getTaxAreaList: jest.fn(),
  updateTaxZoneRule: jest.fn(),
  addTaxZoneRule: jest.fn(),
  deleteTaxZoneRule: jest.fn(),
}));

describe('TaxZoneRule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state', () => {
    const { getMinimumTaxList, getTaxAreaList } = require('../../utils/api');
    getMinimumTaxList.mockImplementation(() => new Promise(() => {}));
    getTaxAreaList.mockImplementation(() => new Promise(() => {}));
    renderWithProviders(<TaxZoneRule />, { user: mockAdminUser, isAuthenticated: true });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders tax zone data', async () => {
    const { getMinimumTaxList, getTaxAreaList } = require('../../utils/api');
    getMinimumTaxList.mockResolvedValue([
      { id: 1, area_name: 'Zone A', minimum: 500 },
      { id: 2, area_name: 'Rest', minimum: 100 },
    ]);
    getTaxAreaList.mockResolvedValue([
      { id: 1, name: 'Zone A' },
      { id: 2, name: 'Rest' },
    ]);
    renderWithProviders(<TaxZoneRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => {
      expect(screen.getByText('Zone A')).toBeInTheDocument();
      expect(screen.getByText('Rest')).toBeInTheDocument();
      expect(screen.getByText('500')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  it('shows error on API failure', async () => {
    const { getMinimumTaxList } = require('../../utils/api');
    getMinimumTaxList.mockRejectedValue(new Error('API error'));
    renderWithProviders(<TaxZoneRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => {
      expect(screen.getByText(/failed to load tax information/i)).toBeInTheDocument();
    });
  });

  it('allows editing a tax zone', async () => {
    const { getMinimumTaxList, getTaxAreaList, updateTaxZoneRule } = require('../../utils/api');
    getMinimumTaxList.mockResolvedValue([
      { id: 1, area_name: 'Zone A', minimum: 500 },
    ]);
    getTaxAreaList.mockResolvedValue([{ id: 1, name: 'Zone A' }]);
    updateTaxZoneRule.mockResolvedValue({ id: 1, area_name: 'Zone A', minimum: 600 });
    renderWithProviders(<TaxZoneRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => expect(screen.getByText('Zone A')).toBeInTheDocument());
    // Simulate edit button click
    screen.getByText('Edit').click();
    const input = screen.getByLabelText(/minimum/i);
    input.value = '600';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    screen.getByText('Save').click();
    await waitFor(() => expect(updateTaxZoneRule).toHaveBeenCalled());
  });

  it('shows error on failed edit', async () => {
    const { getMinimumTaxList, getTaxAreaList, updateTaxZoneRule } = require('../../utils/api');
    getMinimumTaxList.mockResolvedValue([
      { id: 1, area_name: 'Zone A', minimum: 500 },
    ]);
    getTaxAreaList.mockResolvedValue([{ id: 1, name: 'Zone A' }]);
    updateTaxZoneRule.mockRejectedValue(new Error('Update failed'));
    renderWithProviders(<TaxZoneRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => expect(screen.getByText('Zone A')).toBeInTheDocument());
    screen.getByText('Edit').click();
    const input = screen.getByLabelText(/minimum/i);
    input.value = '600';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    screen.getByText('Save').click();
    await waitFor(() => expect(screen.getByText(/failed/i)).toBeInTheDocument());
  });

  it('allows adding a new tax zone', async () => {
    const { getMinimumTaxList, getTaxAreaList, addTaxZoneRule } = require('../../utils/api');
    getMinimumTaxList.mockResolvedValue([]);
    getTaxAreaList.mockResolvedValue([{ id: 1, name: 'Zone B' }]);
    addTaxZoneRule.mockResolvedValue({ id: 2, area_name: 'Zone B', minimum: 200 });
    renderWithProviders(<TaxZoneRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => expect(screen.getByText(/add/i)).toBeInTheDocument());
    const input = screen.getByLabelText(/area_name/i);
    input.value = 'Zone B';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    screen.getByText('Add').click();
    await waitFor(() => expect(addTaxZoneRule).toHaveBeenCalled());
  });

  it('shows error on failed add', async () => {
    const { getMinimumTaxList, getTaxAreaList, addTaxZoneRule } = require('../../utils/api');
    getMinimumTaxList.mockResolvedValue([]);
    getTaxAreaList.mockResolvedValue([{ id: 1, name: 'Zone B' }]);
    addTaxZoneRule.mockRejectedValue(new Error('Add failed'));
    renderWithProviders(<TaxZoneRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => expect(screen.getByText(/add/i)).toBeInTheDocument());
    const input = screen.getByLabelText(/area_name/i);
    input.value = 'Zone B';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    screen.getByText('Add').click();
    await waitFor(() => expect(screen.getByText(/failed/i)).toBeInTheDocument());
  });

  it('allows deleting a tax zone', async () => {
    const { getMinimumTaxList, getTaxAreaList, deleteTaxZoneRule } = require('../../utils/api');
    getMinimumTaxList.mockResolvedValue([
      { id: 1, area_name: 'Zone A', minimum: 500 },
    ]);
    getTaxAreaList.mockResolvedValue([{ id: 1, name: 'Zone A' }]);
    deleteTaxZoneRule.mockResolvedValue({});
    renderWithProviders(<TaxZoneRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => expect(screen.getByText('Zone A')).toBeInTheDocument());
    screen.getByText('Delete').click();
    screen.getByText('Confirm').click();
    await waitFor(() => expect(deleteTaxZoneRule).toHaveBeenCalled());
  });

  it('shows error on failed delete', async () => {
    const { getMinimumTaxList, getTaxAreaList, deleteTaxZoneRule } = require('../../utils/api');
    getMinimumTaxList.mockResolvedValue([
      { id: 1, area_name: 'Zone A', minimum: 500 },
    ]);
    getTaxAreaList.mockResolvedValue([{ id: 1, name: 'Zone A' }]);
    deleteTaxZoneRule.mockRejectedValue(new Error('Delete failed'));
    renderWithProviders(<TaxZoneRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => expect(screen.getByText('Zone A')).toBeInTheDocument());
    screen.getByText('Delete').click();
    screen.getByText('Confirm').click();
    await waitFor(() => expect(screen.getByText(/failed/i)).toBeInTheDocument());
  });

  it('shows validation error for invalid input', async () => {
    const { getMinimumTaxList, getTaxAreaList, updateTaxZoneRule } = require('../../utils/api');
    getMinimumTaxList.mockResolvedValue([
      { id: 1, area_name: 'Zone A', minimum: 500 },
    ]);
    getTaxAreaList.mockResolvedValue([{ id: 1, name: 'Zone A' }]);
    updateTaxZoneRule.mockResolvedValue({ id: 1, area_name: 'Zone A', minimum: 500 });
    renderWithProviders(<TaxZoneRule />, { user: mockAdminUser, isAuthenticated: true });
    await waitFor(() => expect(screen.getByText('Zone A')).toBeInTheDocument());
    screen.getByText('Edit').click();
    const input = screen.getByLabelText(/minimum/i);
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    screen.getByText('Save').click();
    await waitFor(() => expect(screen.getByText(/please enter/i)).toBeInTheDocument());
  });
});
