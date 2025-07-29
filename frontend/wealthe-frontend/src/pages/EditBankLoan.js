import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { editBankLoan, getBankLoans } from '../utils/api';
import './Assets.css';

const EditBankLoan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loanId } = location.state || {};
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

  useEffect(() => {
    const fetchLoan = async () => {
      setLoading(true);
      try {
        const loans = await getBankLoans();
        const loan = loans.find(l => l.id === loanId);
        if (loan) {
          setForm({
            bank_name: loan.bank_name || '',
            account: loan.account || '',
            interest: loan.interest || '',
            amount: loan.amount || '',
            remaining: loan.remaining || ''
          });
        } else {
          setError('Bank loan not found.');
        }
      } catch (err) {
        setError('Failed to fetch bank loan.');
      } finally {
        setLoading(false);
      }
    };
    if (loanId) fetchLoan();
  }, [loanId]);

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
      await editBankLoan(loanId, {
        bank_name: form.bank_name,
        account: form.account,
        interest: parseFloat(form.interest),
        amount: parseFloat(form.amount),
        remaining: parseFloat(form.remaining)
      });
      setSuccess('Bank loan updated successfully!');
      setTimeout(() => navigate('/liabilities'), 1200);
    } catch (err) {
      setError('Failed to update bank loan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!loanId) {
    return <div className="assets-container"><div className="error-message">No bank loan selected for editing.</div></div>;
  }

  return (
    <div className="assets-container">
      <div className="assets-header">
        <h1>✏️ Edit Bank Loan</h1>
        <p>Update the details for your bank loan</p>
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
          {loading ? 'Updating...' : 'Update Bank Loan'}
        </button>
        {error && <div className="error-message"><span className="error-icon">⚠️</span> {error}</div>}
        {success && <div className="success-message">✅ {success}</div>}
      </form>
    </div>
  );
};

export default EditBankLoan; 