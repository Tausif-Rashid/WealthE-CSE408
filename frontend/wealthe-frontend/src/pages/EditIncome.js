import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { getIncomeCategories, editIncome, getUserIncome } from '../utils/api';
import MessageDialog from '../components/MessageDialog';
import './AddIncome.css';

const EditIncome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const amountInputRef = useRef(null);
  
  // Get incomeId from router state
  const incomeId = location.state?.incomeId;
  
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [originalIncome, setOriginalIncome] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    amount: '',
    date: '',
    isRecurring: false,
    recurrenceType: '',
    profit: '',
    exempted_amount: ''
  });

  useEffect(() => {
    // Redirect if no incomeId is provided
    if (!incomeId) {
      navigate('/income');
      return;
    }

    const fetchData = async () => {
      try {
        const [categories, incomes] = await Promise.all([
          getIncomeCategories(),
          getUserIncome()
        ]);
        
        setIncomeCategories(categories || []);
        
        // Find the income to edit
        const incomeToEdit = incomes.find(income => income.id === parseInt(incomeId));
        
        if (incomeToEdit) {
          // Store original income data
          setOriginalIncome(incomeToEdit);
          
          setFormData({
            type: incomeToEdit.type || incomeToEdit.category_name || '',
            title: incomeToEdit.title || '',
            amount: incomeToEdit.amount || '',
            date: incomeToEdit.date || '',
            isRecurring: incomeToEdit.recurrence !== null,
            recurrenceType: incomeToEdit.recurrence || '',
            profit: incomeToEdit.profit || '',
            exempted_amount: incomeToEdit.exempted_amount || ''
          });
        } else {
          showDialog('error', 'Error', 'Income not found');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        showDialog('error', 'Error', 'Failed to load income data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [incomeId, navigate]);

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
    if (!formData.type || !formData.title || !formData.amount || !formData.date) {
      showDialog('error', 'Validation Error', 'Please fill in all required fields');
      return;
    }

    if (formData.isRecurring && !formData.recurrenceType) {
      showDialog('error', 'Validation Error', 'Please select a recurrence type');
      return;
    }

    try {
      setError('');
      
      // Prepare data for API call
      const incomeData = {
        type: formData.type,
        title: formData.title,
        amount: parseFloat(formData.amount),
        date: formData.date,
        isRecurring: formData.isRecurring,
        recurrenceType: formData.isRecurring ? formData.recurrenceType : null,
        profit: (formData.type === 'Agriculture' && formData.profit) ? parseFloat(formData.profit) : null,
        exempted_amount: (['Agriculture', 'Rent'].includes(formData.type) && formData.exempted_amount) ? parseFloat(formData.exempted_amount) : null
      };

      console.log('Income data to be updated:', incomeData);
      
      // Make API call to edit income
      const response = await editIncome(incomeId, incomeData);
      console.log('Income updated successfully:', response);
      
      // Show success message
      showDialog('success', 'Success', 'Income updated successfully!');
      
    } catch (err) {
      console.error('Error updating income:', err);
      showDialog('error', 'Error', 'Failed to update income. Please try again.');
    }
  };

  const showDialog = (type, title, message) => {
    setDialogType(type);
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    // Navigate back to income page on success
    if (dialogType === 'success') {
      navigate('/income');
    }
  };

  const handleCancel = () => {
    navigate('/income');
  };

  const shouldShowProfit = formData.type === 'Agriculture';
  const shouldShowExempted = ['Agriculture', 'Rent'].includes(formData.type);

  if (loading) {
    return (
      <div className="add-income-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading income data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-income-container">
      <div className="add-income-header">
        <h1>✏️ Edit Income</h1>
        <p>Update your income information</p>
      </div>

      <div className="add-income-form-container">
        <form onSubmit={handleSubmit} className="add-income-form">
          {/* Income Type Dropdown */}
          <div className="expense-form-group">
            <label htmlFor="type">Income Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="form-input-drop"
            >
              <option value="">Select income type</option>
              {incomeCategories.map((category, index) => (
                <option key={index} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title Input */}
          <div className="expense-form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter income title"
              required
              className="form-input"
            />
          </div>

          {/* Amount Input */}
          <div className="expense-form-group">
            <label htmlFor="amount">Amount (৳) *</label>
            <input
              ref={amountInputRef}
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              onWheel={handleWheelAndTouch}
              onTouchStart={handleWheelAndTouch}
              onKeyDown={handleKeyDown}
              placeholder="Enter amount"
              required
              min="0"
              step="0.01"
              className="form-input"
            />
          </div>

          {/* Date Input */}
          <div className="expense-form-group">
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

          {/* Profit Field - Only for Agriculture */}
          {shouldShowProfit && (
            <div className="expense-form-group">
              <label htmlFor="profit">Profit (৳)</label>
              <input
                type="number"
                id="profit"
                name="profit"
                value={formData.profit}
                onChange={handleInputChange}
                onWheel={handleWheelAndTouch}
                onTouchStart={handleWheelAndTouch}
                onKeyDown={handleKeyDown}
                placeholder="Enter profit amount"
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>
          )}

          {/* Exempted Amount Field - For Agriculture and Rent */}
          {shouldShowExempted && (
            <div className="expense-form-group">
              <label htmlFor="exempted_amount">Exempted Amount (৳)</label>
              <input
                type="number"
                id="exempted_amount"
                name="exempted_amount"
                value={formData.exempted_amount}
                onChange={handleInputChange}
                onWheel={handleWheelAndTouch}
                onTouchStart={handleWheelAndTouch}
                onKeyDown={handleKeyDown}
                placeholder="Enter exempted amount"
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>
          )}

          {/* Recurring Radio Buttons */}
          <div className="expense-form-group">
            <label className="form-label">Recurring?</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="recurring"
                  value="no"
                  checked={!formData.isRecurring}
                  onChange={() => handleRecurringChange('no')}
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
                  onChange={() => handleRecurringChange('yes')}
                />
                <span className="radio-checkmark"></span>
                Yes
              </label>
            </div>
          </div>

          {/* Recurrence Type - Only shown if recurring is selected */}
          {formData.isRecurring && (
            <div className="expense-form-group recurrence-group">
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
            <button type="button" onClick={handleCancel} className="add-cancel-btn">
              Cancel
            </button>
            <button type="submit" className="add-add-btn">
              Update Income
            </button>
          </div>
        </form>
      </div>

      {/* Message Dialog */}
      <MessageDialog
        isOpen={dialogOpen}
        type={dialogType}
        title={dialogTitle}
        message={dialogMessage}
        onClose={handleDialogClose}
      />
    </div>
  );
};

export default EditIncome;
