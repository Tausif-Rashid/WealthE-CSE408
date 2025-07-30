import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getUserIncome, getIncomeCategories, deleteIncome } from '../utils/api';
import MessageDialog from '../components/MessageDialog';
import './Income.css';

const Income = () => {
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('viewAll'); // 'viewAll' or 'categories'
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({
    show: false,
    incomeId: null,
    incomeName: ''
  });
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageDialogType, setMessageDialogType] = useState('');
  const [messageDialogTitle, setMessageDialogTitle] = useState('');
  const [messageDialogMessage, setMessageDialogMessage] = useState('');

  const showMessageDialog = (type, title, message) => {
    setMessageDialogType(type);
    setMessageDialogTitle(title);
    setMessageDialogMessage(message);
    setMessageDialogOpen(true);
  };

  const handleMessageDialogClose = () => {
    setMessageDialogOpen(false);
  };

  useEffect(() => {
    const fetchIncomes = async () => {
      setLoading(true);
      try {
        const [incomeData, categoryData] = await Promise.all([
          getUserIncome(),
          getIncomeCategories()
        ]);
        setIncomes(incomeData || []);
        setIncomeCategories(categoryData || []);
        setFilteredIncomes(incomeData || []);
      } catch (err) {
        console.error('Error fetching incomes:', err);
        showMessageDialog('error', 'Error', 'Failed to load incomes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchIncomes();
  }, []);

  // Filter incomes based on selected category
  useEffect(() => {
    if (activeTab === 'viewAll') {
      setFilteredIncomes(incomes);
    } else if (activeTab === 'categories' && selectedCategory) {
      const filtered = incomes.filter(income => 
        income.type === selectedCategory || 
        income.category === selectedCategory ||
        income.category_name === selectedCategory
      );
      setFilteredIncomes(filtered);
    } else {
      setFilteredIncomes([]);
    }
  }, [activeTab, selectedCategory, incomes]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'viewAll') {
      setSelectedCategory('');
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleEditIncome = (incomeId) => {
    navigate('/edit-income', { state: { incomeId } });
  };

  const handleDeleteIncome = async (incomeId) => {
    // Find the income to delete
    const income = incomes.find(inc => inc.id === incomeId);
    
    if (!income) {
      showMessageDialog('error', 'Error', 'Income not found');
      return;
    }

    // Set the income to delete and open dialog
    setDeleteDialog({
      show: true,
      incomeId: incomeId,
      incomeName: income.title || income.type || 'Income'
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteIncome(deleteDialog.incomeId);
      
      // Remove the deleted income from the local state
      setIncomes(prevIncomes => prevIncomes.filter(income => income.id !== deleteDialog.incomeId));
      setFilteredIncomes(prevFiltered => prevFiltered.filter(income => income.id !== deleteDialog.incomeId));
      
      // Close dialog and reset state
      setDeleteDialog({ show: false, incomeId: null, incomeName: '' });
      
      // Show success message
      showMessageDialog('success', 'Success', 'Income deleted successfully!');
      
      console.log('Income deleted successfully');
    } catch (error) {
      console.error('Error deleting income:', error);
      setDeleteDialog({ show: false, incomeId: null, incomeName: '' });
      showMessageDialog('error', 'Error', 'Failed to delete income. Please try again.');
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ show: false, incomeId: null, incomeName: '' });
  };

  const handleAddIncome = () => {
    navigate('/add-income');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      currencyDisplay: 'symbol'
    }).format(amount).replace('BDT', '৳');
  };

  if (loading) {
    return (
      <div className="income-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading incomes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="income-container">
        <div className="error-container">
          <h2>⚠️ Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="income-container">
      <div className="income-header">
        <h1>💰 Income</h1>
        
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
              {incomeCategories.map((category, index) => (
                <option key={index} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="income-content">
        {activeTab === 'categories' && !selectedCategory ? (
          <div className="no-incomes">
            <div className="no-incomes-icon">🏷️</div>
            <h3>Select a Category</h3>
            <p>Please select a category from the dropdown to view incomes.</p>
          </div>
        ) : filteredIncomes.length === 0 ? (
          <div className="no-incomes">
            <div className="no-incomes-icon">💰</div>
            <h3>No Incomes Found</h3>
            <p>
              {activeTab === 'viewAll' 
                ? "You haven't added any incomes yet. Click the + button to add your first income."
                : `No incomes found for the selected category "${selectedCategory}".`
              }
            </p>
          </div>
        ) : (
          <div className="income-grid">
            {filteredIncomes.map((income) => (
              <div key={income.id} className="income-card">
                <div className="income-header">
                  <div className="income-type">
                    <span className="type-icon">
                      {income.type === 'Salary' && '💼'}
                      {income.type === 'Business' && '🏢'}
                      {income.type === 'Agriculture' && '🌾'}
                      {income.type === 'Rent' && '🏠'}
                      {income.type === 'Investment' && '📈'}
                      {!['Salary', 'Business', 'Agriculture', 'Rent', 'Investment'].includes(income.type) && '💰'}
                    </span>
                    <span className="type-text">{income.type}</span>
                  </div>
                  <div className="income-amount">
                    {formatAmount(income.amount)}
                  </div>
                </div>
                
                <div className="income-body">
                  <h4 className="income-title">{income.title}</h4>
                  <div className="income-date">
                    <span className="date-icon">📅</span>
                    {formatDate(income.date)}
                  </div>
                  
                  {/* Show additional fields if they exist */}
                  {income.profit > 0  && (
                    <div className="income-profit">
                      <span className="profit-icon">💹</span>
                      <span className="profit-label">Profit: {formatAmount(income.profit)}</span>
                    </div>
                  )}
                  
                  {income.exempted_amount > 0 && (
                    <div className="income-exempted">
                      <span className="exempted-icon">🛡️</span>
                      <span className="exempted-label">Exempted: {formatAmount(income.exempted_amount)}</span>
                    </div>
                  )}
                  
                  {income.recurrence && (
                    <div className="income-recurrence">
                      <span className="recurrence-icon">🔄</span>
                      <span className="recurrence-label">Recurring: {income.recurrence}</span>
                    </div>
                  )}
                </div>
                
                <div className="income-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditIncome(income.id)}
                    title="Edit income"
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteIncome(income.id)}
                    title="Delete income"
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
        onClick={handleAddIncome}
        title="Add new income"
      >
        +
      </button>

      {/* Delete Dialog */}
      {deleteDialog.show && (
        <div className="income-delete-dialog-overlay">
          <div className="income-delete-dialog-container">
            <div className="income-delete-dialog-header">
              <h2>🗑️ Delete Income</h2>
            </div>
            
            <div className="income-delete-dialog-content">
              <p>Are you sure you want to delete the income "{deleteDialog.incomeName}"?</p>
              <p className="income-delete-warning-text">⚠️ This action cannot be undone!</p>
            </div>
            
            <div className="income-delete-dialog-actions">
              <button 
                type="button" 
                onClick={handleCancelDelete}
                className="income-delete-cancel-button"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleConfirmDelete}
                className="income-delete-confirm-button"
              >
                Delete Income
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Dialog */}
      <MessageDialog
        isOpen={messageDialogOpen}
        type={messageDialogType}
        title={messageDialogTitle}
        message={messageDialogMessage}
        onClose={handleMessageDialogClose}
      />
    </div>
  );
};

export default Income;
