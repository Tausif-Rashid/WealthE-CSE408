import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { getUserInfo, getTaxInfo, getTaxIncome } from '../utils/api';
import './Dashboard.css';
import { useNavigate } from 'react-router';

const Dashboard = () => {
  const { user, setUser } = useAuth(); // user in auth context, id and email
  const [userInfo, setUserInfo] = useState(null);
  const [taxInfo, setTaxInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
        console.log('Fetch user called in Dashboard 12345...'); // Debug log
        setLoading(true);
        try {
          const userData = await getUserInfo();
          const data = await getTaxIncome();
            if (!userData) {
                throw new Error('No user data found');
            }
            console.log('Fetched user info:', userData); // Debug log
          setUserInfo(userData?.[0] || null);
        } catch (err) {
          setError('Failed to load user information');
          console.error('Error fetching user info:', err);
        } finally {
            //console.log('Done fetch user data'); // Debug log
          setLoading(false);
        }

        
    };

    fetchUserInfo();
  }, []); //This useeffect runs once after page load

  useEffect(() => {
    const fetchTaxInfo = async () => {

        console.log('Fetch tax info called in Dashboard...'); // Debug log
        setLoading(true);
        try {
          const taxData = await getTaxInfo();
          if (!taxData) {
            throw new Error('No tax data found');
          }
          console.log('Fetched tax info:', taxData); // Debug log
          setTaxInfo(taxData?.[0] || null);
          setUser({ email: taxData?.[0]?.email, id: taxData?.[0]?.id }); // Update user in auth context from db
          
        } catch (err) {
          setError('Failed to load tax information');
          console.error('Error fetching tax info:', err);
        } finally {
            //console.log('Done fetch tax data'); // Debug log
          setLoading(false);
        }
    };
    fetchTaxInfo();
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
          <div className="user-stat-card">
            <div className="user-stat-icon">👤</div>
            <div className="stat-info">
              <h3>Profile</h3>
              <p className="stat-value-user">{userInfo?.name || 'N/A'}</p>
              <small>Your name</small>
            </div>
          </div>

          <div className="user-stat-card">
            <div className="user-stat-icon">📧</div>
            <div className="stat-info">
              <h3>Email</h3>
              <p className="stat-value-user">{taxInfo?.email || 'N/A'}</p> 
              {/* //id and email is stored in user from authContext.js */}
              <small>Your email address</small>
            </div>
          </div>
        </div>        
        <div className="user-details-section">
          <div className="details-card">
            <h2> User Information</h2>
            <div className="details-grid">
              <div className="detail-item">
                <label>ID:</label>
                <span>{user?.id || 'Not available'}</span> 
                {/*this id is from user for testing, use from userInfo */}
              </div>
              <div className="detail-item">
                <label>Full Name:</label>
                <span>{userInfo?.name || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <label>Phone:</label>
                <span>{userInfo?.phone || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <label>NID:</label>
                <span>{userInfo?.nid || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <label>Date of Birth:</label>
                <span>{userInfo?.dob ? new Date(userInfo.dob).toLocaleDateString() : 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <label>Spouse Name:</label>
                <span>{userInfo?.spouse_name || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <label>Spouse TIN:</label>
                <span>{userInfo?.spouse_tin || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <label>TIN:</label>
                <span>{taxInfo?.tin || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <label>Area:</label>
                <span>{taxInfo?.area_name || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <label>Tax Zone:</label>
                <span>{taxInfo?.tax_zone || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <label>Tax Circle:</label>
                <span>{taxInfo?.tax_circle || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Actions</h3>
          <div className="actions-grid">
            <button className="action-btn" onClick={() => navigate('/update-profile', { state: { userInfo, taxInfo } })}>
              <span>✏️</span>
              Edit Profile
            </button>
            <button className="action-btn" onClick={() => navigate('/change-password')}>
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


// api returns user data in the following format:
// [
// {
// "id": 2,
// "name": "tausif",
// "phone": "01234556778",
// "nid": "12345667890",
// "dob": "2002-01-01",
// "spouse_name": null,
// "spouse_tin": null
// }
// ]
// and tax info in the following format:
// [
// {
// "id": 2,
// "tin": "1234567890",
// "is_resident": true,
// "is_ff": false,
// "is_female": false,
// "is_disabled": false,
// "tax_zone": 1,
// "tax_circle": 2,
// "area_name": "Dhaka",
// "email": "abc@yahoo.com"
// }
// ]