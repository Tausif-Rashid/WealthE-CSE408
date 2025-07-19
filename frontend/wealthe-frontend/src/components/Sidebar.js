import React from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from './AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Define navigation items based on user role
  const getNavItems = () => {
    return [
      { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
      { path: '/expenses', icon: '💸', label: 'Expenses' },
      { path: '/income', icon: '💰', label: 'Income' },
      { path: '/tax-estimation', icon: '📊', label: 'Tax Estimation' },
      { path: '/chatbot', icon: '💬', label: 'Ask question' },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <img
            src="/trending-up-svgrepo-com.svg"
            alt="Trending Up"
            className="logo-icon"
            width="35"
            height="35"
          />
          <h2>WealthE</h2>
        </div>
        <div className="user-info">
          <p>{user?.email}</p>
          <p className="user-role">{user?.role || 'user'}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
