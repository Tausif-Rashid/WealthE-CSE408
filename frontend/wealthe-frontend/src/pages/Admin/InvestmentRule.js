import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import './AdminDashboard.css';
import { getUserInfo, getInvestmentCategories } from '../../utils/api';

const InvestmentRule = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [investmentData, setInvestmentData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
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
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        // TODO: Implement API call to delete
        setInvestmentData(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        setError('Failed to delete category');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement API call to save changes
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      title: '',
      rate_rebate: '',
      minimum: '',
      maximum: '',
      description: ''
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Investment Categories</h1>
        <p>Welcome back, <b>{userInfo?.name}</b></p>
      </div>

      {isEditing && (
        <div className="form-container">
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
              <button type="submit" className="submit-btn">Save</button>
              <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
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
                  <td>{investment.minimum === 2147483647 ? 'N/A' : investment.minimum.toLocaleString()}</td>
                  <td>{investment.maximum === 2147483647 ? 'N/A' : investment.maximum.toLocaleString()}</td>
                  <td>{investment.description}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => handleEdit(investment)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(investment.id)}>Delete</button>
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
            }}
          >
            Add New Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentRule;