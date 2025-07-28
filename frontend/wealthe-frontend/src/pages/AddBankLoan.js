import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { addBankLoan } from '../utils/api';
import './Assets.css';

const AddBankLoan = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    bank_name: '',
    account: '',
    interest: '',
    amount: '',
    remaining: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await addBankLoan({
        bank_name: form.bank_name,
        account: form.account,
        interest: parseFloat(form.interest),
        amount: parseFloat(form.amount),
        remaining: parseFloat(form.remaining)
      });
      setSuccess('Bank loan added successfully!');
      setTimeout(() => navigate('/liabilities'), 1200);
    } catch (err) {
      setError('Failed to add bank loan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assets-container">
      <div className="assets-header">
        <h1>➕ Add Bank Loan</h1>
        <p>Enter the details for your new bank loan</p>
      </div>
      <form className="asset-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="bank_name">Bank Name</label>
          <input
            type="text"
            id="bank_name"
            name="bank_name"
            value={form.bank_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="account">Account</label>
          <input
            type="text"
            id="account"
            name="account"
            value={form.account}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="interest">Interest (%)</label>
          <input
            type="number"
            id="interest"
            name="interest"
            value={form.interest}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="remaining">Remaining</label>
          <input
            type="number"
            id="remaining"
            name="remaining"
            value={form.remaining}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>
        <button type="submit" className="add-asset-btn" disabled={loading}>
          {loading ? 'Adding...' : 'Add Bank Loan'}
        </button>
        {error && <div className="error-message"><span className="error-icon">⚠️</span> {error}</div>}
        {success && <div className="success-message">✅ {success}</div>}
      </form>
    </div>
  );
};

export default AddBankLoan; 