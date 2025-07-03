import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getExpenseCategories, addExpense } from '../utils/api';
import './AddExpense.css';

const AddExpense = () => {
  const navigate = useNavigate();
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    description: '',
    date: '',
    isRecurring: false,
    recurrenceType: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getExpenseCategories();
        setExpenseCategories(categories || []);
      } catch (err) {
        setError('Failed to load expense categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRecurringChange = (value) => {
    setFormData(prev => ({
      ...prev,
      isRecurring: value === 'yes',
      recurrenceType: value === 'no' ? '' : prev.recurrenceType
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.type || !formData.amount || !formData.date) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.isRecurring && !formData.recurrenceType) {
      setError('Please select a recurrence type');
      return;
    }

    try {
      setError('');
      
      // Prepare data for API call
      const expenseData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: formData.date,
        isRecurring: formData.isRecurring,
        recurrenceType: formData.isRecurring ? formData.recurrenceType : null
      };

      console.log('Expense data to be sent:', expenseData);
      
      // Make API call to add expense
      const response = await addExpense(expenseData);
      console.log('Expense added successfully:', response);
      
      // Navigate back to expenses page on success
      navigate('/expenses');
      
    } catch (err) {
      setError('Failed to add expense');
      console.error('Error adding expense:', err);
    }
  };

  const handleCancel = () => {
    navigate('/expenses');
  };

  if (loading) {
    return (
      <div className="add-expense-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-expense-container">
      <div className="add-expense-header">
        <h1>💰 Add New Expense</h1>
        <p>Fill in the details to add a new expense</p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="add-expense-form-container">
        <form onSubmit={handleSubmit} className="add-expense-form">
          
          {/* Type Dropdown */}
          <div className="form-group">
            <label htmlFor="type">Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="form-input"
            >
              <option value="">Select expense type</option>
              {expenseCategories.map((category, index) => (
                <option key={index} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div className="form-group">
            <label htmlFor="amount">Amount (৳) *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
              required
              min="0"
              step="0.01"
              className="form-input"
            />
          </div>

          {/* Description Input */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter expense description (optional)"
              rows="3"
              className="form-input"
            />
          </div>

          {/* Date Input */}
          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>

          {/* Recurring Radio Buttons */}
          <div className="form-group">
            <label className="form-label">Recurring?</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="recurring"
                  value="no"
                  checked={!formData.isRecurring}
                  onChange={(e) => handleRecurringChange(e.target.value)}
                />
                <span className="radio-checkmark"></span>
                No
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="recurring"
                  value="yes"
                  checked={formData.isRecurring}
                  onChange={(e) => handleRecurringChange(e.target.value)}
                />
                <span className="radio-checkmark"></span>
                Yes
              </label>
            </div>
          </div>

          {/* Recurrence Type Dropdown (appears only if recurring is selected) */}
          {formData.isRecurring && (
            <div className="form-group recurrence-group">
              <label htmlFor="recurrenceType">Recurrence Type *</label>
              <select
                id="recurrenceType"
                name="recurrenceType"
                value={formData.recurrenceType}
                onChange={handleInputChange}
                required
                className="form-input"
              >
                <option value="">Select recurrence type</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="add-btn">
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
