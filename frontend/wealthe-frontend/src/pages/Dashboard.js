import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../components/AuthContext';
import { getUserInfo, getTaxInfo, getMonthlyIncomeByType, getMonthlyExpenseByType, getPreviousMonthsData } from '../utils/api';
import './Dashboard.css';
import { useNavigate } from 'react-router';

const Dashboard = () => {
  const { user, setUser } = useAuth(); // user in auth context, id and email
  const [userInfo, setUserInfo] = useState(null);
  const [taxInfo, setTaxInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [previousMonthsData, setPreviousMonthsData] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(false);
  const [barChartLoading, setBarChartLoading] = useState(false);
  const [userInfoExpanded, setUserInfoExpanded] = useState(false);
  const incomeChartRef = useRef(null);
  const expenseChartRef = useRef(null);
  const barChartRef = useRef(null);
  const incomeChartInstance = useRef(null);
  const expenseChartInstance = useRef(null);
  const barChartInstance = useRef(null);
  const navigate = useNavigate();

  // Chart registry to track all charts
  const chartRegistry = useRef(new Set());

  useEffect(() => {
    const fetchUserInfo = async () => {
        console.log('Fetch user called in Dashboard 12345...'); // Debug log
        setLoading(true);
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

  // Chart.js dynamic import and chart functions
  const loadChartJS = async () => {
    const { Chart, registerables } = await import('chart.js');
    Chart.register(...registerables);
    return Chart;
  };

  // Function to clear all charts
  const clearAllCharts = () => {
    try {
      chartRegistry.current.forEach(chart => {
        try {
          chart.destroy();
        } catch (error) {
          console.warn('Error destroying chart:', error);
        }
      });
      chartRegistry.current.clear();

      if (incomeChartInstance.current) {
        incomeChartInstance.current.destroy();
        incomeChartInstance.current = null;
      }
      if (expenseChartInstance.current) {
        expenseChartInstance.current.destroy();
        expenseChartInstance.current = null;
      }
      if (barChartInstance.current) {
        barChartInstance.current.destroy();
        barChartInstance.current = null;
      }
    } catch (error) {
      console.warn('Error clearing charts:', error);
    }
  };

  const createPieChart = async (canvasRef, data, title, colors, chartType = 'income') => {
    if (!data || data.length === 0) return null;

    const Chart = await loadChartJS();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return null;

    // Destroy existing chart based on chart type
    if (chartType === 'income' && incomeChartInstance.current) {
      try {
        incomeChartInstance.current.destroy();
      } catch (error) {
        console.warn('Error destroying income chart:', error);
      }
      incomeChartInstance.current = null;
    } else if (chartType === 'expense' && expenseChartInstance.current) {
      try {
        expenseChartInstance.current.destroy();
      } catch (error) {
        console.warn('Error destroying expense chart:', error);
      }
      expenseChartInstance.current = null;
    }

    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(item => item.type || 'Unknown'),
        datasets: [{
          data: data.map(item => parseFloat(item.total_income || item.total_expense || 0)),
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.8', '1')),
          borderWidth: 2,
          hoverBorderWidth: 3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12,
                family: 'Arial, sans-serif'
              },
              color: '#374151'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ৳${value.toLocaleString()} (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1000
        }
      }
    });

    // Register the chart
    chartRegistry.current.add(chart);

    return chart;
  };

  const createBarChart = async (canvasRef, data) => {
    if (!data || data.length === 0) return null;

    const Chart = await loadChartJS();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return null;

    const labels = data.map(item => item.month || 'Unknown');
    const incomeValues = data.map(item => parseFloat(item.income || 0));
    const expenseValues = data.map(item => parseFloat(item.expense || 0));

    // Destroy existing chart if it exists
    if (barChartInstance.current) {
      try {
        barChartInstance.current.destroy();
      } catch (error) {
        console.warn('Error destroying bar chart:', error);
      }
      barChartInstance.current = null;
    }

    // Clear the canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Income',
            data: incomeValues,
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: 'Expense',
            data: expenseValues,
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12,
                family: 'Arial, sans-serif'
              },
              color: '#374151'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y || 0;
                return `${label}: ৳${value.toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#374151',
              font: {
                size: 11
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            ticks: {
              color: '#374151',
              font: {
                size: 11
              },
              callback: function(value) {
                return '৳' + value.toLocaleString();
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });

    // Register the chart
    chartRegistry.current.add(chart);

    return chart;
  };
    // incomeChartInstance?.current?.destroy();
    // expenseChartInstance?.current?.destroy();
    // barChartInstance?.current?.destroy();
  // Fetch chart data
  useEffect(() => {
    const fetchChartData = async () => {
      setChartsLoading(true);
      setBarChartLoading(true);
      try {
        const [incomeResponse, expenseResponse, previousDataResponse] = await Promise.all([
          getMonthlyIncomeByType(),
          getMonthlyExpenseByType(),
          getPreviousMonthsData()
        ]);

        console.log('Income data:', incomeResponse);
        console.log('Expense data:', expenseResponse);
        console.log('Previous months data:', previousDataResponse);

        setIncomeData(incomeResponse || []);
        setExpenseData(expenseResponse || []);
        setPreviousMonthsData(previousDataResponse || []);
      } catch (err) {
        console.error('Error fetching chart data:', err);
      } finally {
        setChartsLoading(false);
        setBarChartLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // Create charts when data is available
  useEffect(() => {
    const initializeCharts = async () => {
      // Clear all existing charts first
      clearAllCharts();
      
      // Income chart colors
      const incomeColors = [
        'rgba(34, 197, 94, 0.8)',   // Green
        'rgba(59, 130, 246, 0.8)',  // Blue
        'rgba(168, 85, 247, 0.8)',  // Purple
        'rgba(236, 72, 153, 0.8)',  // Pink
        'rgba(245, 158, 11, 0.8)',  // Amber
        'rgba(239, 68, 68, 0.8)',   // Red
      ];

      // Expense chart colors
      const expenseColors = [
        'rgba(239, 68, 68, 0.8)',   // Red
        'rgba(245, 158, 11, 0.8)',  // Amber
        'rgba(236, 72, 153, 0.8)',  // Pink
        'rgba(168, 85, 247, 0.8)',  // Purple
        'rgba(59, 130, 246, 0.8)',  // Blue
        'rgba(34, 197, 94, 0.8)',   // Green
      ];

      // Create charts
      if (incomeData.length > 0) {
        incomeChartInstance.current = await createPieChart(
          incomeChartRef, 
          incomeData, 
          'Monthly Income by Type', 
          incomeColors,
          'income'
        );
      }

      if (expenseData.length > 0) {
        expenseChartInstance.current = await createPieChart(
          expenseChartRef, 
          expenseData, 
          'Monthly Expense by Type', 
          expenseColors,
          'expense'
        );
      }

      if (previousMonthsData.length > 0) {
        barChartInstance.current = await createBarChart(
          barChartRef,
          previousMonthsData
        );
      }
    };

    if (!chartsLoading && !barChartLoading && (incomeData.length > 0 || expenseData.length > 0 || previousMonthsData.length > 0)) {
      initializeCharts();
    }

    // Cleanup function
    return () => {
      try {
        // Destroy all registered charts
        chartRegistry.current.forEach(chart => {
          try {
            chart.destroy();
          } catch (error) {
            console.warn('Error destroying chart:', error);
          }
        });
        chartRegistry.current.clear();

        // Also destroy specific instances
        if (incomeChartInstance.current) {
          incomeChartInstance.current.destroy();
          incomeChartInstance.current = null;
        }
        if (expenseChartInstance.current) {
          expenseChartInstance.current.destroy();
          expenseChartInstance.current = null;
        }
        if (barChartInstance.current) {
          barChartInstance.current.destroy();
          barChartInstance.current = null;
        }
      } catch (error) {
        console.warn('Error during chart cleanup:', error);
      }
    };
  }, [incomeData, expenseData, previousMonthsData, chartsLoading, barChartLoading]);

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

        {/* Charts Section */}
        <div className="charts-section">
          <div className="charts-container">
            {/* Income Chart */}
            <div className="chart-card">
              <h3>📊 Monthly Income by Type</h3>
              <div className="chart-wrapper">
                {chartsLoading ? (
                  <div className="chart-loading">
                    <div className="spinner"></div>
                    <p>Loading income data...</p>
                  </div>
                ) : incomeData.length > 0 ? (
                  <canvas ref={incomeChartRef}></canvas>
                ) : (
                  <div className="no-data-message">
                    <p>📈 No income data available for this month</p>
                  </div>
                )}
              </div>
            </div>

            {/* Expense Chart */}
            <div className="chart-card">
              <h3>📊 Monthly Expense by Type</h3>
              <div className="chart-wrapper">
                {chartsLoading ? (
                  <div className="chart-loading">
                    <div className="spinner"></div>
                    <p>Loading expense data...</p>
                  </div>
                ) : expenseData.length > 0 ? (
                  <canvas ref={expenseChartRef}></canvas>
                ) : (
                  <div className="no-data-message">
                    <p>📉 No expense data available for this month</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bar Chart */}
            <div className="chart-card">
              <h3>📊 Income vs Expense - Last 4 Months</h3>
              <div className="chart-wrapper">
                {barChartLoading ? (
                  <div className="chart-loading">
                    <div className="spinner"></div>
                    <p>Loading previous months data...</p>
                  </div>
                ) : previousMonthsData.length > 0 ? (
                  <canvas ref={barChartRef}></canvas>
                ) : (
                  <div className="no-data-message">
                    <p>📈 No data available for previous months</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="user-details-section">
          <div className="details-card">
            <div className="details-header" onClick={() => setUserInfoExpanded(!userInfoExpanded)}>
              <h2>👤 User Information</h2>
              <span className={`expand-icon ${userInfoExpanded ? 'expanded' : ''}`}>
                {userInfoExpanded ? '▼' : '▶'}
              </span>
            </div>
            {userInfoExpanded && (
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
            )}
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
            <button className="action-btn" onClick={() => navigate('/tax-submissions')}>
              <span>⚙️</span>
              Tax Submissions
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