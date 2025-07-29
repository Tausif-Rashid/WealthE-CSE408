import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import MessageDialog from '../components/MessageDialog';
import './TaxForm.css';

const TaxForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');

  // Form data for each tab
  const [formData, setFormData] = useState({
    personalInfo: {
      taxpayerName: '',
      nidPassport: '',
      tin: '',
      circle: '',
      taxZone: '',
      assessmentYear: '',
      residentialStatus: 'resident',
      taxpayerStatus: 'individual',
      specialBenefits: {
        warWounded: false,
        female: false,
        thirdGender: false,
        disabled: false,
        aged65: false,
        parentOfDisabled: false
      },
      dateOfBirth: '',
      spouseName: '',
      spouseTin: '',
      address: '',
      telephone: '',
      mobile: '',
      email: ''
    },
    income: {
      salary: '',
      bonus: '',
      businessIncome: '',
      rentalIncome: '',
      otherIncome: ''
    },
    expense: {
      medicalExpense: '',
      educationExpense: '',
      insuranceExpense: '',
      otherExpense: ''
    },
    investment: {
      providentFund: '',
      lifeInsurance: '',
      mutualFund: '',
      otherInvestment: ''
    },
    assetLiability: {
      totalAssets: '',
      totalLiabilities: '',
      bankAccounts: '',
      properties: '',
      vehicles: ''
    },
    taxComputation: {
      totalIncome: '',
      totalDeduction: '',
      taxableIncome: '',
      taxRate: '',
      calculatedTax: ''
    }
  });

  const tabs = [
    { name: 'Personal Info', icon: '👤' },
    { name: 'Income', icon: '💰' },
    { name: 'Expense', icon: '💸' },
    { name: 'Investment', icon: '📈' },
    { name: 'Asset & Liability', icon: '🏦' },
    { name: 'Tax Computation', icon: '🧮' }
  ];

  const handleInputChange = (tabName, fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [tabName]: {
        ...prev[tabName],
        [fieldName]: value
      }
    }));
  };

  const handleSpecialBenefitChange = (benefitName, checked) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        specialBenefits: {
          ...prev.personalInfo.specialBenefits,
          [benefitName]: checked
        }
      }
    }));
  };

  const showDialog = (type, title, message) => {
    setDialogType(type);
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    if (dialogType === 'success' && activeTab === 5) {
      // If it's the final tab and success, navigate to dashboard
      navigate('/dashboard');
    }
  };

  const handleNext = async () => {
    const currentTabData = formData[Object.keys(formData)[activeTab]];
    const tabName = Object.keys(formData)[activeTab];
    
    try {
      setLoading(true);
      
      // Make API call to save current tab data
      const response = await fetch(`http://localhost:8081/user/tax-${tabName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(currentTabData)
      });

      if (response.ok) {
        // Move to next tab
        setActiveTab(prev => prev + 1);
        showDialog('success', 'Success', `${tabs[activeTab].name} data saved successfully!`);
      } else {
        const errorData = await response.json();
        showDialog('error', 'Error', errorData.message || 'Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      showDialog('error', 'Error', 'Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (activeTab > 0) {
      setActiveTab(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const currentTabData = formData[Object.keys(formData)[activeTab]];
    const tabName = Object.keys(formData)[activeTab];
    
    try {
      setLoading(true);
      
      // Make API call to save final tab data
      const response = await fetch(`http://localhost:8081/user/tax-${tabName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(currentTabData)
      });

      if (response.ok) {
        showDialog('success', 'Success', 'Tax form submitted successfully! Click OK to go to dashboard.');
      } else {
        const errorData = await response.json();
        showDialog('error', 'Error', errorData.message || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showDialog('error', 'Error', 'Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalInfoTab = () => (
    <div className="tax-form-tab-content">
      <h3>Personal Information</h3>
      <div className="tax-form-grid">
        {/* 1. Name of the Taxpayer */}
        <div className="tax-form-group full-width">
          <label htmlFor="taxpayerName">1. Name of the Taxpayer</label>
          <input
            type="text"
            id="taxpayerName"
            value={formData.personalInfo.taxpayerName}
            onChange={(e) => handleInputChange('personalInfo', 'taxpayerName', e.target.value)}
            placeholder="Enter taxpayer's full name"
          />
        </div>

        {/* 2. National ID No. / Passport No. */}
        <div className="tax-form-group">
          <label htmlFor="nidPassport">2. National ID No. / Passport No. (If No NID)</label>
          <input
            type="text"
            id="nidPassport"
            value={formData.personalInfo.nidPassport}
            onChange={(e) => handleInputChange('personalInfo', 'nidPassport', e.target.value)}
            placeholder="Enter NID or Passport number"
          />
        </div>

        {/* 3. TIN */}
        <div className="tax-form-group">
          <label htmlFor="tin">3. TIN</label>
          <input
            type="text"
            id="tin"
            value={formData.personalInfo.tin}
            onChange={(e) => handleInputChange('personalInfo', 'tin', e.target.value)}
            placeholder="Enter TIN"
          />
        </div>

        {/* 4. Circle and Tax Zone */}
        <div className="tax-form-group">
          <label htmlFor="circle">4(a). Circle</label>
          <input
            type="text"
            id="circle"
            value={formData.personalInfo.circle}
            onChange={(e) => handleInputChange('personalInfo', 'circle', e.target.value)}
            placeholder="Enter circle"
          />
        </div>

        <div className="tax-form-group">
          <label htmlFor="taxZone">4(b). Tax Zone</label>
          <input
            type="text"
            id="taxZone"
            value={formData.personalInfo.taxZone}
            onChange={(e) => handleInputChange('personalInfo', 'taxZone', e.target.value)}
            placeholder="Enter tax zone"
          />
        </div>

        {/* 5. Assessment Year */}
        <div className="tax-form-group">
          <label htmlFor="assessmentYear">5. Assessment Year</label>
          <input
            type="text"
            id="assessmentYear"
            value={formData.personalInfo.assessmentYear}
            onChange={(e) => handleInputChange('personalInfo', 'assessmentYear', e.target.value)}
            placeholder="e.g., 2024-2025"
          />
        </div>

        {/* 6. Residential Status */}
        <div className="tax-form-group">
          <label>6. Residential Status</label>
          <div className="tax-form-radio-group">
            <label className="tax-form-radio">
              <input
                type="radio"
                name="residentialStatus"
                value="resident"
                checked={formData.personalInfo.residentialStatus === 'resident'}
                onChange={(e) => handleInputChange('personalInfo', 'residentialStatus', e.target.value)}
              />
              <span>Resident</span>
            </label>
            <label className="tax-form-radio">
              <input
                type="radio"
                name="residentialStatus"
                value="non-resident"
                checked={formData.personalInfo.residentialStatus === 'non-resident'}
                onChange={(e) => handleInputChange('personalInfo', 'residentialStatus', e.target.value)}
              />
              <span>Non-resident</span>
            </label>
          </div>
        </div>

        {/* 7. Taxpayer's Status */}
        <div className="tax-form-group">
          <label>7. Taxpayer's Status</label>
          <div className="tax-form-radio-group">
            <label className="tax-form-radio">
              <input
                type="radio"
                name="taxpayerStatus"
                value="individual"
                checked={formData.personalInfo.taxpayerStatus === 'individual'}
                onChange={(e) => handleInputChange('personalInfo', 'taxpayerStatus', e.target.value)}
              />
              <span>Individual</span>
            </label>
            <label className="tax-form-radio">
              <input
                type="radio"
                name="taxpayerStatus"
                value="firm"
                checked={formData.personalInfo.taxpayerStatus === 'firm'}
                onChange={(e) => handleInputChange('personalInfo', 'taxpayerStatus', e.target.value)}
              />
              <span>Firm</span>
            </label>
            <label className="tax-form-radio">
              <input
                type="radio"
                name="taxpayerStatus"
                value="huf"
                checked={formData.personalInfo.taxpayerStatus === 'huf'}
                onChange={(e) => handleInputChange('personalInfo', 'taxpayerStatus', e.target.value)}
              />
              <span>Hindu Undivided Family</span>
            </label>
            <label className="tax-form-radio">
              <input
                type="radio"
                name="taxpayerStatus"
                value="others"
                checked={formData.personalInfo.taxpayerStatus === 'others'}
                onChange={(e) => handleInputChange('personalInfo', 'taxpayerStatus', e.target.value)}
              />
              <span>Others</span>
            </label>
          </div>
        </div>

        {/* 8. Special Benefits */}
        <div className="tax-form-group full-width">
          <label>8. Tick on the box for getting special benefit:</label>
          <div className="tax-form-checkbox-group">
            <label className="tax-form-checkbox">
              <input
                type="checkbox"
                checked={formData.personalInfo.specialBenefits.warWounded}
                onChange={(e) => handleSpecialBenefitChange('warWounded', e.target.checked)}
              />
              <span>A gazette war-wounded freedom fighter</span>
            </label>
            <label className="tax-form-checkbox">
              <input
                type="checkbox"
                checked={formData.personalInfo.specialBenefits.female}
                onChange={(e) => handleSpecialBenefitChange('female', e.target.checked)}
              />
              <span>Female</span>
            </label>
            <label className="tax-form-checkbox">
              <input
                type="checkbox"
                checked={formData.personalInfo.specialBenefits.thirdGender}
                onChange={(e) => handleSpecialBenefitChange('thirdGender', e.target.checked)}
              />
              <span>Third gender</span>
            </label>
            <label className="tax-form-checkbox">
              <input
                type="checkbox"
                checked={formData.personalInfo.specialBenefits.disabled}
                onChange={(e) => handleSpecialBenefitChange('disabled', e.target.checked)}
              />
              <span>Disable person</span>
            </label>
            <label className="tax-form-checkbox">
              <input
                type="checkbox"
                checked={formData.personalInfo.specialBenefits.aged65}
                onChange={(e) => handleSpecialBenefitChange('aged65', e.target.checked)}
              />
              <span>Aged 65 years or more</span>
            </label>
            <label className="tax-form-checkbox">
              <input
                type="checkbox"
                checked={formData.personalInfo.specialBenefits.parentOfDisabled}
                onChange={(e) => handleSpecialBenefitChange('parentOfDisabled', e.target.checked)}
              />
              <span>A parent of a person with disability</span>
            </label>
          </div>
        </div>

        {/* 9. Date of Birth */}
        <div className="tax-form-group">
          <label htmlFor="dateOfBirth">9. Date of Birth (DD MM YYYY)</label>
          <input
            type="date"
            id="dateOfBirth"
            value={formData.personalInfo.dateOfBirth}
            onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
          />
        </div>

        {/* 10. Spouse Information */}
        <div className="tax-form-group">
          <label htmlFor="spouseName">10. Wife/Husband's Name</label>
          <input
            type="text"
            id="spouseName"
            value={formData.personalInfo.spouseName}
            onChange={(e) => handleInputChange('personalInfo', 'spouseName', e.target.value)}
            placeholder="Enter spouse's name"
          />
        </div>

        <div className="tax-form-group">
          <label htmlFor="spouseTin">TIN (if spouse is a Taxpayer)</label>
          <input
            type="text"
            id="spouseTin"
            value={formData.personalInfo.spouseTin}
            onChange={(e) => handleInputChange('personalInfo', 'spouseTin', e.target.value)}
            placeholder="Enter spouse's TIN"
          />
        </div>

        {/* 11. Address and Contact Information */}
        <div className="tax-form-group full-width">
          <label htmlFor="address">11. Address</label>
          <textarea
            id="address"
            value={formData.personalInfo.address}
            onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
            placeholder="Enter your full address"
            rows="3"
          />
        </div>

        <div className="tax-form-group">
          <label htmlFor="telephone">Telephone</label>
          <input
            type="tel"
            id="telephone"
            value={formData.personalInfo.telephone}
            onChange={(e) => handleInputChange('personalInfo', 'telephone', e.target.value)}
            placeholder="Enter telephone number"
          />
        </div>

        <div className="tax-form-group">
          <label htmlFor="mobile">Mobile</label>
          <input
            type="tel"
            id="mobile"
            value={formData.personalInfo.mobile}
            onChange={(e) => handleInputChange('personalInfo', 'mobile', e.target.value)}
            placeholder="Enter mobile number"
          />
        </div>

        <div className="tax-form-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            value={formData.personalInfo.email}
            onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
            placeholder="Enter email address"
          />
        </div>
      </div>
    </div>
  );

  const renderIncomeTab = () => (
    <div className="tax-form-tab-content">
      <h3>Income Details</h3>
      <div className="tax-form-grid">
        <div className="tax-form-group">
          <label htmlFor="salary">Salary Income</label>
          <input
            type="number"
            id="salary"
            value={formData.income.salary}
            onChange={(e) => handleInputChange('income', 'salary', e.target.value)}
            placeholder="Enter salary amount"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="bonus">Bonus Income</label>
          <input
            type="number"
            id="bonus"
            value={formData.income.bonus}
            onChange={(e) => handleInputChange('income', 'bonus', e.target.value)}
            placeholder="Enter bonus amount"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="businessIncome">Business Income</label>
          <input
            type="number"
            id="businessIncome"
            value={formData.income.businessIncome}
            onChange={(e) => handleInputChange('income', 'businessIncome', e.target.value)}
            placeholder="Enter business income"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="rentalIncome">Rental Income</label>
          <input
            type="number"
            id="rentalIncome"
            value={formData.income.rentalIncome}
            onChange={(e) => handleInputChange('income', 'rentalIncome', e.target.value)}
            placeholder="Enter rental income"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="otherIncome">Other Income</label>
          <input
            type="number"
            id="otherIncome"
            value={formData.income.otherIncome}
            onChange={(e) => handleInputChange('income', 'otherIncome', e.target.value)}
            placeholder="Enter other income"
          />
        </div>
      </div>
    </div>
  );

  const renderExpenseTab = () => (
    <div className="tax-form-tab-content">
      <h3>Expense Details</h3>
      <div className="tax-form-grid">
        <div className="tax-form-group">
          <label htmlFor="medicalExpense">Medical Expenses</label>
          <input
            type="number"
            id="medicalExpense"
            value={formData.expense.medicalExpense}
            onChange={(e) => handleInputChange('expense', 'medicalExpense', e.target.value)}
            placeholder="Enter medical expenses"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="educationExpense">Education Expenses</label>
          <input
            type="number"
            id="educationExpense"
            value={formData.expense.educationExpense}
            onChange={(e) => handleInputChange('expense', 'educationExpense', e.target.value)}
            placeholder="Enter education expenses"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="insuranceExpense">Insurance Expenses</label>
          <input
            type="number"
            id="insuranceExpense"
            value={formData.expense.insuranceExpense}
            onChange={(e) => handleInputChange('expense', 'insuranceExpense', e.target.value)}
            placeholder="Enter insurance expenses"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="otherExpense">Other Expenses</label>
          <input
            type="number"
            id="otherExpense"
            value={formData.expense.otherExpense}
            onChange={(e) => handleInputChange('expense', 'otherExpense', e.target.value)}
            placeholder="Enter other expenses"
          />
        </div>
      </div>
    </div>
  );

  const renderInvestmentTab = () => (
    <div className="tax-form-tab-content">
      <h3>Investment Details</h3>
      <div className="tax-form-grid">
        <div className="tax-form-group">
          <label htmlFor="providentFund">Provident Fund</label>
          <input
            type="number"
            id="providentFund"
            value={formData.investment.providentFund}
            onChange={(e) => handleInputChange('investment', 'providentFund', e.target.value)}
            placeholder="Enter provident fund amount"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="lifeInsurance">Life Insurance</label>
          <input
            type="number"
            id="lifeInsurance"
            value={formData.investment.lifeInsurance}
            onChange={(e) => handleInputChange('investment', 'lifeInsurance', e.target.value)}
            placeholder="Enter life insurance amount"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="mutualFund">Mutual Fund</label>
          <input
            type="number"
            id="mutualFund"
            value={formData.investment.mutualFund}
            onChange={(e) => handleInputChange('investment', 'mutualFund', e.target.value)}
            placeholder="Enter mutual fund amount"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="otherInvestment">Other Investments</label>
          <input
            type="number"
            id="otherInvestment"
            value={formData.investment.otherInvestment}
            onChange={(e) => handleInputChange('investment', 'otherInvestment', e.target.value)}
            placeholder="Enter other investment amount"
          />
        </div>
      </div>
    </div>
  );

  const renderAssetLiabilityTab = () => (
    <div className="tax-form-tab-content">
      <h3>Asset & Liability Details</h3>
      <div className="tax-form-grid">
        <div className="tax-form-group">
          <label htmlFor="totalAssets">Total Assets</label>
          <input
            type="number"
            id="totalAssets"
            value={formData.assetLiability.totalAssets}
            onChange={(e) => handleInputChange('assetLiability', 'totalAssets', e.target.value)}
            placeholder="Enter total assets value"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="totalLiabilities">Total Liabilities</label>
          <input
            type="number"
            id="totalLiabilities"
            value={formData.assetLiability.totalLiabilities}
            onChange={(e) => handleInputChange('assetLiability', 'totalLiabilities', e.target.value)}
            placeholder="Enter total liabilities"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="bankAccounts">Bank Accounts</label>
          <input
            type="number"
            id="bankAccounts"
            value={formData.assetLiability.bankAccounts}
            onChange={(e) => handleInputChange('assetLiability', 'bankAccounts', e.target.value)}
            placeholder="Enter bank account balance"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="properties">Properties</label>
          <input
            type="number"
            id="properties"
            value={formData.assetLiability.properties}
            onChange={(e) => handleInputChange('assetLiability', 'properties', e.target.value)}
            placeholder="Enter properties value"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="vehicles">Vehicles</label>
          <input
            type="number"
            id="vehicles"
            value={formData.assetLiability.vehicles}
            onChange={(e) => handleInputChange('assetLiability', 'vehicles', e.target.value)}
            placeholder="Enter vehicles value"
          />
        </div>
      </div>
    </div>
  );

  const renderTaxComputationTab = () => (
    <div className="tax-form-tab-content">
      <h3>Tax Computation</h3>
      <div className="tax-form-grid">
        <div className="tax-form-group">
          <label htmlFor="totalIncome">Total Income</label>
          <input
            type="number"
            id="totalIncome"
            value={formData.taxComputation.totalIncome}
            onChange={(e) => handleInputChange('taxComputation', 'totalIncome', e.target.value)}
            placeholder="Enter total income"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="totalDeduction">Total Deduction</label>
          <input
            type="number"
            id="totalDeduction"
            value={formData.taxComputation.totalDeduction}
            onChange={(e) => handleInputChange('taxComputation', 'totalDeduction', e.target.value)}
            placeholder="Enter total deduction"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="taxableIncome">Taxable Income</label>
          <input
            type="number"
            id="taxableIncome"
            value={formData.taxComputation.taxableIncome}
            onChange={(e) => handleInputChange('taxComputation', 'taxableIncome', e.target.value)}
            placeholder="Enter taxable income"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="taxRate">Tax Rate (%)</label>
          <input
            type="number"
            id="taxRate"
            value={formData.taxComputation.taxRate}
            onChange={(e) => handleInputChange('taxComputation', 'taxRate', e.target.value)}
            placeholder="Enter tax rate"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="calculatedTax">Calculated Tax</label>
          <input
            type="number"
            id="calculatedTax"
            value={formData.taxComputation.calculatedTax}
            onChange={(e) => handleInputChange('taxComputation', 'calculatedTax', e.target.value)}
            placeholder="Enter calculated tax"
          />
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return renderPersonalInfoTab();
      case 1:
        return renderIncomeTab();
      case 2:
        return renderExpenseTab();
      case 3:
        return renderInvestmentTab();
      case 4:
        return renderAssetLiabilityTab();
      case 5:
        return renderTaxComputationTab();
      default:
        return null;
    }
  };

  return (
    <div className="tax-form-container">
      <div className="tax-form-header">
        <h1>📋 Tax Form</h1>
        <p>Complete your tax information step by step</p>
      </div>

      <div className="tax-form-content">
        <div className="tax-form-tabs-header">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`tax-form-tab-button ${activeTab === index ? 'active' : ''} ${index < activeTab ? 'completed' : ''}`}
                onClick={() => setActiveTab(index)}
                disabled={loading}
              >
                <span className="tax-form-tab-icon">{tab.icon}</span>
                <span className="tax-form-tab-label">{tab.name}</span>
                {index < activeTab && <span className="tax-form-checkmark">✓</span>}
              </button>
            ))}
        </div>
        <div className="tax-form-tabs-container">
          

          <div className="tax-form-tab-panel">
            {renderTabContent()}
          </div>

          <div className="tax-form-actions">
            <div className="tax-form-left-actions">
              {activeTab > 0 && (
                <button
                  type="button"
                  className="tax-form-back-btn"
                  onClick={handleBack}
                  disabled={loading}
                >
                  ← Back
                </button>
              )}
            </div>
            <div className="tax-form-right-actions">
              {activeTab < 5 ? (
                <button
                  type="button"
                  className="tax-form-next-btn"
                  onClick={handleNext}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Next'}
                </button>
              ) : (
                <button
                  type="button"
                  className="tax-form-submit-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <MessageDialog
        open={dialogOpen}
        type={dialogType}
        title={dialogTitle}
        message={dialogMessage}
        onClose={handleDialogClose}
      />
    </div>
  );
};

export default TaxForm; 