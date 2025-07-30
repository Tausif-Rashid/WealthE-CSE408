import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { getCar, editCar } from '../utils/api';
import MessageDialog from '../components/MessageDialog';
import './AddExpense.css';

const EditAssetCar = () => {
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
    model: '',
    engine: '',
    description: '',
    cost: '',
    acquisition: '',
    reg_number: ''
  });

  useEffect(() => {
    if (!assetId) {
      showDialog('error', 'Error', 'No asset ID provided');
      return;
    }

    const fetchAsset = async () => {
      try {
        const car = await getCar(assetId);
        const asset = car.data;
        console.log(asset);
        setFormData({
          title: asset.title || '',
          model: asset.model || '',
          engine: asset.engine || '',
          description: asset.description || '',
          cost: asset.cost || '',
          acquisition: asset.acquisition || '',
          reg_number: asset.reg_number || ''
        });
      } catch (err) {
        console.error('Error fetching car:', err);
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
    if (!formData.title || !formData.model || !formData.cost || !formData.reg_number) {
      showDialog('error', 'Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data for API call
      const carData = {
        title: formData.title,
        model: formData.model,
        engine: formData.engine,
        description: formData.description,
        cost: parseFloat(formData.cost),
        acquisition: formData.acquisition,
        reg_number: formData.reg_number
      };

      await editCar(assetId, carData);
      showDialog('success', 'Success', 'Car updated successfully!');
      
    } catch (err) {
      console.error('Error updating car:', err);
      showDialog('error', 'Error', 'Failed to update car. Please try again.');
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
          <h1>🚗 Edit Car</h1>
          <p>Loading asset data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-expense-container">
      <div className="add-expense-header">
        <h1>🚗 Edit Car</h1>
        <p>Update the details of your car</p>
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
              placeholder="Enter car title (e.g., My Honda Civic)"
              required
              className="form-input"
            />
          </div>

          {/* Model Input */}
          <div className="form-group">
            <label htmlFor="model">Model *</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              placeholder="Enter car model"
              required
              className="form-input"
            />
          </div>

          {/* Engine Input */}
          <div className="form-group">
            <label htmlFor="engine">Engine size (in cc)*</label>
            <input
              type="text"
              id="engine"
              name="engine"
              value={formData.engine}
              onChange={handleInputChange}
              placeholder="Enter engine details"
              className="form-input"
              required
            />
          </div>

          {/* Registration Number Input */}
          <div className="form-group">
            <label htmlFor="reg_number">Registration Number *</label>
            <input
              type="text"
              id="reg_number"
              name="reg_number"
              value={formData.reg_number}
              onChange={handleInputChange}
              placeholder="Enter registration number"
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
              placeholder="Enter car cost/value"
              required
              min="0"
              step="0.01"
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
              <option value="Loan">Loan</option>
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
              placeholder="Enter additional details about the car"
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
              {loading ? 'Updating...' : 'Update Car'}
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

export default EditAssetCar;
