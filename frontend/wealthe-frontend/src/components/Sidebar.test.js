import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders, mockUser, mockAdminUser } from '../../__tests__/setup/testUtils';
import Sidebar from '../Sidebar';
import { mockUseLocation, setupRouterMocks, resetUtilMocks } from '../../__tests__/mocks/utilMocks';

// Mock react-router
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  Link: ({ to, children, className }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
  useLocation: jest.fn(),
}));

describe('Sidebar Component', () => {
  beforeEach(() => {
    setupRouterMocks();
    mockUseLocation.mockReturnValue({
      pathname: '/dashboard',
      search: '',
      state: null,
    });
  });

  afterEach(() => {
    resetUtilMocks();
  });

  it('renders sidebar with WealthE header', () => {
    renderWithProviders(<Sidebar />, {
      user: mockUser,
      isAuthenticated: true,
    });

    expect(screen.getByText('WealthE')).toBeInTheDocument();
  });

  it('displays user information', () => {
    renderWithProviders(<Sidebar />, {
      user: mockUser,
      isAuthenticated: true,
    });

    expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    expect(screen.getByText(mockUser.role)).toBeInTheDocument();
  });

  it('displays default user role when role is not provided', () => {
    const userWithoutRole = { ...mockUser, role: undefined };
    renderWithProviders(<Sidebar />, {
      user: userWithoutRole,
      isAuthenticated: true,
    });

    expect(screen.getByText('user')).toBeInTheDocument();
  });

  it('renders navigation items for regular user', () => {
    renderWithProviders(<Sidebar />, {
      user: mockUser,
      isAuthenticated: true,
    });

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Expenses')).toBeInTheDocument();
    expect(screen.getByText('Income')).toBeInTheDocument();
    expect(screen.getByText('Goals')).toBeInTheDocument();
  });

  it('highlights active navigation item', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/expenses',
      search: '',
      state: null,
    });

    renderWithProviders(<Sidebar />, {
      user: mockUser,
      isAuthenticated: true,
    });

    const expensesLink = screen.getByText('Expenses').closest('a');
    expect(expensesLink).toHaveClass('active');
  });

  it('does not highlight inactive navigation items', () => {
    mockUseLocation.mockReturnValue({
      pathname: '/dashboard',
      search: '',
      state: null,
    });

    renderWithProviders(<Sidebar />, {
      user: mockUser,
      isAuthenticated: true,
    });

    const expensesLink = screen.getByText('Expenses').closest('a');
    expect(expensesLink).not.toHaveClass('active');
  });

  it('renders correct navigation links', () => {
    renderWithProviders(<Sidebar />, {
      user: mockUser,
      isAuthenticated: true,
    });

    expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/dashboard');
    expect(screen.getByText('Expenses').closest('a')).toHaveAttribute('href', '/expenses');
    expect(screen.getByText('Income').closest('a')).toHaveAttribute('href', '/income');
    expect(screen.getByText('Goals').closest('a')).toHaveAttribute('href', '/goals');
  });

  it('renders with icons for navigation items', () => {
    renderWithProviders(<Sidebar />, {
      user: mockUser,
      isAuthenticated: true,
    });

    // Check if icons are rendered (emojis in this case)
    expect(screen.getByText('🏠')).toBeInTheDocument(); // Dashboard
    expect(screen.getByText('💸')).toBeInTheDocument(); // Expenses
    expect(screen.getByText('💰')).toBeInTheDocument(); // Income
    expect(screen.getByText('🎯')).toBeInTheDocument(); // Goals
  });

  it('handles missing user gracefully', () => {
    renderWithProviders(<Sidebar />, {
      user: null,
      isAuthenticated: false,
    });

    expect(screen.getByText('WealthE')).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument(); // default role
  });

  it('renders navigation items even without user', () => {
    renderWithProviders(<Sidebar />, {
      user: null,
      isAuthenticated: false,
    });

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Expenses')).toBeInTheDocument();
    expect(screen.getByText('Income')).toBeInTheDocument();
    expect(screen.getByText('Goals')).toBeInTheDocument();
  });
});
