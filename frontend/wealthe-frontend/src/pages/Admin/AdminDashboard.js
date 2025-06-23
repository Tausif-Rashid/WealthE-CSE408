import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    activeUsers: 0
  });

  useEffect(() => {
    // TODO: Implement admin statistics fetching
    // This would be connected to your backend API
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.email}</p>
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
            <h3>Total Transactions</h3>
            <p className="stat-value">{stats.totalTransactions}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Active Users</h3>
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