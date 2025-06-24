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
  const [formData, setFormData] = useState({
    area_name: '',
    minimum: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserInfo();
        setUserInfo(userData?.[0] || null);

        const [taxZones, taxAreas] = await Promise.all([
          getMinimumTaxList(),
          getTaxAreaList()
        ]);
        
        setTaxZoneData(taxZones);
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
      minimum: zone.minimum.toString().replace(/[^0-9.]/g, '')
    });
  };

  const handleDelete = async (id, areaName) => {
    if (areaName === 'Rest') {
      setError('Cannot delete the Rest area');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this tax zone?')) {
      try {
        await deleteTaxZoneRule(id);
        setTaxZoneData(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        setError('Failed to delete tax zone');
        console.error('Error deleting tax zone:', err);
      }
    }
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
        setTaxZoneData(prev => prev.map(zone => 
          zone.id === editingId 
            ? { ...zone, ...zoneData }
            : zone
        ));
      } else {
        const newZone = await addTaxZoneRule(zoneData);
        setTaxZoneData(prev => [...prev, newZone]);
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
        <p>Welcome back, <b>{userInfo?.name}</b></p>
      </div>

      {error && <div className="error-message">{error}</div>}

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
              <button type="submit" className="submit-btn">Save</button>
              <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {taxZoneData.length > 0 ? (
              taxZoneData.map((zone) => (
                <tr key={zone.id}>
                  <td>{zone.area_name}</td>
                  <td>{zone.minimum.toLocaleString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => handleEdit(zone)}>Edit</button>
                      {zone.area_name !== 'Rest' && (
                        <button className="delete-btn" onClick={() => handleDelete(zone.id, zone.area_name)}>Delete</button>
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