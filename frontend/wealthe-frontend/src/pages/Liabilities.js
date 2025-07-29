import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getBankLoans, getPersonLoans, deleteBankLoan, deletePersonLoan } from '../utils/api';
import './Assets.css';

const Liabilities = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bankLoans, setBankLoans] = useState([]);
  const [personLoans, setPersonLoans] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ show: false, loanId: null, type: null });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const [bankData, personData] = await Promise.all([
          getBankLoans(),
          getPersonLoans()
        ]);
        setBankLoans(bankData || []);
        setPersonLoans(personData || []);
      } catch (err) {
        setError('Failed to load liabilities');
        console.error('Error fetching liabilities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const handleAddBankLoan = () => {
    navigate('/add-bank-loan');
  };
  const handleEditBankLoan = (loanId) => {
    navigate('/edit-bank-loan', { state: { loanId } });
  };
  const handleDeleteBankLoan = (loanId) => {
    setDeleteDialog({ show: true, loanId, type: 'bank' });
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteDialog.type === 'bank') {
        await deleteBankLoan(deleteDialog.loanId);
        setBankLoans(prev => prev.filter(l => l.id !== deleteDialog.loanId));
        setMessage('Bank loan deleted successfully!');
      } else if (deleteDialog.type === 'person') {
        await deletePersonLoan(deleteDialog.loanId);
        setPersonLoans(prev => prev.filter(l => l.id !== deleteDialog.loanId));
        setMessage('Person loan deleted successfully!');
      }
    } catch (err) {
      setMessage('Failed to delete loan.');
    } finally {
      setDeleteDialog({ show: false, loanId: null, type: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ show: false, loanId: null, type: null });
  };

  const handleAddPersonLoan = () => {
    navigate('/add-person-loan');
  };
  const handleEditPersonLoan = (loanId) => {
    navigate('/edit-person-loan', { state: { loanId } });
  };
  const handleDeletePersonLoan = (loanId) => {
    setDeleteDialog({ show: true, loanId, type: 'person' });
  };

  const formatAmount = (amount) => {
    if (!amount) return '৳0';
    return `৳${parseFloat(amount).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="assets-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading liabilities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assets-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="assets-container">
      <div className="assets-header">
        <h1>💳 My Liabilities</h1>
        <p>Manage and track your bank and person loans</p>
      </div>
      <div className="assets-content">
        {/* Bank Loans Section */}
        <div className="asset-section">
          <div className="asset-section-header">
            <h2 className="asset-section-title">
              <span className="asset-section-icon">🏦</span>
              Bank Loans
            </h2>
            <button onClick={handleAddBankLoan} className="add-asset-btn">
              ➕ Add Bank Loan
            </button>
          </div>
          <div className="asset-grid">
            {bankLoans.length > 0 ? (
              bankLoans.map((loan) => (
                <div key={loan.id} className="asset-card">
                  <div className="asset-card-header">
                    <div className="asset-icon">🏦</div>
                    <div className="asset-details">
                      <h3 className="asset-title">{loan.bank_name}</h3>
                      <p className="asset-info">Account: {loan.account}</p>
                      <p className="asset-amount">{formatAmount(loan.amount)}</p>
                      <p className="asset-info">Interest: {loan.interest}%</p>
                      <p className="asset-info">Remaining: {formatAmount(loan.remaining)}</p>
                    </div>
                  </div>
                  <div className="asset-actions">
                    <button 
                      onClick={() => handleEditBankLoan(loan.id)}
                      className="asset-edit-btn"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteBankLoan(loan.id)}
                      className="asset-delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-assets">
                <p>No bank loans found. Click "Add Bank Loan" to get started!</p>
              </div>
            )}
          </div>
        </div>
        {/* Person Loans Section */}
        <div className="asset-section">
          <div className="asset-section-header">
            <h2 className="asset-section-title">
              <span className="asset-section-icon">👤</span>
              Person Loans
            </h2>
            <button onClick={handleAddPersonLoan} className="add-asset-btn">
              ➕ Add Person Loan
            </button>
          </div>
          <div className="asset-grid">
            {personLoans.length > 0 ? (
              personLoans.map((loan) => (
                <div key={loan.id} className="asset-card">
                  <div className="asset-card-header">
                    <div className="asset-icon">👤</div>
                    <div className="asset-details">
                      <h3 className="asset-title">{loan.lender_name}</h3>
                      <p className="asset-info">NID: {loan.lender_nid}</p>
                      <p className="asset-amount">{formatAmount(loan.amount)}</p>
                      <p className="asset-info">Interest: {loan.interest}%</p>
                      <p className="asset-info">Remaining: {formatAmount(loan.remaining)}</p>
                    </div>
                  </div>
                  <div className="asset-actions">
                    <button 
                      onClick={() => handleEditPersonLoan(loan.id)}
                      className="asset-edit-btn"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDeletePersonLoan(loan.id)}
                      className="asset-delete-btn"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-assets">
                <p>No person loans found. Click "Add Person Loan" to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Delete Confirmation Dialog */}
      {deleteDialog.show && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h2>🗑️ Delete {deleteDialog.type === 'bank' ? 'Bank Loan' : 'Person Loan'}</h2>
            <p>Are you sure you want to delete this {deleteDialog.type === 'bank' ? 'bank loan' : 'person loan'}?</p>
            <div className="dialog-buttons">
              <button onClick={handleConfirmDelete} className="confirm-btn">OK</button>
              <button onClick={handleCancelDelete} className="dialog-cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
      {/* Message Dialog */}
      {message && (
        <div className="message-dialog">
          {message}
          <button onClick={() => setMessage('')} className="dialog-cancel-btn">Close</button>
        </div>
      )}
    </div>
  );
};

export default Liabilities; 