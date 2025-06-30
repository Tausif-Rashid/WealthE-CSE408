import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import './AdminDashboard.css';
import { 
  getUserInfo, 
  getInvestmentCategories, 
  updateInvestmentCategory, 
  addInvestmentCategory, 
  deleteInvestmentCategory 
} from '../../utils/api';

const InvestmentRule = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [investmentData, setInvestmentData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    rate_rebate: '',
    minimum: '',
    maximum: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserInfo();
        setUserInfo(userData?.[0] || null);

        const investments = await getInvestmentCategories();
        setInvestmentData(investments);
      } catch (err) {
        setError('Failed to load investment data');
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

  const handleEdit = (investment) => {
    setIsEditing(true);
    setEditingId(investment.id);
    setFormData({
      title: investment.title,
      rate_rebate: investment.rate_rebate,
      minimum: investment.minimum,
      maximum: investment.maximum,
      description: investment.description
    });
    setError(''); // Clear any error messages
    setSuccess(''); // Clear any success messages
  };

  const handleDelete = (investment) => {
    setCategoryToDelete(investment);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
      setError(''); // Clear any previous errors
      await deleteInvestmentCategory(categoryToDelete.id);
      
      // Remove from local state
      setInvestmentData(prev => prev.filter(item => item.id !== categoryToDelete.id));
      
      // Show success message
      setSuccess(`Category "${categoryToDelete.title}" deleted successfully!`);
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      setError('Failed to delete category');
      console.error('Error deleting category:', err);
    } finally {
      // Close dialog and reset
      setShowDeleteDialog(false);
      setCategoryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setCategoryToDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError(''); // Clear any previous errors
      
      if (editingId) {
        // Update existing category
        await updateInvestmentCategory(editingId, formData);
        
        // Update the local state
        setInvestmentData(prev => prev.map(item => 
          item.id === editingId 
            ? { ...item, ...formData, rate_rebate: parseFloat(formData.rate_rebate) }
            : item
        ));
      } else {
        // Add new category
        const newCategory = await addInvestmentCategory(formData);
        
        // Add to local state
        setInvestmentData(prev => [...prev, newCategory]);
      }
      
      // Reset form
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        title: '',
        rate_rebate: '',
        minimum: '',
        maximum: '',
        description: ''
      });
      
      // Show success message
      setSuccess(editingId ? 'Category updated successfully!' : 'Category added successfully!');
      setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds
      
    } catch (err) {
      setError(editingId ? 'Failed to update category' : 'Failed to add category');
      console.error('Error saving category:', err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Investment Categories</h1>
        {/* <p>Welcome back, <b>{userInfo?.name}</b></p> */}
        {error && <div className="error-message" style={{color: 'red', marginTop: '10px'}}>{error}</div>}
        {success && <div className="success-message" style={{color: 'green', marginTop: '10px'}}>{success}</div>}
      </div>

      {isEditing && (
        <div className="form-container">
          <h2>{editingId ? 'Edit Investment Category' : 'Add New Investment Category'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Rate/Rebate (%):</label>
              <input
                type="number"
                name="rate_rebate"
                value={formData.rate_rebate}
                onChange={handleInputChange}
                required
                min="0"
                max="100"
              />
            </div>
            <div className="form-group">
              <label>Minimum (৳):</label>
              <input
                type="number"
                name="minimum"
                value={formData.minimum}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Maximum (৳):</label>
              <input
                type="number"
                name="maximum"
                value={formData.maximum}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="form-submit-btn">
                {editingId ? 'Update Category' : 'Add Category'}
              </button>
              <button 
                type="button" 
                className="form-cancel-btn" 
                onClick={() => {
                  setIsEditing(false);
                  setError('');
                  setSuccess('');
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="slab-table investment-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Rate/Rebate (%)</th>
              <th>Minimum (৳)</th>
              <th>Maximum (৳)</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {investmentData.length > 0 ? (
              investmentData.map((investment) => (
                <tr key={investment.id}>
                  <td>{investment.title}</td>
                  <td>{investment.rate_rebate}%</td>
                  <td>{investment.minimum === 2147483647 ? 'N/A' : investment.minimum}</td>
                  <td>{investment.maximum === 2147483647 ? 'N/A' : investment.maximum}</td>
                  <td>{investment.description}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => handleEdit(investment)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(investment)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No investment categories found</td>
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
                title: '',
                rate_rebate: '',
                minimum: '',
                maximum: '',
                description: ''
              });
              setError(''); // Clear any error messages
              setSuccess(''); // Clear any success messages
            }}
          >
            Add New Category
          </button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <div className="dialog-header">
              <h3>Confirm Delete</h3>
            </div>
            <div className="dialog-content">
              <p>Are you sure you want to delete this investment category?</p>
              <div className="category-details">
                <strong>{categoryToDelete?.title}</strong>
                <br />
                <span className="category-description">{categoryToDelete?.description}</span>
              </div>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="dialog-actions">
              <button className="dialog-cancel-btn" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="dialog-delete-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentRule;