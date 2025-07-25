import React from 'react';
import { screen, render } from '@testing-library/react';
import App from './App';
import { mockUser, mockAdminUser } from './__tests__/setup/testUtils';
import { mockAuthUtils, setupAuthMocks, resetUtilMocks } from './__tests__/mocks/utilMocks';

// Mock all the page components
jest.mock('./pages/Login', () => () => <div>Login Page</div>);
jest.mock('./pages/Register', () => () => <div>Register Page</div>);
jest.mock('./pages/Dashboard', () => () => <div data-testid="dashboard-page">Dashboard Page</div>);
jest.mock('./pages/Expenses', () => () => <div data-testid="expenses-page">Expenses Page</div>);
jest.mock('./pages/AddExpense', () => () => <div data-testid="add-expense-page">Add Expense Page</div>);
jest.mock('./pages/EditExpense', () => () => <div data-testid="edit-expense-page">Edit Expense Page</div>);
jest.mock('./pages/Income', () => () => <div data-testid="income-page">Income Page</div>);
jest.mock('./pages/AddIncome', () => () => <div data-testid="add-income-page">Add Income Page</div>);
jest.mock('./pages/EditIncome', () => () => <div data-testid="edit-income-page">Edit Income Page</div>);
jest.mock('./pages/TaxEstimation', () => () => <div data-testid="tax-estimation-page">Tax Estimation Page</div>);
jest.mock('./pages/UpdateProfile', () => () => <div data-testid="update-profile-page">Update Profile Page</div>);
jest.mock('./pages/ChangePassword', () => () => <div data-testid="change-password-page">Change Password Page</div>);
jest.mock('./pages/ChatBot', () => () => <div data-testid="chatbot-page">ChatBot Page</div>);
jest.mock('./pages/Admin/AdminDashboard', () => () => <div data-testid="admin-dashboard">Admin Dashboard</div>);
jest.mock('./pages/Admin/IncomeRule', () => () => <div data-testid="income-rule-page">Income Rule Page</div>);
jest.mock('./pages/Admin/InvestmentRule', () => () => <div data-testid="investment-rule-page">Investment Rule Page</div>);
jest.mock('./pages/Admin/RebateRule', () => () => <div data-testid="rebate-rule-page">Rebate Rule Page</div>);
jest.mock('./pages/Admin/TaxZoneRule', () => () => <div data-testid="tax-zone-rule-page">Tax Zone Rule Page</div>);

// Mock components
jest.mock('./components/Layout', () => ({ children }) => (
  <div data-testid="layout">{children}</div>
));
jest.mock('./components/ProtectedRoute', () => ({ children, requiredRole }) => (
  <div data-testid="protected-route" data-role={requiredRole}>{children}</div>
));

// Mock AuthContext
jest.mock('./components/AuthContext', () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
  useAuth: jest.fn(),
}));

// Mock utils
jest.mock('./utils/auth', () => ({
  getAuthRole: jest.fn(),
}));

// Mock react-router to control navigation and provide proper context
const mockNavigate = jest.fn();
const mockUseLocation = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  BrowserRouter: ({ children }) => <div data-testid="router">{children}</div>,
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: ({ element, path }) => (
    <div data-testid="route" data-path={path}>
      {element}
    </div>
  ),
  Navigate: ({ to, replace }) => (
    <div data-testid="navigate" data-to={to} data-replace={replace}>
      Navigate to {to}
    </div>
  ),
  useNavigate: () => mockNavigate,
  useLocation: () => mockUseLocation(),
}));

describe('App Component', () => {
  beforeEach(() => {
    setupAuthMocks();
    jest.clearAllMocks();
    
    // Setup default useLocation mock
    mockUseLocation.mockReturnValue({
      pathname: '/login',
      search: '',
      hash: '',
      state: null,
      key: 'default'
    });
  });

  afterEach(() => {
    resetUtilMocks();
  });

  it('renders the app structure', () => {
    const { useAuth } = require('./components/AuthContext');
    const { getAuthRole } = require('./utils/auth');
    
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });
    getAuthRole.mockReturnValue('user');

    render(<App />);

    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
    expect(screen.getByTestId('router')).toBeInTheDocument();
    expect(screen.getByTestId('routes')).toBeInTheDocument();
  });

  it('renders login page when not authenticated', () => {
    const { useAuth } = require('./components/AuthContext');
    const { getAuthRole } = require('./utils/auth');
    
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });
    getAuthRole.mockReturnValue('user');

    render(<App />);

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to user dashboard when authenticated as user', () => {
    const { useAuth } = require('./components/AuthContext');
    const { getAuthRole } = require('./utils/auth');
    
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    });
    getAuthRole.mockReturnValue('user');

    render(<App />);

    // When authenticated, login route should show navigate component
    const item = screen.getAllByText('Navigate to /dashboard');
    expect(item.length).toBeGreaterThan(0);
    //expect(screen.getByText('Navigate to /dashboard')).toBeInTheDocument();
  });

  it('redirects to admin dashboard when authenticated as admin', () => {
    const { useAuth } = require('./components/AuthContext');
    const { getAuthRole } = require('./utils/auth');
    
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: mockAdminUser,
    });
    getAuthRole.mockReturnValue('admin');

    render(<App />);

    // When authenticated as admin, login route should show navigate to admin dashboard
    const item = screen.getAllByText('Navigate to /admin/dashboard');
    expect(item.length).toBeGreaterThan(0);
  });

  it('renders protected routes with correct role requirements', () => {
    const { useAuth } = require('./components/AuthContext');
    const { getAuthRole } = require('./utils/auth');
    
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    });
    getAuthRole.mockReturnValue('user');

    render(<App />);

    // Check if protected routes are rendered
    const protectedRoutes = screen.getAllByTestId('protected-route');
    expect(protectedRoutes.length).toBeGreaterThan(0);
  });

  // it('renders admin routes with admin role requirement', () => {
  //   const { useAuth } = require('./components/AuthContext');
  //   const { getAuthRole } = require('./utils/auth');
    
  //   useAuth.mockReturnValue({
  //     isAuthenticated: true,
  //     user: mockAdminUser,
  //   });
  //   getAuthRole.mockReturnValue('admin');

  //   render(<App />);

  //   // Check if admin routes are rendered with admin role requirement
  //   const adminRoutes = screen.getAllByTestId('protected-route');
  //   const adminRoleRoutes = adminRoutes.filter(route => 
  //     route.getAttribute('data-role') === 'admin'
  //   );
  //   expect(adminRoleRoutes.length).toBeGreaterThan(0);
  // });

  it('renders all expected page components', () => {
    const { useAuth } = require('./components/AuthContext');
    const { getAuthRole } = require('./utils/auth');
    
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    });
    getAuthRole.mockReturnValue('user');

    render(<App />);

    // Check if all main pages are rendered in the route structure
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    expect(screen.getByTestId('expenses-page')).toBeInTheDocument();
    expect(screen.getByTestId('add-expense-page')).toBeInTheDocument();
  });

  it('renders admin pages when authenticated as admin', () => {
    const { useAuth } = require('./components/AuthContext');
    const { getAuthRole } = require('./utils/auth');
    
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: mockAdminUser,
    });
    getAuthRole.mockReturnValue('admin');

    render(<App />);

    // Check if admin pages are rendered
    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('income-rule-page')).toBeInTheDocument();
    expect(screen.getByTestId('investment-rule-page')).toBeInTheDocument();
    expect(screen.getByTestId('rebate-rule-page')).toBeInTheDocument();
    expect(screen.getByTestId('tax-zone-rule-page')).toBeInTheDocument();
  });

  it('renders register page', () => {
    const { useAuth } = require('./components/AuthContext');
    const { getAuthRole } = require('./utils/auth');
    
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });
    getAuthRole.mockReturnValue('user');

    render(<App />);

    expect(screen.getByText('Register Page')).toBeInTheDocument();
  });

  it('wraps routes with Layout component', () => {
    const { useAuth } = require('./components/AuthContext');
    const { getAuthRole } = require('./utils/auth');
    
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: mockUser,
    });
    getAuthRole.mockReturnValue('user');

    render(<App />);

    // Check if Layout component is rendered
    const item = screen.getAllByTestId('layout');
    expect(item.length).toBeGreaterThan(0);
  });

  it('handles null user gracefully', () => {
    const { useAuth } = require('./components/AuthContext');
    const { getAuthRole } = require('./utils/auth');
    
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });
    getAuthRole.mockReturnValue('user');

    expect(() => render(<App />)).not.toThrow();
  });

  it('handles different auth states', () => {
    const { useAuth } = require('./components/AuthContext');
    const { getAuthRole } = require('./utils/auth');
    
    // Test loading state
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: true,
    });
    getAuthRole.mockReturnValue('user');

    render(<App />);

    // Should still render the app structure
    expect(screen.getByTestId('auth-provider')).toBeInTheDocument();
  });
});