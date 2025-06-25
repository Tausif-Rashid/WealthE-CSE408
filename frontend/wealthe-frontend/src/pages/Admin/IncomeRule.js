import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import './AdminDashboard.css';

// API functions
import { getTotalUsers, getUserInfo, getIncomeSlabs, updateIncomeSlab } from '../../utils/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [slabData, setSlabData] = useState([]);
  const [activeCategory, setActiveCategory] = useState('regular');

  // Track editable fields and changes
  const [editingField, setEditingField] = useState({ id: null, field: null });
  const [tempValue, setTempValue] = useState('');
  const [pendingChanges, setPendingChanges] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserInfo();
        setUserInfo(userData?.[0] || null);

        const slabs = await getIncomeSlabs();
        setSlabData(slabs);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const filteredSlabs = slabData.filter((slab) => slab.category === activeCategory);
  const isLastIndex = (index) => index === filteredSlabs.length - 1;

  const handleEditClick = (id, field, currentValue) => {
    setEditingField({ id, field });
    setTempValue(currentValue);
  };

  const handleSave = (id, field, value) => {
    try {
      // Validate input
      if (!value || value.trim() === '') {
        setError('Value cannot be empty');
        return;
      }

      // Parse numeric values
      let processedValue = value;
      if (field === 'slab_size') {
        processedValue = parseFloat(value.replace(/[$,]/g, ''));
        if (isNaN(processedValue)) {
          setError('Invalid number format');
          return;
        }
      } else if (field === 'tax_rate') {
        processedValue = parseFloat(value.replace('%', ''));
        if (isNaN(processedValue)) {
          setError('Invalid percentage format');
          return;
        }
      }

      // Update local state
      const updatedSlabs = slabData.map((slab) =>
        slab.id === id ? { ...slab, [field]: processedValue } : slab
      );
      setSlabData(updatedSlabs);

      // Track pending changes
      const changeKey = `${id}_${field}`;
      setPendingChanges(prev => ({
        ...prev,
        [changeKey]: { id, field, value: processedValue }
      }));
      
      setHasUnsavedChanges(true);

      // Clear editing state
      setEditingField({ id: null, field: null });
      setTempValue('');
      setError(''); // Clear any previous errors
    } catch (err) {
      setError('Failed to process change');
      console.error('Process error:', err);
    }
  };

  const handleUpdate = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      setError('No changes to update');
      return;
    }

    setLoading(true);
    const updatePromises = [];
    
    try {
      // Create update promises for all pending changes
      Object.values(pendingChanges).forEach(change => {
        updatePromises.push(
          updateIncomeSlab(change.id, { [change.field]: change.value })
        );
      });

      // Execute all updates
      await Promise.all(updatePromises);

      // Clear pending changes and show success
      setPendingChanges({});
      setHasUnsavedChanges(false);
      setError('');
      console.log('All changes updated successfully');
      
      // Optional: Show success message
      // You can add a success state if needed
      
    } catch (err) {
      setError('Failed to update some changes. Please try again.');
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscardChanges = () => {
    // Revert all changes
    const revertedSlabs = slabData.map(slab => {
      const revertedSlab = { ...slab };
      Object.values(pendingChanges).forEach(change => {
        if (change.id === slab.id) {
          // Find original value - this would need to be stored or refetched
          // For now, we'll just clear the pending changes
        }
      });
      return revertedSlab;
    });
    
    setPendingChanges({});
    setHasUnsavedChanges(false);
    setError('');
    
    // You might want to refetch data from API to get original values
    // fetchData();
  };

  const handleCancel = () => {
    // Clear editing state
    setEditingField({ id: null, field: null });
    setTempValue('');
    setError(''); // Clear any error messages
  };

  const renderCell = (slab, field, index) => {
    const isEditing = editingField.id === slab.id && editingField.field === field;
    const isLastRow = isLastIndex(index);

    if (isEditing) {
      return (
        <td className="editing-cell">
          <div className="input-container">
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave(slab.id, field, tempValue);
                } else if (e.key === 'Escape') {
                  handleCancel();
                }
              }}
              className="edit-input"
              autoFocus
            />
            <div className="input-actions">
              <button 
                className="icon-save-btn"
                onClick={() => handleSave(slab.id, field, tempValue)}
                title="Save changes (will be applied when Update is clicked)"
              >
                ✓
              </button>
              <button 
                className="icon-cancel-btn"
                onClick={handleCancel}
                type="button"
              >
                ✕
              </button>
            </div>
          </div>
        </td>
      );
    }

    if (field === 'slab_size') {
      let label;
      if (index === 0) {
        label = 'First';
      } else if (isLastRow) {
        label = 'Rest';
      } else {
        label = 'Next';
      }

      return (
        <td>
          <span className="cell-content">
            <span className="slab-label">{label}</span>
            {!isLastRow && (
              <span className={Object.keys(pendingChanges).some(key => key.startsWith(`${slab.id}_${field}`)) ? 'changed-value' : ''}>
                {Number(slab[field]).toLocaleString()}
              </span>
            )}
            {!isLastRow && (
              <svg 
                className="edit-icon" 
                onClick={() => handleEditClick(slab.id, field, slab[field])}
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            )}
          </span>
        </td>
      );
    }

    return (
      <td>
        <span className={"cell-content" + (field === 'tax_rate' ? ' tax-rate' : '')}>
          <span className={Object.keys(pendingChanges).some(key => key.startsWith(`${slab.id}_${field}`)) ? 'changed-value' : ''}>
            {field === 'tax_rate' ? `${slab[field]}%` : Number(slab[field]).toLocaleString()}
          </span>
          <svg 
            className="edit-icon" 
            onClick={() => handleEditClick(slab.id, field, slab[field])}
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </span>
      </td>
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Income Tax Slabs</h1>
        <p>Welcome back, <b>{userInfo?.name}</b></p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="category-toggle" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveCategory('regular')}
          className={activeCategory === 'regular' ? 'active' : ''}
        >
          Regular
        </button>
        <button
          onClick={() => setActiveCategory('female')}
          className={activeCategory === 'female' ? 'active' : ''}
        >
          Female
        </button>
        <button
          onClick={() => setActiveCategory('elderly')}
          className={activeCategory === 'elderly' ? 'active' : ''}
        >
          Elderly
        </button>
        <button
          onClick={() => setActiveCategory('disabled')}
          className={activeCategory === 'disabled' ? 'active' : ''}
        >
          Disabled
        </button>
        <button
          onClick={() => setActiveCategory('ff')}
          className={activeCategory === 'ff' ? 'active' : ''}
        >
          Freedom Fighter
        </button>
      </div>

      <div className="slab-table">
        <table>
          <thead>
            <tr>
              <th >Slab No.</th>
              <th>Slab Size</th>
              <th>Tax Rate (%)</th>
            </tr>
          </thead>
          <tbody>
            {filteredSlabs.length > 0 ? (
              filteredSlabs.map((slab, index) => (
                <tr key={slab.id}>
                  <td>{slab.slab_no}</td>
                  {renderCell(slab, 'slab_size', index)}
                  {renderCell(slab, 'tax_rate', index)}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No data found</td>
              </tr>
            )}
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
              onClick={handleDiscardChanges}
              disabled={loading}
            >
              Discard Changes
            </button>
            <button 
              className="update-btn"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update All Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;