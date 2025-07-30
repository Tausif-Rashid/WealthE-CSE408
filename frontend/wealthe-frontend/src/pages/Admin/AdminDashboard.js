import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import './AdminDashboard.css';
import { getTotalTaxPayers, getTotalUsers, getTaxAreaList, getAdminName } from '../../utils/api';
import { getUserInfo } from '../../utils/api';

const AdminDashboard = () => {
  const { user, setUser } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTaxPayers: 0,
    pendingFiles: 0, 
    name: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await getTotalUsers();
        const res = await getTotalTaxPayers();
        const adminName = await getAdminName();
        setStats(prev => ({
          ...prev,
          totalUsers: response.total,
          totalTaxPayers: res.count,
          name : adminName.name
        }));
      } catch (err) {
        setError('Failed to load dashboard statistics');
        console.error('Error fetching statistics:', err);
      } finally {
        setLoading(false);
      }
      try {
        setLoading(true);
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
      try {
        setLoading(true);
        console.log(" Income Slabs: ");
        const response = await getTaxAreaList();
        console.log(response);
      } catch (err) {
        setError('Failed to load Income Slab');
        console.error('Error fetching Income Slab:', err);
      } finally {
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
        <p>Welcome back, <b> <big> {stats.name} </big> </b>  </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-value">{stats?.totalUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3># of Tax Payers</h3>
            <p className="stat-value">{stats?.totalTaxPayers}</p>
          </div>
        </div>

        
      </div>

      <div className="admin-sections">
        
      </div>
    </div>
  );
};

export default AdminDashboard;