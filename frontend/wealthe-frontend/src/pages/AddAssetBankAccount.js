import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { addBankAccount } from '../utils/api';
import MessageDialog from '../components/MessageDialog';
import './AddExpense.css';

const AddAssetBankAccount = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    account: '',
    amount: '',
    bank_name: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const showDialog = (type, title, message) => {
    setDialogType(type);
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    if (dialogType === 'success') {
      navigate('/assets');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.account || !formData.amount || !formData.bank_name) {
      showDialog('error', 'Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data for API call
      const bankAccountData = {
        title: formData.title,
        account: formData.account,
        amount: parseFloat(formData.amount),
        bank_name: formData.bank_name
      };

      await addBankAccount(bankAccountData);
      showDialog('success', 'Success', 'Bank account added successfully!');
      
    } catch (err) {
      console.error('Error adding bank account:', err);
      showDialog('error', 'Error', 'Failed to add bank account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/assets');
  };

  return (
    <div className="add-expense-container">
      <div className="add-expense-header">
        <h1>🏦 Add Bank Account</h1>
        <p>Fill in the details to add a new bank account</p>
      </div>

      <div className="add-expense-form-container">
        <form onSubmit={handleSubmit} className="add-expense-form">
          
          {/* Title Input */}
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter account title (e.g., Primary Savings)"
              required
              className="form-input"
            />
          </div>

          {/* Account Number Input */}
          <div className="form-group">
            <label htmlFor="account">Account Number *</label>
            <input
              type="text"
              id="account"
              name="account"
              value={formData.account}
              onChange={handleInputChange}
              placeholder="Enter account number"
              required
              className="form-input"
            />
          </div>

          {/* Amount Input */}
          <div className="form-group">
            <label htmlFor="amount">Balance Amount (৳) *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter current balance"
              required
              min="0"
              step="0.01"
              className="form-input"
            />
          </div>

          {/* Bank Name Input */}
          <div className="form-group">
            <label htmlFor="bank_name">Bank Name *</label>
            <input
              type="text"
              id="bank_name"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleInputChange}
              placeholder="Enter bank name"
              required
              className="form-input"
            />
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="add-cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="add-add-btn">
              {loading ? 'Adding...' : 'Add Bank Account'}
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

export default AddAssetBankAccount;
