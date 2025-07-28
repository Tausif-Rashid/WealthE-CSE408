import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';
import EditExpense from './pages/EditExpense';
import Income from './pages/Income';
import AddIncome from './pages/AddIncome';
import EditIncome from './pages/EditIncome';
import TaxEstimation from './pages/TaxEstimation';
import AdminDashboard from './pages/Admin/AdminDashboard';
import IncomeRule from './pages/Admin/IncomeRule';
import InvestmentRule from './pages/Admin/InvestmentRule';
import RebateRule from './pages/Admin/RebateRule';
import TaxZoneRule from './pages/Admin/TaxZoneRule';
import UpdateProfile from './pages/UpdateProfile';
import ChangePassword from './pages/ChangePassword';
import ChatBot from './pages/ChatBot';
import Assets from './pages/Assets';
import AddAssetBankAccount from './pages/AddAssetBankAccount';
import AddAssetCar from './pages/AddAssetCar';
import AddAssetFlat from './pages/AddAssetFlat';
import AddAssetJewellery from './pages/AddAssetJewellery';
import AddAssetPlot from './pages/AddAssetPlot';
import EditAssetBankAccount from './pages/EditAssetBankAccount';

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

      <Route 
        path="/add-asset-bank-account" 
        element={
          <ProtectedRoute>
            <Layout>
              <AddAssetBankAccount />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/add-asset-car" 
        element={
          <ProtectedRoute>
            <Layout>
              <AddAssetCar />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="//add-asset-flat" 
        element={
          <ProtectedRoute>
            <Layout>
              <AddAssetFlat />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="//add-asset-plot" 
        element={
          <ProtectedRoute>
            <Layout>
              <AddAssetPlot />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="//add-asset-jewellery" 
        element={
          <ProtectedRoute>
            <Layout>
              <AddAssetJewellery />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/edit-expense" 
        element={
          <ProtectedRoute>
            <Layout>
              <EditExpense />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/edit-asset-bank-account" 
        element={
          <ProtectedRoute>
            <Layout>
              <EditAssetBankAccount />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/income" 
        element={
          <ProtectedRoute>
            <Layout>
              <Income />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/add-income" 
        element={
          <ProtectedRoute>
            <Layout>
              <AddIncome />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/edit-income" 
        element={
          <ProtectedRoute>
            <Layout>
              <EditIncome />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/tax-estimation" 
        element={
          <ProtectedRoute>
            <Layout>
              <TaxEstimation />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/assets" 
        element={
          <ProtectedRoute>
            <Layout>
              <Assets />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/update-profile" 
        element={ 
          <ProtectedRoute>
            <Layout>
              <UpdateProfile />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/change-password" 
        element={ 
          <ProtectedRoute>
            <Layout>
              <ChangePassword />
            </Layout>
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/chatbot" 
        element={ 
          <ProtectedRoute>
            <Layout>
              <ChatBot />
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
            <LandingPage />
        } 
      />
      
      {/* Catch all route */}
      <Route 
        path="*" 
        element={
          isAuthenticated ? 
            <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace /> : 
            <Navigate to="/" replace />
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
