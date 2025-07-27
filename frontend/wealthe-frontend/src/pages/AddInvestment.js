import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getInvestmentCategories, addInvestment } from '../utils/api';
import './AddInvestment.css';

const AddInvestment = () => {
  const navigate = useNavigate();
  const [investmentCategories, setInvestmentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getInvestmentCategories();
        setInvestmentCategories(categories || []);
      } catch (err) {
        setError('Failed to load investment categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.category || !formData.amount || !formData.date) {
      setError('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await addInvestment({
        category: formData.category,
        amount: parseFloat(formData.amount),
        date: formData.date
      });

      setSuccess('Investment added successfully!');
      
      // Reset form
      setFormData({
        category: '',
        amount: '',
        date: ''
      });

      // Navigate back to investments page after a delay
      setTimeout(() => {
        navigate('/investment');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Failed to add investment');
      console.error('Error adding investment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/investment');
  };

  if (loading && investmentCategories.length === 0) {
    return (
      <div className="add-investment-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-investment-container">
      <div className="add-investment-header">
        <h1>📈 Add New Investment</h1>
        <p>Fill in the details to add a new investment</p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          {success}
        </div>
      )}

      <div className="add-investment-form-container">
        <form onSubmit={handleSubmit} className="add-investment-form">
          
          {/* Category Dropdown */}
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="form-input"
            >
              <option value="">Select investment category</option>
              {investmentCategories.map((category, index) => (
                <option key={index} value={category.name || category.categoryName}>
                  {category.name || category.categoryName}
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
              placeholder="Enter investment amount"
              min="0"
              step="0.01"
              required
              className="form-input"
            />
          </div>

          {/* Date Input */}
          <div className="form-group">
            <label htmlFor="date">Investment Date *</label>
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

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Adding...
                </>
              ) : (
                'Add Investment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInvestment;
