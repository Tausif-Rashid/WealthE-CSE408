import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { getUserInfo } from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
        console.log('Fetch user called in Dashboard...'); // Debug log
        setLoading(true);
        try {
          const userData = await getUserInfo();
            if (!userData) {
                throw new Error('No user data found');
            }
            console.log('Fetched user info:', userData); // Debug log
          setUser(userData);
        } catch (err) {
          setError('Failed to load user information');
          console.error('Error fetching user info:', err);
        } finally {
            console.log('Done fetch user data'); // Debug log
          setLoading(false);
        }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard</p>
      </div>

      <div className="dashboard-content">        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👤</div>
            <div className="stat-info">
              <h3>Profile</h3>
              <p className="stat-value">{user?.user_info?.[0]?.name || user?.name || 'N/A'}</p>
              <small>Your name</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📧</div>
            <div className="stat-info">
              <h3>Email</h3>
              <p className="stat-value">{user?.email || 'N/A'}</p>
              <small>Your email address</small>
            </div>
          </div>
        </div>        <div className="user-details-section">
          <div className="details-card">
            <h2>👤 User Information</h2>
            <div className="details-grid">
              <div className="detail-item">
                <label>ID:</label>
                <span>{user?.user_info?.[0]?.id || 'Not available'}</span>
              </div>
              <div className="detail-item">
                <label>Full Name:</label>
                <span>{user?.user_info?.[0]?.name || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <label>Phone:</label>
                <span>{user?.user_info?.[0]?.phone || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <label>NID:</label>
                <span>{user?.user_info?.[0]?.nid || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <label>Date of Birth:</label>
                <span>{user?.user_info?.[0]?.dob ? new Date(user.user_info[0].dob).toLocaleDateString() : 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <label>Spouse Name:</label>
                <span>{user?.user_info?.[0]?.spouse_name || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <label>Spouse TIN:</label>
                <span>{user?.user_info?.[0]?.spouse_tin || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <label>TIN:</label>
                <span>{user?.tax_info?.[0]?.tin || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <label>Area:</label>
                <span>{user?.tax_info?.[0]?.area_name || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <label>Tax Zone:</label>
                <span>{user?.tax_info?.[0]?.tax_zone || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <label>Tax Circle:</label>
                <span>{user?.tax_info?.[0]?.tax_circle || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Actions</h3>
          <div className="actions-grid">
            <button className="action-btn">
              <span>✏️</span>
              Edit Profile
            </button>
            <button className="action-btn">
              <span>🔐</span>
              Change Password
            </button>
            <button className="action-btn">
              <span>⚙️</span>
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
