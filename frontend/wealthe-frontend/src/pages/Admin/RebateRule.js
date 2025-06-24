import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import './AdminDashboard.css';
import { getUserInfo, getRebateRules } from '../../utils/api';

const RebateRule = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rebateData, setRebateData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserInfo();
        setUserInfo(userData?.[0] || null);

        const rebateRules = await getRebateRules();
        setRebateData(rebateRules);
      } catch (err) {
        setError('Failed to load rebate rules');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Rebate Rules</h1>
        <p>Welcome back, <b>{userInfo?.name}</b></p>
      </div>

      <div className="slab-table">
        <table>
          <thead>
            <tr>
              <th>Maximum Rebate Amount (৳)</th>
              <th>Maximum % of Income</th>
            </tr>
          </thead>
          <tbody>
            {rebateData ? (
              <tr>
                <td>{rebateData.maximum.toLocaleString()}</td>
                <td>{rebateData.max_of_income}%</td>
              </tr>
            ) : (
              <tr>
                <td colSpan="2">No rebate rules found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RebateRule;