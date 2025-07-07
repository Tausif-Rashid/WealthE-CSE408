// API mocks for testing
export const mockApi = {
  login: jest.fn(),
  getUserInfo: jest.fn(),
  getExpenses: jest.fn(),
  addExpense: jest.fn(),
  updateExpense: jest.fn(),
  deleteExpense: jest.fn(),
  getDashboardData: jest.fn(),
};

// Mock API responses
export const mockApiResponses = {
  login: {
    token: 'mock-token',
    user: {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    },
  },
  loginError: {
    message: 'Invalid credentials',
  },
  userInfo: {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
  },
  expenses: [
    {
      id: 1,
      amount: 100,
      description: 'Test expense',
      category: 'Food',
      date: '2023-01-01',
    },
    {
      id: 2,
      amount: 200,
      description: 'Another expense',
      category: 'Transport',
      date: '2023-01-02',
    },
  ],
  dashboard: {
    totalExpenses: 1000,
    totalIncome: 5000,
    balance: 4000,
    recentTransactions: [
      {
        id: 1,
        amount: 100,
        description: 'Test expense',
        type: 'expense',
        date: '2023-01-01',
      },
    ],
  },
};

// Reset all mocks
export const resetAllMocks = () => {
  Object.values(mockApi).forEach(mock => {
    if (jest.isMockFunction(mock)) {
      mock.mockReset();
    }
  });
};

// Setup default mock implementations
export const setupDefaultMocks = () => {
  mockApi.login.mockResolvedValue(mockApiResponses.login);
  mockApi.getUserInfo.mockResolvedValue(mockApiResponses.userInfo);
  mockApi.getExpenses.mockResolvedValue(mockApiResponses.expenses);
  mockApi.getDashboardData.mockResolvedValue(mockApiResponses.dashboard);
};
