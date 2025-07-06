//import { data } from "react-router";
//const API_BASE_URL = 'http://localhost:8081';
//const API_BASE_URL = 'http://172.174.246.178:8081'; // Adjust this to your backend URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://172.174.246.178:8081'; 


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
    
    // Check if response has content
    const contentType = response.headers.get('content-type');
    const hasJsonContent = contentType && contentType.includes('application/json');
    
    // Get response text first to debug what's being returned
    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('Response text:', responseText);
    
    // If response is empty or not JSON, handle accordingly
    if (!responseText) {
      if (response.ok) {
        return { success: true, message: 'Operation completed successfully' };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }
    
    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response was not valid JSON:', responseText);
      throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`);
    }

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
  const response = await apiCall('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  // Transform backend response to match frontend expectations
  if (response.token) {
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

export const getTotalUsers = async () => {
  return apiCall('/admin/total-users', {
    method: 'GET',
  });
};

export const getIncomeSlabs = async () => {
  return apiCall('/admin/income-slabs', {
    method: 'GET',
  });
};

export const getIncomeCategories = async () => {
  return apiCall('/admin/income-categories', {
    method: 'GET',
  });
};

export const getExpenseCategories = async () => {
  return apiCall('/admin/expense-categories', {
    method: 'GET',
  });
};

export const getInvestmentCategories = async () => {
  return apiCall('/admin/investment-categories', {
    method: 'GET',
  });
};

export const getRebateRules = async () => {
  return apiCall('/admin/rebate-rules', {
    method: 'GET',
  });
};

export const getTaxAreaList = async () => {
  return apiCall('/admin/tax-area-list', {
    method: 'GET',
  });
};

export const getMinimumTaxList = async () => {
  return apiCall('/admin/minimum-tax-list', {
    method: 'GET',
  });
};

export const updateIncomeSlab = async (slabId, updateData) => {
  return apiCall(`/admin/update-income-slab`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: slabId,
      ...updateData
    }),
  });
};

export const updateTaxZoneRule = async (zoneId, updateData) => {
  return apiCall('/admin/edit-taxzone-rule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: zoneId,
      area_name: updateData.area_name,
      min_amount: updateData.minimum
    }),
  });
};

export const deleteTaxZoneRule = async (zoneId) => {
  return apiCall('/admin/delete-taxzone-rule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: zoneId }),
  });
};

export const addTaxZoneRule = async (zoneData) => {
  return apiCall('/admin/add-taxzone-rule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      area_name: zoneData.area_name,
      min_amount: zoneData.minimum
    }),
  });
};

export const updateRebateRule = async (updateData) => {
  return apiCall('/admin/edit-rebate-rule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      maximumRebate: updateData.maximum,
      maximum_of_income: updateData.max_of_income
    }),
  });
};

export const updateInvestmentCategory = async (categoryId, updateData) => {
  return apiCall('/admin/edit-investment-category', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: categoryId,
      title: updateData.title,
      rate_rebate: updateData.rate_rebate,
      minimum: updateData.minimum,
      maximum: updateData.maximum,
      description: updateData.description
    }),
  });
};

export const addInvestmentCategory = async (categoryData) => {
  return apiCall('/admin/add-investment-category', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: categoryData.title,
      rate_rebate: categoryData.rate_rebate,
      minimum: categoryData.minimum,
      maximum: categoryData.maximum,
      description: categoryData.description
    }),
  });
};

export const deleteInvestmentCategory = async (categoryId) => {
  
  return apiCall('/admin/delete-investment-category', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: categoryId }),
    
  });
};

export const addExpense = async (expenseData) => {
  return apiCall('/user/add-expense', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: expenseData.type,
      amount: expenseData.amount,
      description: expenseData.description,
      date: expenseData.date,
      isRecurring: expenseData.isRecurring,
      recurrenceType: expenseData.recurrenceType
    }),
  });
};

