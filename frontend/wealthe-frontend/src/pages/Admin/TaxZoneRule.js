import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import './AdminDashboard.css';
import { getUserInfo, getMinimumTaxList } from '../../utils/api';

const TaxZoneRule = () => {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [taxZoneData, setTaxZoneData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserInfo();
        setUserInfo(userData?.[0] || null);

        const taxZones = await getMinimumTaxList();
        setTaxZoneData(taxZones);
      } catch (err) {
        setError('Failed to load tax zone data');
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
        <h1>Tax Zone Rules</h1>
        <p>Welcome back, <b>{userInfo?.name}</b></p>
      </div>

      <div className="slab-table">
        <table>
          <thead>
            <tr>
              <th>Area Name</th>
              <th>Minimum Tax (৳)</th>
            </tr>
          </thead>
          <tbody>
            {taxZoneData.length > 0 ? (
              taxZoneData.map((zone) => (
                <tr key={zone.id}>
                  <td>{zone.area_name}</td>
                  <td>{zone.minimum.toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No tax zones found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaxZoneRule;