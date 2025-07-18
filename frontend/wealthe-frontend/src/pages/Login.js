import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { login } from '../utils/api';
import { getAuthRole, setAuthRole, setAuthToken, validateEmail } from '../utils/auth';
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
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const response = await login(formData.email, formData.password);
      if (response.token) {
        setAuthToken(response.token);
        authLogin(response.user, response.token);
        if (response.user.role === "admin"){
          setAuthRole("admin");
          navigate('/admin/dashboard');
        }
        else {
          setAuthRole("user");
          navigate('/dashboard');
        }
      }
    } catch (error) {
      setErrors({
        general: error.message || 'Login failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">
            <img
              src="/trending-up-svgrepo-com.svg"
              alt="Trending Up"
              className="logo-icon"
              width="40"
              height="40"
            />
            <h1>WealthE</h1>
          </div>
          <p>Welcome Back</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message-login general-error-login">
              {errors.general}
            </div>
          )}
          <div className="form-group-login">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
              autoComplete="username"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>
          <div className="form-group-login">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error-login' : ''}
              placeholder="Enter your password"
              autoComplete="current-password"
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
            Don&apos;t have an account?
            <Link to="/register" className="auth-link"> Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;