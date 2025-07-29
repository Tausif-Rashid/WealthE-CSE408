// import { data } from "react-router";
const API_BASE_URL = 'http://localhost:8081';
//const API_BASE_URL = 'http://172.174.246.178:8081'; // Adjust this to your backend URL
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://172.174.246.178:8081'; 


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

export const getUserIncome = async () => {
  // Use actual backend API with JWT authentication
  return apiCall('/user/income', {
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
  return apiCall('/user/get-investment-categories', {
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

export const getAllTaxAreaList = async () => {
  return apiCall('/user/tax-area-list', {
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

export const editExpense = async (expenseId, expenseData) => {
  return apiCall('/user/edit-expense', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: expenseId,
      type: expenseData.type,
      amount: expenseData.amount,
      description: expenseData.description,
      date: expenseData.date,
      isRecurring: expenseData.isRecurring,
      recurrenceType: expenseData.recurrenceType
    }),
  });
};

export const deleteExpense = async (expenseId) => {
  return apiCall('/user/delete-expense', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: expenseId
    }),
  });
};

export const addIncome = async (incomeData) => {
  return apiCall('/user/add-income', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: incomeData.type,
      title: incomeData.title,
      amount: incomeData.amount,
      date: incomeData.date,
      isRecurring: incomeData.isRecurring,
      recurrenceType: incomeData.recurrenceType,
      profit: incomeData.profit,
      exempted_amount: incomeData.exempted_amount
    }),
  });
};

export const editIncome = async (incomeId, incomeData) => {
  return apiCall('/user/edit-income', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: incomeId,
      type: incomeData.type,
      title: incomeData.title,
      amount: incomeData.amount,
      date: incomeData.date,
      isRecurring: incomeData.isRecurring,
      recurrenceType: incomeData.recurrenceType,
      profit: incomeData.profit,
      exempted_amount: incomeData.exempted_amount
    }),
  });
};

export const deleteIncome = async (incomeId) => {
  return apiCall('/user/delete-income', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: incomeId
    }),
  });
};

// Investment API functions
export const getUserInvestment = async () => {
  return apiCall('/user/investment',{
    method: 'GET',
  });
};

export const addInvestment = async (investmentData) => {
  return apiCall('/user/add-investment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: investmentData.amount,
      date: investmentData.date,
      category: investmentData.category
    }),
  });
};

export const editInvestment = async (investmentId, investmentData) => {
  return apiCall('/user/edit-investment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: investmentId,
      amount: investmentData.amount,
      date: investmentData.date,
      category: investmentData.category
    }),
  });
};

export const deleteInvestment = async (investmentId) => {
  return apiCall('/user/delete-investment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: investmentId
    }),
  });
};

export const updateUserProfile = async (profileData) => {
  return apiCall('/user/update-profile', {
    method: 'POST',
    body: JSON.stringify(profileData),
  });
};

export const changeUserPassword = async (passwordData) => {
  return apiCall('/user/change-password', {
    method: 'POST',
    body: JSON.stringify(passwordData),
  });
};

export const chatbotUserQuery = async (question) => {
  return apiCall('/user/chatbot', {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
};

export const getTaxEstimation = async (taxData) => {
  return apiCall('/user/tax-estimation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bonusAmount: taxData.bonusAmount,
      numberOfBonus: taxData.numberOfBonus,
      expectedNonRecurringIncome: taxData.expectedNonRecurringIncome,
      makeMoreInvestment: taxData.makeMoreInvestment
    }),
  });
};

// Get tax zones by area
export const getTaxZonesByArea = async (areaName) => {
  return apiCall('/user/tax-zones-by-area', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ area_name: areaName }),
  });
};

// Get tax circles by zone
export const getTaxCirclesByZone = async (zoneName) => {
  return apiCall('/user/tax-circles-by-zone', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tax_zone: zoneName }),
  });
};

// Asset Management APIs

// Bank Account APIs
export const getBankAccounts = async () => {
  return apiCall('/user/bank-accounts', {
    method: 'GET',
  });
};

export const getBankAccount = async (bankAccountId) => {
  return apiCall('/user/bank-account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: bankAccountId }),
  });
};

export const addBankAccount = async (bankAccountData) => {
  return apiCall('/user/add-bank-account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      account: bankAccountData.account,
      amount: bankAccountData.amount,
      bank_name: bankAccountData.bank_name,
      title: bankAccountData.title
    }),
  });
};

export const editBankAccount = async (bankAccountId, bankAccountData) => {
  return apiCall('/user/edit-bank-account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: bankAccountId,
      account: bankAccountData.account,
      amount: bankAccountData.amount,
      bank_name: bankAccountData.bank_name,
      title: bankAccountData.title
    }),
  });
};

export const deleteBankAccount = async (bankAccountId) => {
  return apiCall('/user/delete-bank-account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: bankAccountId }),
  });
};

// Car APIs
export const getCars = async () => {
  return apiCall('/user/cars', {
    method: 'GET',
  });
};

export const getCar = async (carId) => {
  return apiCall('/user/car', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: carId }),
  });
};

export const addCar = async (carData) => {
  return apiCall('/user/add-car', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: carData.model,
      engine: carData.engine,
      description: carData.description,
      title: carData.title,
      cost: carData.cost,
      acquisition: carData.acquisition,
      reg_number: carData.reg_number
    }),
  });
};

export const editCar = async (carId, carData) => {
  return apiCall('/user/edit-car', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: carId,
      model: carData.model,
      engine: carData.engine,
      description: carData.description,
      title: carData.title,
      cost: carData.cost,
      acquisition: carData.acquisition,
      reg_number: carData.reg_number
    }),
  });
};

export const deleteCar = async (carId) => {
  return apiCall('/user/delete-car', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: carId }),
  });
};

// Flat APIs
export const getFlats = async () => {
  return apiCall('/user/flats', {
    method: 'GET',
  });
};

export const getFlat = async (flatId) => {
  return apiCall('/user/flat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: flatId }),
  });
};

export const addFlat = async (flatData) => {
  return apiCall('/user/add-flat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: flatData.title,
      description: flatData.description,
      cost: flatData.cost,
      date: flatData.date,
      location: flatData.location,
      acquisition: flatData.acquisition
    }),
  });
};

export const editFlat = async (flatId, flatData) => {
  return apiCall('/user/edit-flat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: flatId,
      title: flatData.title,
      description: flatData.description,
      cost: flatData.cost,
      date: flatData.date,
      location: flatData.location,
      acquisition: flatData.acquisition
    }),
  });
};

export const deleteFlat = async (flatId) => {
  return apiCall('/user/delete-flat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: flatId }),
  });
};

// Jewellery APIs
export const getJewellery = async () => {
  return apiCall('/user/jewellery', {
    method: 'GET',
  });
};

export const getJewelleryItem = async (jewelleryId) => {
  return apiCall('/user/jewellery-item', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: jewelleryId }),
  });
};

export const addJewellery = async (jewelleryData) => {
  return apiCall('/user/add-jewellery', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: jewelleryData.title,
      description: jewelleryData.description,
      cost: jewelleryData.cost,
      acquisition: jewelleryData.acquisition,
      weight: jewelleryData.weight
    }),
  });
};

export const editJewellery = async (jewelleryId, jewelleryData) => {
  return apiCall('/user/edit-jewellery', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: jewelleryId,
      title: jewelleryData.title,
      description: jewelleryData.description,
      cost: jewelleryData.cost,
      acquisition: jewelleryData.acquisition,
      weight: jewelleryData.weight
    }),
  });
};

export const deleteJewellery = async (jewelleryId) => {
  return apiCall('/user/delete-jewellery', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: jewelleryId }),
  });
};

// Plot APIs
export const getPlots = async () => {
  return apiCall('/user/plots', {
    method: 'GET',
  });
};

export const getPlot = async (plotId) => {
  return apiCall('/user/plot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: plotId }),
  });
};

export const addPlot = async (plotData) => {
  return apiCall('/user/add-plot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: plotData.type,
      description: plotData.description,
      cost: plotData.cost,
      date: plotData.date,
      acquisition: plotData.acquisition,
      location: plotData.location
    }),
  });
};

export const editPlot = async (plotId, plotData) => {
  return apiCall('/user/edit-plot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: plotId,
      type: plotData.type,
      description: plotData.description,
      cost: plotData.cost,
      date: plotData.date,
      acquisition: plotData.acquisition,
      location: plotData.location
    }),
  });
};

export const deletePlot = async (plotId) => {
  return apiCall('/user/delete-plot', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: plotId }),
  });
};

//liabilities apis
export const getBankLoans = async () => {
  return apiCall('/user/bank-loans', {
    method: 'GET',
  });
};

export const getPersonLoans = async () => {
  return apiCall('/user/person-loans', {
    method: 'GET',
  });
};

export const addBankLoan = async (loanData) => {
  return apiCall('/user/bank-loan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bank_name: loanData.bank_name,
      account: loanData.account,
      interest: loanData.interest,
      amount: loanData.amount,
      remaining: loanData.remaining
    }),
  });
};

export const addPersonLoan = async (loanData) => {
  return apiCall('/user/person-loan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      lender_name: loanData.lender_name,
      lender_nid: loanData.lender_nid,
      amount: loanData.amount,
      remaining: loanData.remaining,
      interest: loanData.interest
    }),
  });
};

export const deleteBankLoan = async (id) => {
  return apiCall(`/user/bank-loan/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const editBankLoan = async (id, loanData) => {
  return apiCall(`/user/bank-loan/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bank_name: loanData.bank_name,
      account: loanData.account,
      interest: loanData.interest,
      amount: loanData.amount,
      remaining: loanData.remaining
    }),
  });
};

export const deletePersonLoan = async (id) => {
  return apiCall(`/user/person-loan/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const editPersonLoan = async (id, loanData) => {
  return apiCall(`/user/person-loan/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      lender_name: loanData.lender_name,
      lender_nid: loanData.lender_nid,
      amount: loanData.amount,
      remaining: loanData.remaining,
      interest: loanData.interest
    }),
  });
};

//liabilities apis
export const getTaxIncome = async () => {
  return apiCall('/user/tax-income', {
    method: 'GET',
  });
};

export const getTaxExpense = async () => {
  return apiCall('/user/tax-expense', {
    method: 'GET',
  });
};

export const getTaxInvestment = async () => {
  return apiCall('/user/tax-investment', {
    method: 'GET',
  });
};
