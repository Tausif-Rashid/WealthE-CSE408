import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import './AdminDashboard.css';
import { getTotalUsers } from '../../utils/api';
import { getUserInfo } from '../../utils/api';

const AdminDashboard = () => {
  const { user, setUser } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    activeUsers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await getTotalUsers();
        setStats(prev => ({
          ...prev,
          totalUsers: response.total
        }));
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
      try {
        const userData = await getUserInfo();
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

    fetchStats();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, <b> <big> {userInfo?.name} </big> </b>  </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3># of Tax Payers</h3>
            <p className="stat-value">{stats.totalTransactions}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Amount of Tax Paid</h3>
            <p className="stat-value">{stats.activeUsers}</p>
          </div>
        </div>
      </div>

      <div className="admin-sections">
        <div className="section">
          <h2>Recent Activities</h2>
          {/* Add recent activities table/list here */}
        </div>
        
        <div className="section">
          <h2>System Status</h2>
          {/* Add system status information here */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;