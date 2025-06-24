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
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="slab-table">
        <div className="table-actions">
          <button onClick={() => {
            setIsEditing(true);
            setEditingId(null);
            setFormData({
              title: '',
              rate_rebate: '',
              minimum: '',
              maximum: '',
              description: ''
            });
          }}>Add New Category</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
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
                  <td>{investment.id}</td>
                  <td>{investment.title}</td>
                  <td>{investment.rate_rebate}%</td>
                  <td>{investment.minimum.toLocaleString()}</td>
                  <td>{investment.maximum.toLocaleString()}</td>
                  <td>{investment.description}</td>
                  <td>
                    <button onClick={() => handleEdit(investment)}>Edit</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No investment categories found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvestmentRule;