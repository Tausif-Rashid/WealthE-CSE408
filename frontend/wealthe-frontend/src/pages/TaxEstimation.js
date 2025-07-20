import React, { useState } from 'react';
import { getTaxEstimation } from '../utils/api';
import MessageDialog from '../components/MessageDialog';
import './TaxEstimation.css';

const TaxEstimation = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [formData, setFormData] = useState({
    bonusAmount: '',
    numberOfBonus: '',
    expectedNonRecurringIncome: '',
    makeMoreInvestment: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setResults(null);
      
      // Prepare data for API call - convert empty strings to 0
      const taxData = {
        bonusAmount: formData.bonusAmount ? parseFloat(formData.bonusAmount) : 0,
        numberOfBonus: formData.numberOfBonus ? parseInt(formData.numberOfBonus) : 0,
        expectedNonRecurringIncome: formData.expectedNonRecurringIncome ? parseFloat(formData.expectedNonRecurringIncome) : 0,
        makeMoreInvestment: formData.makeMoreInvestment ? parseFloat(formData.makeMoreInvestment) : 0
      };

      console.log('Tax estimation data to be sent:', taxData);
      
      // Make API call to get tax estimation
      const response = await getTaxEstimation(taxData);
      console.log('Tax estimation response:', response);
      
      setResults(response);
      
    } catch (err) {
      console.error('Error getting tax estimation:', err);
      showDialog('error', 'Error', 'Failed to get tax estimation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showDialog = (type, title, message) => {
    setDialogType(type);
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleReset = () => {
    setFormData({
      bonusAmount: '',
      numberOfBonus: '',
      expectedNonRecurringIncome: '',
      makeMoreInvestment: ''
    });
    setResults(null);
  };

  const formatAmount = (amount) => {
    if (!amount) return '৳0';
    return `৳${parseFloat(amount).toLocaleString()}`;
  };

  return (
    <div className="tax-estimation-container">
      <div className="tax-estimation-header">
        <h1>📊 Tax Estimation</h1>
        <p>Calculate your estimated tax based on your income and investment plans</p>
      </div>

      <div className="tax-estimation-content">
        <div className="tax-form-container">
          <form onSubmit={handleSubmit} className="tax-form">
            <div className="form-group">
              <label htmlFor="bonusAmount">Bonus Amount</label>
              <input
                type="number"
                id="bonusAmount"
                name="bonusAmount"
                value={formData.bonusAmount}
                onChange={handleInputChange}
                placeholder="Enter bonus amount"
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="numberOfBonus">Number of Bonus</label>
              <input
                type="number"
                id="numberOfBonus"
                name="numberOfBonus"
                value={formData.numberOfBonus}
                onChange={handleInputChange}
                placeholder="Enter number of bonus payments"
                min="0"
                step="1"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="expectedNonRecurringIncome">Expected Non-recurring Income</label>
              <input
                type="number"
                id="expectedNonRecurringIncome"
                name="expectedNonRecurringIncome"
                value={formData.expectedNonRecurringIncome}
                onChange={handleInputChange}
                placeholder="Enter expected non-recurring income"
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="makeMoreInvestment">Additional Investment Amount</label>
              <input
                type="number"
                id="makeMoreInvestment"
                name="makeMoreInvestment"
                value={formData.makeMoreInvestment}
                onChange={handleInputChange}
                placeholder="Enter additional investment amount"
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleReset} className="reset-btn">
                Reset
              </button>
              <button type="submit" disabled={loading} className="calculate-btn">
                {loading ? 'Calculating...' : 'Calculate Tax'}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {results && (
          <div className="results-container">
            <div className="results-header">
              <h2>💰 Tax Estimation Results</h2>
            </div>
            
            <div className="results-grid">
              <div className="result-card income-card">
                <div className="result-icon">💼</div>
                <div className="result-content">
                  <h3>Total Income</h3>
                  <p className="result-amount">{formatAmount(results.data.income)}</p>
                </div>
              </div>

              <div className="result-card investment-card">
                <div className="result-icon">📈</div>
                <div className="result-content">
                  <h3>Investment</h3>
                  <p className="result-amount">{formatAmount(results.data.investment)}</p>
                </div>
              </div>

              

              <div className="result-card calculated-tax-card">
                <div className="result-icon">🧮</div>
                <div className="result-content">
                  <h3>Calculated Tax</h3>
                  <p className="result-amount">{formatAmount(results.data.calculatedTax)}</p>
                </div>
              </div>

              <div className="result-card rebate-card">
                <div className="result-icon">🏷️</div>
                <div className="result-content">
                  <h3>Rebate</h3>
                  <p className="result-amount">{formatAmount(results.data.rebate)}</p>
                </div>
              </div>

              <div className="result-card min-tax-card">
                <div className="result-icon">🏠</div>
                <div className="result-content">
                  <h3>Minimum Tax for Zone</h3>
                  <p className="result-amount">{formatAmount(results.data.minimumTaxForZone)}</p>
                </div>
              </div>

              

              <div className="result-card estimated-tax-card">
                <div className="result-icon">🧮</div>
                <div className="result-content">
                  <h3>Estimated Tax</h3>
                  <p className="result-amount">{formatAmount(results.data.estimatedTax)}</p>
                </div>
              </div>
            </div>

            <div className="results-summary">
              <div className="summary-note">
                <span className="note-icon">ℹ️</span>
                <span>This is an estimated calculation based on the information provided. Actual tax may vary depending on other factors and current tax regulations.</span>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Calculating your tax estimation...</p>
            </div>
          </div>
        )}
      </div>

      {/* Message Dialog */}
      <MessageDialog
        isOpen={dialogOpen}
        type={dialogType}
        title={dialogTitle}
        message={dialogMessage}
        onClose={handleDialogClose}
      />
    </div>
  );
};

export default TaxEstimation;
