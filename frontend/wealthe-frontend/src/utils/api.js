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
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  // TEMPORARY: Hardcoded credentials for testing
  // TODO: Remove this hardcoded check and uncomment API call below
  if (email === 'user1@test.com' && password === '123') {
    return {
      token: 'temp-token-123',
      user: {
        id: '1',
        name: 'Test User',
        email: 'user1@test.com',
        createdAt: new Date().toISOString()
      }
    };
  }
  
  // TODO: Uncomment this for actual API integration
  // return apiCall('/login', {
  //   method: 'POST',
  //   body: JSON.stringify({ email, password }),
  // });
  
  // If credentials don't match, throw error
  throw new Error('Invalid credentials');
};

export const register = async (userData) => {
  // TEMPORARY: Mock registration for testing
  // TODO: Remove this mock implementation and uncomment API call below
  return {
    token: 'temp-token-123',
    user: {
      id: '1',
      name: userData.name,
      email: userData.email,
      createdAt: new Date().toISOString()
    }
  };
  
  // TODO: Uncomment this for actual API integration
  // return apiCall('/register', {
  //   method: 'POST',
  //   body: JSON.stringify(userData),
  // });
};

export const getUserInfo = async () => {
  // TEMPORARY: Mock user info for testing
  // TODO: Remove this mock implementation and uncomment API call below
  const token = localStorage.getItem('token');
  if (token === 'temp-token-123') {
    console.log('Fetching user info for id: ', 2);
    const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'GET'
    };

    let response = await fetch('http://localhost:8081/user_info?id=2', config);
    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }
    const data1 = await response.json();
    //console.log(data);

    response = await fetch('http://localhost:8081/user_tax_info?id=2', config);
    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }
    const data2 = await response.json();
    //console.log(data);
    return {
      id: '1',
      name: 'Test User',
      email: 'user1@test.com',
      role: 'Standard User',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      user_info: data1,
      tax_info: data2
    };
  }

  return apiCall('/user_info', {
    method: 'GET',
  });
  
  throw new Error('Invalid token');
};


export const getUserExpense = async () => {
  // TEMPORARY: Mock user info for testing
  // TODO: Remove this mock implementation and uncomment API call below
  const token = localStorage.getItem('token');
  if (token === 'temp-token-123') {
    console.log('Fetching expense for id: ', 2);
    const config = {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'GET'
    };

    let response = await fetch('http://localhost:8081/user/expense?id=2', config);
    if (!response.ok) {
      throw new Error('Failed to fetch expense');
    }
    const data = await response.json();
    console.log(data);

    return data;
  }

  return apiCall('/user/expense', {
    method: 'GET',
  });
  

};
