import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { getPlot, editPlot } from '../utils/api';
import MessageDialog from '../components/MessageDialog';
import './AddExpense.css';

const EditAssetPlot = () => {
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
    type: '',
    description: '',
    cost: '',
    date: '',
    acquisition: '',
    location: ''
  });

  useEffect(() => {
    if (!assetId) {
      showDialog('error', 'Error', 'No asset ID provided');
      return;
    }

    const fetchAsset = async () => {
      try {
        const plot = await getPlot(assetId);
        const asset = plot.data;
        console.log(asset);
        setFormData({
          type: asset.type || '',
          description: asset.description || '',
          cost: asset.cost || '',
          date: asset.date || '',
          acquisition: asset.acquisition || '',
          location: asset.location || ''
        });
      } catch (err) {
        console.error('Error fetching plot:', err);
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
    if (!formData.type || !formData.cost || !formData.location) {
      showDialog('error', 'Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data for API call
      const plotData = {
        type: formData.type,
        description: formData.description,
        cost: parseFloat(formData.cost),
        date: formData.date,
        acquisition: formData.acquisition,
        location: formData.location
      };

      await editPlot(assetId, plotData);
      showDialog('success', 'Success', 'Plot updated successfully!');
      
    } catch (err) {
      console.error('Error updating plot:', err);
      showDialog('error', 'Error', 'Failed to update plot. Please try again.');
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
          <h1>🏞️ Edit Plot</h1>
          <p>Loading asset data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-expense-container">
      <div className="add-expense-header">
        <h1>🏞️ Edit Plot</h1>
        <p>Update the details of your plot</p>
      </div>

      <div className="add-expense-form-container">
        <form onSubmit={handleSubmit} className="add-expense-form">
          
          {/* Type Input */}
          <div className="form-group">
            <label htmlFor="type">Plot Type *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="form-input"
            >
              <option value="">Select plot type</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Agricultural">Agricultural</option>
              <option value="Industrial">Industrial</option>
              <option value="Mixed Use">Mixed Use</option>
              <option value="Other">Other</option>
            </select>
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
              placeholder="Enter plot location"
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
              placeholder="Enter plot cost/value"
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
              <option value="Government Allocation">Government Allocation</option>
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
              placeholder="Enter additional details about the plot"
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
              {loading ? 'Updating...' : 'Update Plot'}
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

export default EditAssetPlot;
