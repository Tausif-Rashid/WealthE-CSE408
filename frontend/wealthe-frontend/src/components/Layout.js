import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import Sidebar from './Sidebar';
import AdminSidebar from './AdminSidebar';
import './Layout.css';
import { getAuthRole } from '../utils/auth';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="layout">
      {/* Hamburger Menu Button */}
      <button 
        className="hamburger-menu" 
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay for mobile */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} 
        onClick={closeSidebar}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`}>
        {getAuthRole()==="admin" ? <AdminSidebar /> : <Sidebar />}
      </div>

      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
