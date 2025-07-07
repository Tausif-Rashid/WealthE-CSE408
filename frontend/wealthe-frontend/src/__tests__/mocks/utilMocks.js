// Mock implementations for utils
export const mockAuthUtils = {
  getAuthToken: jest.fn(),
  setAuthToken: jest.fn(),
  removeAuthToken: jest.fn(),
  getAuthRole: jest.fn(),
  setAuthRole: jest.fn(),
  removeAuthRole: jest.fn(),
  validateEmail: jest.fn(),
};

// Mock react-router
export const mockNavigate = jest.fn();
export const mockUseLocation = jest.fn();
export const mockUseParams = jest.fn();

// Mock default implementations
export const setupAuthMocks = () => {
  mockAuthUtils.getAuthToken.mockReturnValue('mock-token');
  mockAuthUtils.getAuthRole.mockReturnValue('user');
  mockAuthUtils.validateEmail.mockImplementation(email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  });
};

export const setupRouterMocks = () => {
  mockUseLocation.mockReturnValue({
    pathname: '/dashboard',
    search: '',
    state: null,
  });
  mockUseParams.mockReturnValue({});
};

// Reset all mocks
export const resetUtilMocks = () => {
  Object.values(mockAuthUtils).forEach(mock => {
    if (jest.isMockFunction(mock)) {
      mock.mockReset();
    }
  });
  mockNavigate.mockReset();
  mockUseLocation.mockReset();
  mockUseParams.mockReset();
};
