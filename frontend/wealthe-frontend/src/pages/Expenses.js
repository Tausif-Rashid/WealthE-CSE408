import React, { useState, useEffect } from 'react';
import { getUserExpense } from '../utils/api';
import './Expenses.css';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const expenseData = await getUserExpense();
        setExpenses(expenseData || []);
      } catch (err) {
        setError('Failed to load expenses');
        console.error('Error fetching expenses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleEditExpense = (expenseId) => {
    // TODO: Implement edit expense functionality
    console.log('Edit expense with ID:', expenseId);
  };

  const handleDeleteExpense = (expenseId) => {
    // TODO: Implement delete expense functionality
    console.log('Delete expense with ID:', expenseId);
  };

  const handleAddExpense = () => {
    // TODO: Implement add new expense functionality
    console.log('Add new expense');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="expenses-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading expenses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="expenses-container">
        <div className="error-container">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="expenses-container">
      <div className="expenses-header">
        <h1>💰 Expenses</h1>
      </div>

      <div className="expenses-content">
        {expenses.length === 0 ? (
          <div className="no-expenses">
            <div className="no-expenses-icon">📝</div>
            <h3>No Expenses Found</h3>
            <p>You haven't added any expenses yet. Click the + button to add your first expense.</p>
          </div>
        ) : (
          <div className="expenses-grid">
            {expenses.map((expense) => (
              <div key={expense.id} className="expense-card">
                <div className="expense-header">
                  <div className="expense-type">
                    <span className="type-icon">
                      {expense.type === 'utilities' && '🔌'}
                      {expense.type === 'food' && '🍽️'}
                      {expense.type === 'transport' && '🚗'}
                      {expense.type === 'entertainment' && '🎬'}
                      {expense.type === 'healthcare' && '🏥'}
                      {expense.type === 'shopping' && '🛍️'}
                      {!['utilities', 'food', 'transport', 'entertainment', 'healthcare', 'shopping'].includes(expense.type) && '💳'}
                    </span>
                    <span className="type-text">{expense.type}</span>
                  </div>
                  <div className="expense-amount">
                    {formatAmount(expense.amount)}
                  </div>
                </div>
                
                <div className="expense-body">
                  <p className="expense-description">{expense.description}</p>
                  <div className="expense-date">
                    <span className="date-icon">📅</span>
                    {formatDate(expense.date)}
                  </div>
                </div>
                
                <div className="expense-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditExpense(expense.id)}
                    title="Edit expense"
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteExpense(expense.id)}
                    title="Delete expense"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button 
        className="floating-add-btn"
        onClick={handleAddExpense}
        title="Add new expense"
      >
        +
      </button>
    </div>
  );
};

export default Expenses;
