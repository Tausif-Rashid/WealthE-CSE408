import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './AdminSidebar.css';

const AdminSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  const adminNavItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    {
      path: '/admin/rules',
      icon: '📋',
      label: 'Rules Management',
      subItems: [
        { path: '/admin/rules/income', label: 'Income Rules' },
        { path: '/admin/rules/investment', label: 'Investment Rules' },
        { path: '/admin/rules/rebate', label: 'Rebate Rules' },
        { path: '/admin/rules/taxzone', label: 'Tax Zone Rules' }
      ]
    },
    { path: '/admin/files', icon: '📁', label: 'Files' }
  ];

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>WealthE Admin</h2>
        <div className="admin-user-info">
          <span className="admin-badge">Admin</span>
          <p>{user?.email}</p>
        </div>
      </div>

      <nav className="admin-sidebar-nav">
        <ul>
          {adminNavItems.map((item) => (
            <li key={item.path}>
              {item.subItems ? (
                <div>
                  <button
                    className={`nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                    onClick={() => setIsRulesOpen(!isRulesOpen)}
                  >
                    <div className="nav-item-content">
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                    </div>
                    <span className="arrow-icon">{isRulesOpen ? '▲' : '▼'}</span>
                  </button>
                  {isRulesOpen && (
                    <ul className="subnav">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.path}>
                          <Link
                            to={subItem.path}
                            className={location.pathname === subItem.path ? 'active' : ''}
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <div className="nav-item-content">
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </div>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      
      <div className="admin-sidebar-footer">
        <button onClick={logout} className="admin-logout-btn">
          <span className="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;