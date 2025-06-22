import { data } from "react-router-dom";

const API_BASE_URL = 'http://localhost:8081'; // Adjust this to your backend URL

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add authorization header if token exists
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    // Handle CORS errors
    if (!response.ok) {
      if (response.status === 0 || response.type === 'opaque') {
        throw new Error('Network error - possible CORS issue. Please check if the backend server is running and CORS is properly configured.');
      }
    }
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    // Handle network errors and CORS issues
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error - unable to connect to server. Please check if the backend is running.');
    }
    throw error;
  }
};

export const login = async (email, password) => {
  // COMMENTED OUT: Hardcoded credentials for testing - using backend JWT auth now
  // if (email === 'user1@test.com' && password === '123') {
  //   return {
  //     token: 'temp-token-123',
  //     user: {
  //       id: '1',
  //       name: 'Test User',
  //       email: 'user1@test.com',
  //       createdAt: new Date().toISOString()
  //     }
  //   };
  // }
    // Use actual backend API for login
  const response = await apiCall('/login', {
    method: 'POST',
    body: JSON.stringify({ 
      email: email, // Backend expects  email but token will contain user id
      password: password 
    }),
  });

  // Transform backend response to match frontend expectations
  // Backend returns: { token, message, user: { id, email } }
  if (response.token && response.user) {
    return {
      token: response.token,
      user: {
        id: response.user.id,
        email: response.user.email,
        role: response.user.role // Default role
      }
    };
  }
  console.error('Login failed:', response); // Debug log

  throw new Error(response.message || response.error || 'Login failed');
};

export const register = async (userData) => {
  
  // Use actual backend API for registration
  const response = await apiCall('/register/submit', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  // Transform backend response to match frontend expectations
  if (response.success && response.token) {
    return {
      token: response.token,
      user: {
        name: userData.name,
        email: userData.email
      }
    };
  }

  throw new Error(response.error || 'Registration failed');
};

export const getUserInfo = async () => {
  // Use actual backend API with JWT authentication
  return apiCall('/user/info', {
    method: 'GET',
  });
};

export const getTaxInfo = async () => {
  // Use actual backend API with JWT authentication
  return apiCall('/user/tax_info', {
    method: 'GET',
  });
};

export const getUserExpense = async () => {
  // Use actual backend API with JWT authentication
  return apiCall('/user/expense', {
    method: 'GET',
  });
};
