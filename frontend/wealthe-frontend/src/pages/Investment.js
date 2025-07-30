import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getUserInvestment, getInvestmentCategories, deleteInvestment } from '../utils/api';
import './Investment.css';

const Investment = () => {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
  const [investmentCategories, setInvestmentCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('viewAll'); // 'viewAll' or 'categories'
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredInvestments, setFilteredInvestments] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({
    show: false,
    investmentId: null,
    investment: null
  });

  useEffect(() => {
    const fetchInvestments = async () => {
      setLoading(true);
      try {
        const [investmentData, categoryData] = await Promise.all([
          getUserInvestment(),
          getInvestmentCategories()
        ]);
        setInvestments(investmentData || []);
        setInvestmentCategories(categoryData || []);
        console.log(investmentData);
        console.log(categoryData);
        setFilteredInvestments(investmentData || []);
      } catch (err) {
        setError('Failed to load investments');
        console.error('Error fetching investments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  // Filter investments based on selected category
  useEffect(() => {
    if (activeTab === 'viewAll') {
      setFilteredInvestments(investments);
    } else if (activeTab === 'categories' && selectedCategory) {
      const filtered = investments.filter(investment => 
        investment.title === selectedCategory 
      );
      setFilteredInvestments(filtered);
    } else {
      setFilteredInvestments(investments);
    }
  }, [activeTab, selectedCategory, investments]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'viewAll') {
      setSelectedCategory('');
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const handleEdit = (investmentId) => {
    console.log(investmentId);
    navigate('/edit-investment', { state: { investmentId } });
  };

  const handleDelete = (investment) => {
    setDeleteDialog({
      show: true,
      investmentId: investment.id,
      investment: investment
    });
  };

  const confirmDelete = async () => {
    try {
      await deleteInvestment(deleteDialog.investmentId);
      setInvestments(prev => prev.filter(inv => inv.id !== deleteDialog.investmentId));
      setDeleteDialog({ show: false, investmentId: null, investment: null });
    } catch (err) {
      setError('Failed to delete investment');
      console.error('Error deleting investment:', err);
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ show: false, investmentId: null, investment: null });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
      currencyDisplay: 'code'
    }).format(amount || 0).replace('BDT', '৳');
  };

  if (loading) {
    return (
      <div className="investment-page">
        <div className="loading">Loading investments...</div>
      </div>
    );
  }

  return (
    <div className="investment-page">
      <div className="investment-header">
        <h1>My Investments</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="investment-tabs">
        <button 
          className={`tab-btn ${activeTab === 'viewAll' ? 'active' : ''}`}
          onClick={() => handleTabChange('viewAll')}
        >
          View All
        </button>
        <button 
          className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => handleTabChange('categories')}
        >
          Filter by Categories
        </button>
      </div>

      {activeTab === 'categories' && (
        <div className="category-filter">
          <h3>Select Category:</h3>
          <div className="category-buttons">
            {investmentCategories.map((category) => (
              <button
                key={category.id || category.name}
                className={`category-btn ${selectedCategory === (category.title) ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(category.title)}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="investment-grid">
        {filteredInvestments.length === 0 ? (
          <div className="no-investments">
            <p>No investments found.</p>
            <button 
              className="add-first-investment-btn"
              onClick={() => navigate('/add-investment')}
            >
              Add Your First Investment
            </button>
          </div>
        ) : (
          filteredInvestments.map((investment) => (
            <div key={investment.id} className="investment-card">
              <div className="investment-card-header">
                <div className="investment-amount">
                  {formatAmount(investment.amount)}
                </div>
                <div className="investment-date">
                  {formatDate(investment.date)}
                </div>
              </div>
              
              <div className="investment-card-body">
                <div className="investment-category">
                  <span className="category-label">Category:</span>
                  <span className="category-value">
                    {investment.title || 'N/A'}
                  </span>
                </div>
                
                {investment.description && (
                  <div className="investment-description">
                    <span className="description-label">Description:</span>
                    <span className="description-value">{investment.description}</span>
                  </div>
                )}
              </div>
              
              <div className="investment-card-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(investment.id)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(investment)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Add Button */}
      <button 
        className="floating-add-btn"
        onClick={() => navigate('/add-investment')}
        title="Add Investment"
      >
        +
      </button>

      {/* Delete Confirmation Dialog */}
      {deleteDialog.show && (
        <div className="delete-dialog-overlay">
          <div className="delete-dialog">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete this investment?
            </p>
            {deleteDialog.investment && (
              <div className="delete-investment-details">
                <p><strong>Amount:</strong> {formatAmount(deleteDialog.investment.amount)}</p>
                <p><strong>Category:</strong> {deleteDialog.investment.category || deleteDialog.investment.categoryName || 'N/A'}</p>
                <p><strong>Date:</strong> {formatDate(deleteDialog.investment.date)}</p>
              </div>
            )}
            <div className="delete-dialog-actions">
              <button 
                className="cancel-btn-inv"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-btn-inv"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investment;
