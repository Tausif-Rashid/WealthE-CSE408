import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getExpenseCategories, editExpense, getUserExpense } from '../utils/api';
import './AddExpense.css';

const EditExpense = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const amountInputRef = useRef(null);
  
  // Get expenseId from router state
  const expenseId = location.state?.expenseId;
  
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [originalExpense, setOriginalExpense] = useState(null); // Store original expense data
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    description: '',
    date: '',
    isRecurring: false,
    recurrenceType: ''
  });

  useEffect(() => {
    // Redirect if no expenseId is provided
    if (!expenseId) {
      navigate('/expenses');
      return;
    }

    const fetchData = async () => {
      try {
        const [categories, expenses] = await Promise.all([
          getExpenseCategories(),
          getUserExpense()
        ]);
        
        setExpenseCategories(categories || []);
        
        // Find the expense to edit
        const expenseToEdit = expenses.find(expense => expense.id === parseInt(expenseId));
        
        if (expenseToEdit) {
          // Store original expense data
          setOriginalExpense(expenseToEdit);
          
          setFormData({
            type: expenseToEdit.type || expenseToEdit.category_name || '',
            amount: expenseToEdit.amount || '',
            description: expenseToEdit.description || '',
            date: expenseToEdit.date || '',
            isRecurring: expenseToEdit.isRecurring || false,
            recurrenceType: expenseToEdit.recurrenceType || ''
          });
        } else {
          setError('Expense not found');
        }
      } catch (err) {
        setError('Failed to load expense data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [expenseId, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Completely prevent any increment/decrement behavior on number inputs
  const handleWheelAndTouch = (e) => {
    if (e.target.type === 'number') {
      e.preventDefault();
      e.stopPropagation();
      e.target.blur();
      setTimeout(() => e.target.focus(), 0);
    }
  };

  // Prevent arrow keys and other keys from changing number input values
  const handleKeyDown = (e) => {
    if (e.target.type === 'number') {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'PageUp' || e.key === 'PageDown') {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };

  // Handle mouse events to prevent spinner interaction
  const handleMouseEvents = (e) => {
    if (e.target.type === 'number') {
      if (e.type === 'mousedown' || e.type === 'click') {
        const rect = e.target.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const inputWidth = rect.width;
        
        if (clickX > inputWidth - 20) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    }
  };

  // Ultimate protection: Custom input handler that validates and sanitizes
  const handleAmountInputChange = (e) => {
    const value = e.target.value;
    
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        amount: value
      }));
    }
  };

  // Add comprehensive event listeners when component mounts
  useEffect(() => {
    const preventNumberIncrement = (e) => {
      if (e.target.type === 'number') {
        if (e.type === 'wheel' || e.type === 'touchmove' || e.type === 'DOMMouseScroll' || 
            e.type === 'touchstart' || e.type === 'touchend') {
          e.preventDefault();
          e.stopPropagation();
        }
        if (e.type === 'keydown' && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
                                     e.key === 'PageUp' || e.key === 'PageDown')) {
          e.preventDefault();
          e.stopPropagation();
        }
        if (e.type === 'mousedown' || e.type === 'click') {
          const rect = e.target.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const inputWidth = rect.width;
          
          if (clickX > inputWidth - 20) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
      }
    };

    const events = ['wheel', 'touchmove', 'touchstart', 'touchend', 'DOMMouseScroll', 
                   'keydown', 'mousedown', 'click'];
    
    events.forEach(eventType => {
      document.addEventListener(eventType, preventNumberIncrement, { 
        passive: false, 
        capture: true 
      });
    });

    return () => {
      events.forEach(eventType => {
        document.removeEventListener(eventType, preventNumberIncrement, { capture: true });
      });
    };
  }, []);

  const handleRecurringChange = (value) => {
    setFormData(prev => ({
      ...prev,
      isRecurring: value === 'yes',
      recurrenceType: value === 'no' ? '' : prev.recurrenceType
    }));
  };

  const handleStopRecurrence = () => {
    if (window.confirm('Are you sure you want to stop the recurrence for this expense?')) {
      setFormData(prev => ({
        ...prev,
        isRecurring: false,
        recurrenceType: ''
      }));
    }
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

      console.log('Expense data to be updated:', expenseData);
      
      // Make API call to edit expense
      const response = await editExpense(expenseId, expenseData);
      console.log('Expense updated successfully:', response);
      
      // Navigate back to expenses page on success
      navigate('/expenses');
      
    } catch (err) {
      setError('Failed to update expense');
      console.error('Error updating expense:', err);
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
          <p>Loading expense details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-expense-container">
      <div className="add-expense-header">
        <h1>✏️ Edit Expense</h1>
        <p>Update the expense details</p>
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
              ref={amountInputRef}
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleAmountInputChange}
              onWheel={handleWheelAndTouch}
              onTouchMove={handleWheelAndTouch}
              onTouchStart={handleWheelAndTouch}
              onTouchEnd={handleWheelAndTouch}
              onKeyDown={handleKeyDown}
              onMouseDown={handleMouseEvents}
              onClick={handleMouseEvents}
              onContextMenu={(e) => {
                if (e.target.type === 'number') {
                  e.preventDefault();
                }
              }}
              onInput={(e) => {
                const value = e.target.value;
                if (value !== '' && !/^\d*\.?\d*$/.test(value)) {
                  e.target.value = formData.amount;
                }
              }}
              placeholder="Enter amount"
              required
              min="0"
              step="0.01"
              className="form-input"
              inputMode="decimal"
              pattern="[0-9]*"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
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

          {/* Recurring Section */}
          <div className="form-group">
            <label className="form-label">Recurring Status</label>
            
            {/* If original expense was NOT recurring, don't show recurrence options */}
            {!originalExpense?.isRecurring && (
              <div className="recurring-info">
                <p style={{ color: '#666', fontStyle: 'italic' }}>
                  This expense is not recurring. Recurrence options are not available for non-recurring expenses.
                </p>
              </div>
            )}

            {/* If original expense WAS recurring, show current status and stop option */}
            {originalExpense?.isRecurring && (
              <div className="recurring-controls">
                <div className="current-recurrence">
                  <p><strong>Current Recurrence:</strong> {originalExpense.recurrenceType || 'Not specified'}</p>
                  
                  {formData.isRecurring ? (
                    <div className="recurrence-active">
                      <p style={{ color: '#28a745' }}>✓ This expense is currently recurring</p>
                      <button 
                        type="button" 
                        onClick={handleStopRecurrence}
                        className="stop-recurrence-btn"
                        style={{
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          marginTop: '10px'
                        }}
                      >
                        Stop Recurrence
                      </button>
                    </div>
                  ) : (
                    <div className="recurrence-stopped">
                      <p style={{ color: '#dc3545' }}>⚠ Recurrence has been stopped</p>
                      <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        This expense will no longer repeat automatically.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Hidden fields to maintain recurrence data structure */}
          <input type="hidden" name="isRecurring" value={formData.isRecurring} />
          <input type="hidden" name="recurrenceType" value={formData.recurrenceType} />

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="add-btn">
              Update Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpense;
