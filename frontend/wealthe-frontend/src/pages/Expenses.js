import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getUserExpense, getExpenseCategories, deleteExpense } from '../utils/api';
import './Expenses.css';

const Expenses = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('viewAll'); // 'viewAll' or 'categories'
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const [expenseData, categoryData] = await Promise.all([
          getUserExpense(),
          getExpenseCategories()
        ]);
        setExpenses(expenseData || []);
        setExpenseCategories(categoryData || []);
        setFilteredExpenses(expenseData || []);
      } catch (err) {
        setError('Failed to load expenses');
        console.error('Error fetching expenses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  // Filter expenses based on selected category
  useEffect(() => {
    if (activeTab === 'viewAll') {
      setFilteredExpenses(expenses);
    } else if (activeTab === 'categories' && selectedCategory) {
      const filtered = expenses.filter(expense => 
        expense.type === selectedCategory || 
        expense.category === selectedCategory ||
        expense.category_name === selectedCategory
      );
      setFilteredExpenses(filtered);
    } else {
      setFilteredExpenses([]);
    }
  }, [activeTab, selectedCategory, expenses]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'viewAll') {
      setSelectedCategory('');
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleEditExpense = (expenseId) => {
    navigate('/edit-expense', { state: { expenseId } });
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(expenseId);
        
        // Remove the deleted expense from the local state
        setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== expenseId));
        setFilteredExpenses(prevFiltered => prevFiltered.filter(expense => expense.id !== expenseId));
        
        console.log('Expense deleted successfully');
      } catch (error) {
        console.error('Error deleting expense:', error);
        setError('Failed to delete expense. Please try again.');
      }
    }
  };

  const handleAddExpense = () => {
    navigate('/add-expense');
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
        
        {/* Tab Navigation */}
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'viewAll' ? 'active' : ''}`}
              onClick={() => handleTabChange('viewAll')}
            >
              View All
            </button>
            <button 
              className={`tab ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => handleTabChange('categories')}
            >
              Categories
            </button>
          </div>
        </div>

        {/* Category Filter */}
        {activeTab === 'categories' && (
          <div className="category-filter">
            <label htmlFor="category-select">Filter by Category:</label>
            <select 
              id="category-select"
              value={selectedCategory} 
              onChange={handleCategoryChange}
              className="category-dropdown"
            >
              <option value="">Select a category</option>
              {expenseCategories.map((category, index) => (
                <option key={index} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="expenses-content">
        {activeTab === 'categories' && !selectedCategory ? (
          <div className="no-expenses">
            <div className="no-expenses-icon">🏷️</div>
            <h3>Select a Category</h3>
            <p>Please select a category from the dropdown to view expenses.</p>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="no-expenses">
            <div className="no-expenses-icon">📝</div>
            <h3>No Expenses Found</h3>
            <p>
              {activeTab === 'viewAll' 
                ? "You haven't added any expenses yet. Click the + button to add your first expense."
                : `No expenses found for the selected category "${selectedCategory}".`
              }
            </p>
          </div>
        ) : (
          <div className="expenses-grid">
            {filteredExpenses.map((expense) => (
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
