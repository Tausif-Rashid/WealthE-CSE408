import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import './AdminDashboard.css';
import { getUserInfo, getRebateRules, updateRebateRule } from '../../utils/api';

const RebateRule = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rebateData, setRebateData] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingChanges, setPendingChanges] = useState({});
  const [tempValues, setTempValues] = useState({
    maximum: '',
    max_of_income: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserInfo();
        setUserInfo(userData?.[0] || null);

        const rebateRules = await getRebateRules();
        if (rebateRules?.length > 0) {
          setRebateData(rebateRules[0]);
        }
      } catch (err) {
        setError('Failed to load rebate rules');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (field) => {
    setEditingField(field);
    setTempValues(prev => ({
      ...prev,
      [field]: rebateData[field].toString()
    }));
  };

  const handleChange = (e, field) => {
    setTempValues(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSave = (field) => {
    const value = parseFloat(tempValues[field]);
    if (isNaN(value) || value < 0) {
      setError('Please enter a valid number');
      return;
    }

    setPendingChanges(prev => ({
      ...prev,
      [field]: { value, oldValue: rebateData[field] }
    }));
    setHasUnsavedChanges(true);
    setEditingField(null);
    setError('');
  };

  const handleConfirmUpdate = async () => {
    try {
      if (Object.keys(pendingChanges).length === 0) return;

      const updateData = {
        id: rebateData.id
      };
      
      Object.entries(pendingChanges).forEach(([field, { value }]) => {
        updateData[field] = value;
      });

      await updateRebateRule(updateData);
      
      setRebateData(prev => ({
        ...prev,
        ...Object.fromEntries(Object.entries(pendingChanges).map(([field, { value }]) => [field, value]))
      }));
      
      setPendingChanges({});
      setHasUnsavedChanges(false);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to update rebate rule');
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    setPendingChanges({});
    setHasUnsavedChanges(false);
    setError('');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Rebate Rules</h1>
        {/* <p>Welcome back, <b>{userInfo?.name}</b></p> */}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="slab-table rebate-table">
        <table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Maximum Rebate Amount (৳)</td>
              <td>
                {editingField === 'maximum' ? (
                  <div className="input-container">
                    <input
                      type="number"
                      value={tempValues.maximum}
                      onChange={(e) => handleChange(e, 'maximum')}
                      className="edit-input"
                      min="0"
                      autoFocus
                    />
                    <div className="input-actions">
                      <button className="icon-save-btn" onClick={() => handleSave('maximum')}>✓</button>
                      <button className="icon-cancel-btn" onClick={handleCancel}>✕</button>
                    </div>
                  </div>
                ) : (
                  <span className="cell-content">
                    <span className={pendingChanges.maximum ? 'changed-value' : ''}>
                      {pendingChanges.maximum?.value?.toLocaleString() || rebateData?.maximum.toLocaleString()}
                    </span>
                    <svg 
                      className="edit-icon" 
                      onClick={() => handleEditClick('maximum')}
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td>Maximum % of Income</td>
              <td>
                {editingField === 'max_of_income' ? (
                  <div className="input-container">
                    <input
                      type="number"
                      value={tempValues.max_of_income}
                      onChange={(e) => handleChange(e, 'max_of_income')}
                      className="edit-input"
                      min="0"
                      max="100"
                      step="0.01"
                      autoFocus
                    />
                    <div className="input-actions">
                      <button className="save-btn" onClick={() => handleSave('max_of_income')}>✓</button>
                      <button className="cancel-btn" onClick={handleCancel}>✕</button>
                    </div>
                  </div>
                ) : (
                  <span className="cell-content">
                    <span className={pendingChanges.max_of_income ? 'changed-value' : ''}>
                      {pendingChanges.max_of_income?.value || rebateData?.max_of_income}%
                    </span>
                    <svg 
                      className="edit-icon" 
                      onClick={() => handleEditClick('max_of_income')}
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {hasUnsavedChanges && (
        <div className="update-controls">
          <div className="changes-info">
            <span className="changes-count">
              {Object.keys(pendingChanges).length} unsaved change{Object.keys(pendingChanges).length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="control-buttons">
            <button 
              className="discard-btn"
              onClick={handleCancel}
            >
              Discard Changes
            </button>
            <button 
              className="update-btn"
              onClick={handleConfirmUpdate}
            >
              Update All Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RebateRule;