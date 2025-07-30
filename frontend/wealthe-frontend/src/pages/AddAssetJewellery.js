import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { addJewellery } from '../utils/api';
import MessageDialog from '../components/MessageDialog';
import './AddExpense.css';

const AddAssetJewellery = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cost: '',
    acquisition: '',
    weight: ''
  });

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
    if (!formData.title || !formData.cost) {
      showDialog('error', 'Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare data for API call
      const jewelleryData = {
        title: formData.title,
        description: formData.description,
        cost: parseFloat(formData.cost),
        acquisition: formData.acquisition,
        weight: formData.weight ? parseFloat(formData.weight) : null
      };

      await addJewellery(jewelleryData);
      showDialog('success', 'Success', 'Jewellery added successfully!');
      
    } catch (err) {
      console.error('Error adding jewellery:', err);
      showDialog('error', 'Error', 'Failed to add jewellery. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/assets');
  };

  return (
    <div className="add-expense-container">
      <div className="add-expense-header">
        <h1>💍 Add Jewellery</h1>
        <p>Fill in the details to add new jewellery</p>
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
              placeholder="Enter jewellery title (e.g., Gold Necklace)"
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
              placeholder="Enter jewellery cost/value"
              required
              min="0"
              step="0.01"
              className="form-input"
            />
          </div>

          {/* Weight Input */}
          <div className="form-group">
            <label htmlFor="weight">Weight (grams)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="Enter weight in grams"
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
              <option value="Wedding Gift">Wedding Gift</option>
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
              placeholder="Enter additional details about the jewellery"
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
              {loading ? 'Adding...' : 'Add Jewellery'}
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

export default AddAssetJewellery;
