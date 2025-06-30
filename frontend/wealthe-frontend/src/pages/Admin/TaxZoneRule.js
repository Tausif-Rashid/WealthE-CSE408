import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import './AdminDashboard.css';
import { getUserInfo, getMinimumTaxList, getTaxAreaList, updateTaxZoneRule, deleteTaxZoneRule, addTaxZoneRule } from '../../utils/api';

const TaxZoneRule = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [taxZoneData, setTaxZoneData] = useState([]);
  const [taxAreaOptions, setTaxAreaOptions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    show: false,
    zoneId: null,
    zoneName: ''
  });
  const [formData, setFormData] = useState({
    area_name: '',
    minimum: ''
  });

  // Sort function to put "Rest" at the bottom
  const sortTaxZones = (zones) => {
    return [...zones].sort((a, b) => {
      if (a.area_name === 'Rest') return 1;
      if (b.area_name === 'Rest') return -1;
      return a.area_name.localeCompare(b.area_name);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const userData = await getUserInfo();
        // setUserInfo(userData?.[0] || null);

        const [taxZones, taxAreas] = await Promise.all([
          getMinimumTaxList(),
          getTaxAreaList()
        ]);
        
        // Sort the tax zones before setting state
        setTaxZoneData(sortTaxZones(taxZones));
        setTaxAreaOptions(taxAreas);
      } catch (err) {
        setError('Failed to load tax zone data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = (zone) => {
    setIsEditing(true);
    setEditingId(zone.id);
    setFormData({
      area_name: zone.area_name,
      minimum: zone.minimum.toString()
    });
  };

  const handleDeleteClick = (id, areaName) => {
    if (areaName === 'Rest') {
      setError('Cannot delete the Rest area');
      return;
    }
    
    setDeleteDialog({
      show: true,
      zoneId: id,
      zoneName: areaName
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTaxZoneRule(deleteDialog.zoneId);
      setTaxZoneData(prev => prev.filter(item => item.id !== deleteDialog.zoneId));
      setDeleteDialog({ show: false, zoneId: null, zoneName: '' });
    } catch (err) {
      setError('Failed to delete tax zone');
      console.error('Error deleting tax zone:', err);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ show: false, zoneId: null, zoneName: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const zoneData = {
        area_name: formData.area_name,
        minimum: parseFloat(formData.minimum)
      };

      if (editingId) {
        await updateTaxZoneRule(editingId, zoneData);
        setTaxZoneData(prev => sortTaxZones(
          prev.map(zone => 
            zone.id === editingId 
              ? { ...zone, ...zoneData }
              : zone
          )
        ));
      } else {
        const newZone = await addTaxZoneRule(zoneData);
        // Refresh the page after successfully adding a new tax zone
        window.location.reload();
      }

      setIsEditing(false);
      setEditingId(null);
      setFormData({
        area_name: '',
        minimum: ''
      });
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to save tax zone');
      console.error('Error saving tax zone:', err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Tax Zone Rules</h1>
        {/* <p>Welcome back, <b>{userInfo?.name}</b></p> */}
      </div>

      {error && <div className="error-message">{error}</div>}

      {deleteDialog.show && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h2>Delete Tax Zone</h2>
            <p>Are you sure you want to delete the tax zone for {deleteDialog.zoneName}?</p>
            <div className="dialog-buttons">
              <button onClick={handleConfirmDelete} className="confirm-btn">Delete</button>
              <button onClick={handleCancelDelete} className="dialog-cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Area Name:</label>
              <select
                name="area_name"
                value={formData.area_name}
                onChange={handleInputChange}
                required
              >
                <option value="">Select an area</option>
                {taxAreaOptions.map((area, index) => (
                  <option key={index} value={area.area_name}>
                    {area.area_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Minimum Tax (৳):</label>
              <input
                type="number"
                name="minimum"
                value={formData.minimum}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="form-submit-btn">Save</button>
              <button type="button" className="form-cancel-btn" onClick={() => {
                setIsEditing(false);
                setEditingId(null);
                setFormData({
                  area_name: '',
                  minimum: ''
                });
              }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="slab-table tax-zone-table">
        <table>
          <thead>
            <tr>
              <th>Area Name</th>
              <th>Minimum Tax (৳)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {taxZoneData.length > 0 ? (
              taxZoneData.map((zone) => (
                <tr key={zone.id}>
                  <td>{zone.area_name}</td>
                  <td>{zone.minimum}</td>
                  <td>
                    <div className="action-buttons">
                      <svg 
                        className="edit-icon" 
                        onClick={() => handleEdit(zone)}
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                        width="20"
                        height="20"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      {zone.area_name !== 'Rest' && (
                        <svg
                          className="delete-icon"
                          onClick={() => handleDeleteClick(zone.id, zone.area_name)}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          width="20"
                          height="20"
                        >
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No tax zones found</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="add-category-container">
          <button  
            className="add-category-btn"
            onClick={() => {
              setIsEditing(true);
              setEditingId(null);
              setFormData({
                area_name: '',
                minimum: ''
              });
            }}
          >
            Add New Tax Zone
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxZoneRule;