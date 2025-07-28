import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams,useLocation } from 'react-router';
import { getInvestmentCategories, editInvestment, getUserInvestment } from '../utils/api';
import './AddInvestment.css';

const EditInvestment = () => {
  const navigate = useNavigate();
//   const { investmentId } = useParams();
  const location = useLocation();
  const amountInputRef = useRef(null);
  
  const investmentId = location.state?.investmentId;
  
  const [investmentCategories, setInvestmentCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [originalInvestment, setOriginalInvestment] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: ''
  });

  useEffect(() => {
    // Redirect if no investmentId is provided
    if (!investmentId) {
        console.log("id not found")
      navigate('/investment');
      return;
    }

    const fetchData = async () => {
      try {
        const [categories, investments] = await Promise.all([
          getInvestmentCategories(),
          getUserInvestment()
        ]);
        
        setInvestmentCategories(categories || []);
        
        // Find the investment to edit
        const investmentToEdit = investments.find(investment => investment.id === parseInt(investmentId));
        
        if (investmentToEdit) {
          // Store original investment data
          setOriginalInvestment(investmentToEdit);
          
          // Format date to YYYY-MM-DD for input
          const formattedDate = investmentToEdit.date ? 
            new Date(investmentToEdit.date).toISOString().split('T')[0] : '';
          
          // Populate form with existing data
          setFormData({
            category: investmentToEdit.title|| '',
            amount: investmentToEdit.amount ? investmentToEdit.amount.toString() : '',
            date: formattedDate
          });
        } else {
          setError('Investment not found');
          setTimeout(() => navigate('/investment'), 2000);
        }
        
      } catch (err) {
        setError('Failed to load investment data');
        console.error('Error fetching investment data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [investmentId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Prevent wheel events from changing number input values
  const handleWheelAndTouch = (e) => {
    if (e.target.type === 'number') {
      e.preventDefault();
      e.stopPropagation();
      e.target.blur();
      setTimeout(() => e.target.focus(), 0);
    }
  };

  // Prevent arrow keys from changing number input values
  const handleKeyDown = (e) => {
    if (e.target.type === 'number') {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'PageUp' || e.key === 'PageDown') {
        e.preventDefault();
        e.stopPropagation();
      }
    }
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
      await editInvestment(parseInt(investmentId), {
        category: formData.category,
        amount: parseFloat(formData.amount),
        date: formData.date
      });

      setSuccess('Investment updated successfully!');
      
      // Navigate back to investments page after a delay
      setTimeout(() => {
        navigate('/investment');
      }, 1500);

    } catch (err) {
      setError(err.message || 'Failed to update investment');
      console.error('Error updating investment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/investment');
  };

  if (loading && !originalInvestment) {
    return (
      <div className="add-investment-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading investment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-investment-container">
      <div className="add-investment-header">
        <h1>📝 Edit Investment</h1>
        <p>Update the investment details</p>
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
                <option key={index} value={category.title}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>

          {/* Amount Input */}
          <div className="form-group">
            <label htmlFor="amount">Amount (৳) *</label>
            <input
              ref={amountInputRef}
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              onWheel={handleWheelAndTouch}
              onKeyDown={handleKeyDown}
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
              className="cancel-btn-add-inv"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn-add-inv"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Updating...
                </>
              ) : (
                'Update Investment'
              )}
            </button>
          </div>
        </form>

        {/* Show original data for reference */}
        {originalInvestment && (
          <div className="original-data-reference">
            <h3>Original Investment Details:</h3>
            <div className="original-data">
              <p><strong>Category:</strong> {originalInvestment.category || originalInvestment.title || originalInvestment.type || 'N/A'}</p>
              <p><strong>Amount:</strong> ৳{originalInvestment.amount || 0}</p>
              <p><strong>Date:</strong> {originalInvestment.date ? new Date(originalInvestment.date).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditInvestment;
