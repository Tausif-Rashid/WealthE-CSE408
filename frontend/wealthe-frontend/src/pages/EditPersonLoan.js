import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { editPersonLoan, getPersonLoans } from '../utils/api';
import './Assets.css';

const EditPersonLoan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loanId } = location.state || {};
  const [form, setForm] = useState({
    lender_name: '',
    lender_nid: '',
    amount: '',
    remaining: '',
    interest: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchLoan = async () => {
      setLoading(true);
      try {
        const loans = await getPersonLoans();
        const loan = loans.find(l => l.id === loanId);
        if (loan) {
          setForm({
            lender_name: loan.lender_name || '',
            lender_nid: loan.lender_nid || '',
            amount: loan.amount || '',
            remaining: loan.remaining || '',
            interest: loan.interest || ''
          });
        } else {
          setError('Person loan not found.');
        }
      } catch (err) {
        setError('Failed to fetch person loan.');
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
      await editPersonLoan(loanId, {
        lender_name: form.lender_name,
        lender_nid: form.lender_nid,
        amount: parseFloat(form.amount),
        remaining: parseFloat(form.remaining),
        interest: parseFloat(form.interest)
      });
      setSuccess('Person loan updated successfully!');
      setTimeout(() => navigate('/liabilities'), 1200);
    } catch (err) {
      setError('Failed to update person loan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!loanId) {
    return <div className="assets-container"><div className="error-message">No person loan selected for editing.</div></div>;
  }

  return (
    <div className="assets-container">
      <div className="assets-header">
        <h1>✏️ Edit Person Loan</h1>
        <p>Update the details for your person loan</p>
      </div>
      <form className="asset-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="lender_name">Lender Name</label>
          <input
            type="text"
            id="lender_name"
            name="lender_name"
            value={form.lender_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lender_nid">Lender NID</label>
          <input
            type="text"
            id="lender_nid"
            name="lender_nid"
            value={form.lender_nid}
            onChange={handleChange}
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
        <button type="submit" className="add-asset-btn" disabled={loading}>
          {loading ? 'Updating...' : 'Update Person Loan'}
        </button>
        {error && <div className="error-message"><span className="error-icon">⚠️</span> {error}</div>}
        {success && <div className="success-message">✅ {success}</div>}
      </form>
    </div>
  );
};

export default EditPersonLoan; 