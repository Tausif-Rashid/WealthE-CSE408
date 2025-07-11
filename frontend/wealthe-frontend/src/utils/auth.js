// Password hashing is handled by Spring Boot backend, no need for frontend hashing
// import bcrypt from 'bcryptjs';

// export const hashPassword = async (password) => {
//   const saltRounds = 10;
//   return await bcrypt.hash(password, saltRounds);
// };

// export const comparePassword = async (password, hashedPassword) => {
//   return await bcrypt.compare(password, hashedPassword);
// };

export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  console.log('Validating email:', email); // Debug log
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 3 characters
  return password.length >= 3;
};

export const setAuthToken = (token) => {
  localStorage.setItem('token', token); // Store token in localStorage, better to use cookies 
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

export const setAuthRole = (role) => {
  localStorage.setItem('role', role); // Store user/admin in localStorage, better to use cookies 
};

export const getAuthRole = () => {
  return localStorage.getItem('role');
};

export const removeAuthRole = () => {
  localStorage.removeItem('role');
};