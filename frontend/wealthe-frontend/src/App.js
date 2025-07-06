import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';
import AdminDashboard from './pages/Admin/AdminDashboard';
import IncomeRule from './pages/Admin/IncomeRule';
import InvestmentRule from './pages/Admin/InvestmentRule';
import RebateRule from './pages/Admin/RebateRule';
import TaxZoneRule from './pages/Admin/TaxZoneRule';
import './App.css';
import { getAuthRole } from './utils/auth';

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();
  console.log (user);
  console.log (isAuthenticated);
  console.log ("app.js" + getAuthRole());

  return (
    <Routes>
      {/* Public routes - redirect to dashboard if already authenticated */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to={getAuthRole() === 'admin' ? '/admin/dashboard' : '/dashboard'} replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to={getAuthRole() === 'admin' ? '/admin/dashboard' : '/dashboard'} replace /> : <Register />} 
      />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={ 
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />

      {/* Admin routes */}
      <Route 
        path="/admin/dashboard" 
        element={ 
          <ProtectedRoute>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/rules/income" 
        element={ 
          <ProtectedRoute>
            <Layout>
              <IncomeRule />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/rules/investment" 
        element={ 
          <ProtectedRoute>
            <Layout>
              <InvestmentRule />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/rules/rebate" 
        element={ 
          <ProtectedRoute>
            <Layout>
              <RebateRule />
            </Layout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/rules/taxzone" 
        element={ 
          <ProtectedRoute>
            <Layout>
              <TaxZoneRule />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      
      <Route 
        path="/expenses" 
        element={
          <ProtectedRoute>
            <Layout>
              <Expenses />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/add-expense" 
        element={
          <ProtectedRoute>
            <Layout>
              <AddExpense />
            </Layout>
          </ProtectedRoute>
        } 
      />
      
      {/* Default route - redirect based on authentication and role */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? 
            <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace /> : 
            <Navigate to="/login" replace />
        } 
      />
      
      {/* Catch all route */}
      <Route 
        path="*" 
        element={
          isAuthenticated ? 
            <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace /> : 
            <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
