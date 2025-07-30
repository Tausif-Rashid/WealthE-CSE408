import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { getFlat, editFlat } from '../utils/api';
import MessageDialog from '../components/MessageDialog';
import './AddExpense.css';

const EditAssetFlat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const assetId = location.state?.assetId;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cost: '',
    date: '',
    location: '',
    acquisition: ''
  });

  useEffect(() => {
    if (!assetId) {
      showDialog('error', 'Error', 'No asset ID provided');
      return;
    }

    const fetchAsset = async () => {
      try {
        const flat = await getFlat(assetId);
        const asset = flat.data;
        console.log(asset);
        setFormData({
          title: asset.title || '',
          description: asset.description || '',
          cost: asset.cost || '',
          date: asset.date || '',
          location: asset.location || '',
          acquisition: asset.acquisition || ''
        });
      } catch (err) {
        console.error('Error fetching flat:', err);
        showDialog('error', 'Error', 'Failed to load asset data');
      } finally {
        setFetching(false);
      }
    };

    fetchAsset();
  }, [assetId]);

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
    if (!formData.title || !formData.cost || !formData.location) {
      showDialog('error', 'Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data for API call
      const flatData = {
        title: formData.title,
        description: formData.description,
        cost: parseFloat(formData.cost),
        date: formData.date,
        location: formData.location,
        acquisition: formData.acquisition
      };

      await editFlat(assetId, flatData);
      showDialog('success', 'Success', 'Flat updated successfully!');
      
    } catch (err) {
      console.error('Error updating flat:', err);
      showDialog('error', 'Error', 'Failed to update flat. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/assets');
  };

  if (fetching) {
    return (
      <div className="add-expense-container">
        <div className="add-expense-header">
          <h1>🏠 Edit Flat</h1>
          <p>Loading asset data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-expense-container">
      <div className="add-expense-header">
        <h1>🏠 Edit Flat</h1>
        <p>Update the details of your flat</p>
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
              placeholder="Enter flat title (e.g., Apartment in Dhanmondi)"
              required
              className="form-input"
            />
          </div>

          {/* Location Input */}
          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter flat location"
              required
              className="form-input"
            />
          </div>

          {/* Cost Input */}
          <div className="form-group">
            <label htmlFor="cost">Cost (৳) *</label>
            <input
              type="number"
              id="cost"
              name="cost"
              value={formData.cost}
              onChange={handleInputChange}
              placeholder="Enter flat cost/value"
              required
              min="0"
              step="0.01"
              className="form-input"
            />
          </div>

          {/* Date Input */}
          <div className="form-group">
            <label htmlFor="date">Acquisition Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          {/* Acquisition Input */}
          <div className="form-group">
            <label htmlFor="acquisition">Acquisition Method</label>
            <select
              id="acquisition"
              name="acquisition"
              value={formData.acquisition}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="">Select acquisition method</option>
              <option value="Purchase">Purchase</option>
              <option value="Gift">Gift</option>
              <option value="Inheritance">Inheritance</option>
              <option value="Rent-to-Own">Rent-to-Own</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Description Input */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter additional details about the flat"
              rows="3"
              className="form-input"
            />
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="add-cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="add-add-btn">
              {loading ? 'Updating...' : 'Update Flat'}
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

export default EditAssetFlat;
