import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import { setAuthToken, validateEmail } from '../utils/auth';
import { useAuth } from '../components/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const validateForm = () => {
    const newErrors = {};    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (formData.email !== 'user1@test.com' && !validateEmail(formData.email)) {
      // TEMPORARY: Allow 'user1@test.com' as valid email for testing
      // TODO: Remove this special case when reverting to normal operation
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    console.log('Form submitted with data:', formData); // Debug log
    // Prevent default form submission
    e.preventDefault();
    console.log('Form submitted', formData); // Debug log
    
    if (!validateForm()) {
      console.log('Form validation failed'); // Debug log
      return;
    }

    setLoading(true);
    console.log('Loading set to true'); // Debug log

    try {      // TEMPORARY: Skip password hashing for test credentials
      // TODO: Remove this condition and always hash passwords
      let passwordToSend = formData.password;
      if (!(formData.email === 'user1@test.com' && formData.password === '123')) {
        // TODO: Uncomment this when reverting to normal operation
        // passwordToSend = await hashPassword(formData.password);
      }
      
      console.log('Calling login API with:', formData.email, passwordToSend); // Debug log
      const response = await login(formData.email, passwordToSend);
      console.log('Login response:', response); // Debug log
      
      if (response.token) {
        setAuthToken(response.token);
        authLogin(response.user, response.token);
        console.log('Navigating to dashboard'); // Debug log
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error); // Debug log
      setErrors({
        general: error.message || 'Login failed. Please try again.'
      });
    } finally {
      setLoading(false);
      console.log('Loading set to false'); // Debug log
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>💰 Welcome Back</h1>
          <p>Sign in to your account</p>
          {/* TEMPORARY: Test credentials notice */}
          {/* TODO: Remove this when reverting to normal operation */}
          <div style={{
            background: '#e3f2fd',
            border: '1px solid #2196f3',
            borderRadius: '5px',
            padding: '10px',
            margin: '10px 0',
            fontSize: '0.9rem',
            color: '#1976d2'
          }}>
            <strong>Test Mode:</strong> Use email "user1@test.com" and password "123" to login
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message general-error">
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? 
            <Link to="/register" className="auth-link"> Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
