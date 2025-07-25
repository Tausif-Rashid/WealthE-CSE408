import React from 'react';
import { useAuth } from './AuthContext';
import Sidebar from './Sidebar';
import AdminSidebar from './AdminSidebar';
import './Layout.css';
import { getAuthRole } from '../utils/auth';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="layout">
      {getAuthRole()==="admin" ? <AdminSidebar /> : <Sidebar />}
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
