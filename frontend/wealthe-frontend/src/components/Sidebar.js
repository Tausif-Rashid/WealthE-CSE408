import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Define navigation items based on user role
  const getNavItems = () => {
      // if (user?.role === 'admin') {
      //   return [
      //     { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
      //     { path: '/admin/users', icon: '👥', label: 'User Management' },
      //     { path: '/admin/transactions', icon: '💰', label: 'Transactions' },
      //     { path: '/admin/reports', icon: '📈', label: 'Reports' }
      //   ];
      // }
    
    return [
      { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
      { path: '/expenses', icon: '💸', label: 'Expenses' },
      { path: '/income', icon: '💰', label: 'Income' },
      { path: '/goals', icon: '🎯', label: 'Goals' }
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>WealthE</h2>
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
