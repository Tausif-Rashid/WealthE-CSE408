import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import MessageDialog from '../components/MessageDialog';
import { getUserInfo, getTaxInfo, getTaxIncome, updateTaxFormIncome,getTaxExpense,getTaxInvestment,getTaxAsset, updateTaxFormExpense,updateTaxFormInvestment,updateTaxFormAsset  } from '../utils/api';
import './TaxForm.css';

const TaxForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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
      agriculture: '',
      rent: '',
      interest: '',
      others: ''
    },
    expense: {
      personal: '',
      housing: '',
      utility: '',
      education: '',
      transport: '',
      others: ''
    },
    investment: {
      three_month_sanchaypatra: '',
      five_years_sanchaypatra: '',
      Zakat: '',
      FDR: '',
      family_sanchaypatra: ''
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

  // Fetch user info and tax info when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      setInitialLoading(true);
      try {
        // Fetch both user info and tax info
        const [userData, taxData] = await Promise.all([
          getUserInfo(),
          getTaxInfo()          
        ]);

        console.log('User data:', userData);
        console.log('Tax data:', taxData);
        

        if (userData && userData.length > 0) {
          const user = userData[0];
          const tax = taxData && taxData.length > 0 ? taxData[0] : null;

          // Populate form with user data and tax data
          setFormData(prev => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              // From user data
              taxpayerName: user.name || '',
              nidPassport: user.nid || '',
              dateOfBirth: user.dob || '',
              spouseName: user.spouse_name || '',
              spouseTin: user.spouse_tin || '',
              mobile: user.phone || '',
              // From tax data
              email: tax?.email || '',
              tin: tax?.tin || '',
              circle: tax?.tax_circle?.toString() || '',
              taxZone: tax?.tax_zone?.toString() || '',
              address: tax?.area_name || '',
              assessmentYear: `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`,
              residentialStatus: tax?.is_resident ? 'resident' : 'non-resident',
              specialBenefits: {
                warWounded: tax?.is_ff || false,
                female: tax?.is_female || false,
                thirdGender: false, // Not in API response
                disabled: tax?.is_disabled || false,
                aged65: false, // Not in API response
                parentOfDisabled: false // Not in API response
              }
            }
          }));


        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        showDialog('error', 'Error', 'Failed to load user information. Please try again.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserData();
  }, []);



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

  const validatePersonalInfo = () => {
    const personalInfo = formData.personalInfo;
    console.log('Validating personal info:', personalInfo);
    
    const requiredFields = [
      { field: 'taxpayerName', label: 'Name of the Taxpayer' },
      { field: 'nidPassport', label: 'National ID No. / Passport No.' },
      { field: 'tin', label: 'TIN' },
      { field: 'circle', label: 'Circle' },
      { field: 'taxZone', label: 'Tax Zone' },
      { field: 'assessmentYear', label: 'Assessment Year' },
      { field: 'dateOfBirth', label: 'Date of Birth' },
      { field: 'address', label: 'Address' },
      { field: 'mobile', label: 'Mobile' },
      { field: 'email', label: 'Email' }
    ];

    const emptyFields = requiredFields.filter(({ field }) => {
      const value = personalInfo[field];
      const isEmpty = !value || value.toString().trim() === '';
      console.log(`Field ${field}: "${value}" - isEmpty: ${isEmpty}`);
      return isEmpty;
    });

    console.log('Empty fields:', emptyFields);

    if (emptyFields.length > 0) {
      const fieldLabels = emptyFields.map(({ label }) => label).join(', ');
      showDialog('warning', 'Missing Information', 
        `Please update the following fields in your user profile: ${fieldLabels}. You can update this information in your profile settings.`);
      return false;
    }

    return true;
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
    console.log('handleNext called, activeTab:', activeTab);
    
    // Validate personal info tab
    if (activeTab === 0) {
      console.log('Validating personal info tab...');
      if (!validatePersonalInfo()) {
        console.log('Validation failed, returning early');
        return;
      }
      console.log('Validation passed');
      
      // Fetch income data when moving from personal info tab
      try {
        const incomes = await getTaxIncome();
        console.log('Income data:', incomes);
        
        if (incomes) {
          const income = incomes;
          setFormData(prev => ({
            ...prev,
            income: {
              ...prev.income,
              salary: income.salary?.toString() || '',
              agriculture: income.agriculture?.toString() || '',
              rent: income.rent?.toString() || '',
              interest: income.interest?.toString() || '',
              others: income.other?.toString() || '' // Note: API returns 'other' but form uses 'others'
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching income data:', error);
      }
    }else if(activeTab === 1){
      console.log('Expense data getting:');

      
    }else if(activeTab === 2){
     
    }

    // Map tab index to form data key
    const tabMapping = ['personalInfo', 'income', 'expense', 'investment', 'assetLiability', 'taxComputation'];
    const tabName = tabMapping[activeTab];
    const currentTabData = formData[tabName];
    
    console.log('Tab name:', tabName, 'Current tab data:', currentTabData);
    
    try {
      setLoading(true);
      
      // Make API call to save current tab data
      let response;
      if (tabName === 'income') {
        console.log('Updating income data:', currentTabData);
        response = await updateTaxFormIncome(currentTabData);

        const expenses = await getTaxExpense();
      
        if(expenses){
          const expense = expenses;
          setFormData(prev => ({
            ...prev,
            expense: {
              ...prev.expense,
              personal: expense.personal?.toString() || '',
              housing: expense.housing?.toString() || '',
              utility: expense.utility?.toString() || '',
              education: expense.education?.toString() || '',
              transport: expense.transportation?.toString() || '',
              others: expense.others?.toString() || ''
            }
          }));
        }
              } else if (tabName === 'expense') {
          console.log('Updating expense data:', currentTabData);
          response = await updateTaxFormExpense(currentTabData);

          const investments = await getTaxInvestment();
          console.log('Investment data:', investments);
                 if(investments){
             const investment = investments;
             setFormData(prev => ({
               ...prev,
               investment: {
                 ...prev.investment,
                 three_month_sanchaypatra: investment.threemonthshanchaypatra?.toString() || '',
                 five_years_sanchaypatra: investment.fiveyearsshanchaypatra?.toString() || '',
                 Zakat: investment.zakat?.toString() || '',
                 FDR: investment.fdr?.toString() || '',
                 family_sanchaypatra: investment.familyshanchaypatra?.toString() || ''
               }
             }));
           }
        } else if (tabName === 'investment') {
          console.log('Updating investment data:', currentTabData);
          response = await updateTaxFormInvestment(currentTabData);
        } else {
        response = await fetch(`http://localhost:8081/user/tax-${tabName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(currentTabData)
        });
      }

      if (tabName === 'income' || tabName === 'expense' || tabName === 'investment') {
        // For income, expense, and investment APIs, check the success property in JSON response
        if (response.success) {
          // Move to next tab
          setActiveTab(prev => prev + 1);
          showDialog('success', 'Success', `${tabs[activeTab].name} data saved successfully!`);
        } else {
          showDialog('error', 'Error', response.message || 'Failed to save data');
        }
      } else {
        // For other APIs, check HTTP status
        if (response.ok) {
          // Move to next tab
          setActiveTab(prev => prev + 1);
          showDialog('success', 'Success', `${tabs[activeTab].name} data saved successfully!`);
        } else {
          const errorData = await response.json();
          showDialog('error', 'Error', errorData.message || 'Failed to save data');
        }
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
    // Map tab index to form data key
    const tabMapping = ['personalInfo', 'income', 'expense', 'investment', 'assetLiability', 'taxComputation'];
    const tabName = tabMapping[activeTab];
    const currentTabData = formData[tabName];
    
    try {
      setLoading(true);
      
      // Make API call to save final tab data
      let response;
      if (tabName === 'income') {
        response = await updateTaxFormIncome(currentTabData);
              } else if (tabName === 'expense') {
          response = await updateTaxFormExpense(currentTabData);
        } else if (tabName === 'investment') {
          response = await updateTaxFormInvestment(currentTabData);
        } else {
        response = await fetch(`http://localhost:8081/user/tax-${tabName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(currentTabData)
        });
      }

      if (tabName === 'income' || tabName === 'expense' || tabName === 'investment') {
        // For income, expense, and investment APIs, check the success property in JSON response
        if (response.success) {
          showDialog('success', 'Success', 'Tax form submitted successfully! Click OK to go to dashboard.');
        } else {
          showDialog('error', 'Error', response.message || 'Failed to submit form');
        }
      } else {
        // For other APIs, check HTTP status
        if (response.ok) {
          showDialog('success', 'Success', 'Tax form submitted successfully! Click OK to go to dashboard.');
        } else {
          const errorData = await response.json();
          showDialog('error', 'Error', errorData.message || 'Failed to submit form');
        }
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
            readOnly
            className="readonly-field"
          />
        </div>

        {/* 2. National ID No. / Passport No. */}
        <div className="tax-form-group">
          <label htmlFor="nidPassport">2. National ID No. / Passport No. (If No NID)</label>
          <input
            type="text"
            id="nidPassport"
            value={formData.personalInfo.nidPassport}
            readOnly
            className="readonly-field"
          />
        </div>

        {/* 3. TIN */}
        <div className="tax-form-group">
          <label htmlFor="tin">3. TIN</label>
          <input
            type="text"
            id="tin"
            value={formData.personalInfo.tin}
            readOnly
            className="readonly-field"
          />
        </div>

        {/* 4. Circle and Tax Zone */}
        <div className="tax-form-group">
          <label htmlFor="circle">4(a). Circle</label>
          <input
            type="text"
            id="circle"
            value={formData.personalInfo.circle}
            readOnly
            className="readonly-field"
          />
        </div>

        <div className="tax-form-group">
          <label htmlFor="taxZone">4(b). Tax Zone</label>
          <input
            type="text"
            id="taxZone"
            value={formData.personalInfo.taxZone}
            readOnly
            className="readonly-field"
          />
        </div>

        {/* 5. Assessment Year */}
        <div className="tax-form-group">
          <label htmlFor="assessmentYear">5. Assessment Year</label>
          <input
            type="text"
            id="assessmentYear"
            value={formData.personalInfo.assessmentYear}
            readOnly
            className="readonly-field"
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
                disabled
              />
              <span>Resident</span>
            </label>
            <label className="tax-form-radio">
              <input
                type="radio"
                name="residentialStatus"
                value="non-resident"
                checked={formData.personalInfo.residentialStatus === 'non-resident'}
                disabled
              />
              <span>Non-resident</span>
            </label>
          </div>
        </div>

        

        {/* 7. Special Benefits */}
        <div className="tax-form-group full-width">
          <label>7. Tick on the box for getting special benefit:</label>
          <div className="tax-form-checkbox-group">
            <label className="tax-form-checkbox">
              <input
                type="checkbox"
                checked={formData.personalInfo.specialBenefits.warWounded}
                disabled
              />
              <span>A gazette war-wounded freedom fighter</span>
            </label>
            <label className="tax-form-checkbox">
              <input
                type="checkbox"
                checked={formData.personalInfo.specialBenefits.female}
                disabled
              />
              <span>Female</span>
            </label>
            <label className="tax-form-checkbox">
              <input
                type="checkbox"
                checked={formData.personalInfo.specialBenefits.disabled}
                disabled
              />
              <span>Disable person</span>
            </label>
          </div>
        </div>

        {/* 8. Date of Birth */}
        <div className="tax-form-group">
          <label htmlFor="dateOfBirth">8. Date of Birth (DD MM YYYY)</label>
          <input
            type="date"
            id="dateOfBirth"
            value={formData.personalInfo.dateOfBirth}
            readOnly
            className="readonly-field"
          />
        </div>

        {/* 9. Spouse Information */}
        <div className="tax-form-group">
          <label htmlFor="spouseName">9. Wife/Husband's Name</label>
          <input
            type="text"
            id="spouseName"
            value={formData.personalInfo.spouseName}
            readOnly
            className="readonly-field"
          />
        </div>

        <div className="tax-form-group">
          <label htmlFor="spouseTin">TIN (if spouse is a Taxpayer)</label>
          <input
            type="text"
            id="spouseTin"
            value={formData.personalInfo.spouseTin}
            readOnly
            className="readonly-field"
          />
        </div>

        {/* 10. Address and Contact Information */}
        <div className="tax-form-group full-width">
          <label htmlFor="address">10. Address</label>
          <textarea
            id="address"
            value={formData.personalInfo.address}
            readOnly
            className="readonly-field"
            rows="3"
          />
        </div>

        <div className="tax-form-group">
          <label htmlFor="mobile">Mobile</label>
          <input
            type="tel"
            id="mobile"
            value={formData.personalInfo.mobile}
            readOnly
            className="readonly-field"
          />
        </div>

        <div className="tax-form-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            value={formData.personalInfo.email}
            readOnly
            className="readonly-field"
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
          <label htmlFor="salary">Salary</label>
          <input
            type="number"
            id="salary"
            value={formData.income.salary}
            onChange={(e) => handleInputChange('income', 'salary', e.target.value)}
            placeholder="Enter salary amount"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="agriculture">Agriculture</label>
          <input
            type="number"
            id="agriculture"
            value={formData.income.agriculture}
            onChange={(e) => handleInputChange('income', 'agriculture', e.target.value)}
            placeholder="Enter agriculture income"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="rent">Rent</label>
          <input
            type="number"
            id="rent"
            value={formData.income.rent}
            onChange={(e) => handleInputChange('income', 'rent', e.target.value)}
            placeholder="Enter rental income"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="interest">Interest</label>
          <input
            type="number"
            id="interest"
            value={formData.income.interest}
            onChange={(e) => handleInputChange('income', 'interest', e.target.value)}
            placeholder="Enter interest income"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="others">Others</label>
          <input
            type="number"
            id="others"
            value={formData.income.others}
            onChange={(e) => handleInputChange('income', 'others', e.target.value)}
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
          <label htmlFor="personal">Personal</label>
          <input
            type="number"
            id="personal"
            value={formData.expense.personal}
            onChange={(e) => handleInputChange('expense', 'personal', e.target.value)}
            placeholder="Enter personal expenses"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="housing">Housing</label>
          <input
            type="number"
            id="housing"
            value={formData.expense.housing}
            onChange={(e) => handleInputChange('expense', 'housing', e.target.value)}
            placeholder="Enter housing expenses"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="utility">Utility</label>
          <input
            type="number"
            id="utility"
            value={formData.expense.utility}
            onChange={(e) => handleInputChange('expense', 'utility', e.target.value)}
            placeholder="Enter utility expenses"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="education">Education</label>
          <input
            type="number"
            id="education"
            value={formData.expense.education}
            onChange={(e) => handleInputChange('expense', 'education', e.target.value)}
            placeholder="Enter education expenses"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="transport">Transport</label>
          <input
            type="number"
            id="transport"
            value={formData.expense.transport}
            onChange={(e) => handleInputChange('expense', 'transport', e.target.value)}
            placeholder="Enter transport expenses"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="others">Others</label>
          <input
            type="number"
            id="others"
            value={formData.expense.others}
            onChange={(e) => handleInputChange('expense', 'others', e.target.value)}
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
          <label htmlFor="three_month_sanchaypatra">Three Month Sanchaypatra</label>
          <input
            type="number"
            id="three_month_sanchaypatra"
            value={formData.investment.three_month_sanchaypatra}
            onChange={(e) => handleInputChange('investment', 'three_month_sanchaypatra', e.target.value)}
            placeholder="Enter three month sanchaypatra amount"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="five_years_sanchaypatra">Five Years Sanchaypatra</label>
          <input
            type="number"
            id="five_years_sanchaypatra"
            value={formData.investment.five_years_sanchaypatra}
            onChange={(e) => handleInputChange('investment', 'five_years_sanchaypatra', e.target.value)}
            placeholder="Enter five years sanchaypatra amount"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="Zakat">Zakat</label>
          <input
            type="number"
            id="Zakat"
            value={formData.investment.Zakat}
            onChange={(e) => handleInputChange('investment', 'Zakat', e.target.value)}
            placeholder="Enter zakat amount"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="FDR">FDR</label>
          <input
            type="number"
            id="FDR"
            value={formData.investment.FDR}
            onChange={(e) => handleInputChange('investment', 'FDR', e.target.value)}
            placeholder="Enter FDR amount"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="family_sanchaypatra">Family Sanchaypatra</label>
          <input
            type="number"
            id="family_sanchaypatra"
            value={formData.investment.family_sanchaypatra}
            onChange={(e) => handleInputChange('investment', 'family_sanchaypatra', e.target.value)}
            placeholder="Enter family sanchaypatra amount"
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

  // Show loading state while fetching initial data
  if (initialLoading) {
    return (
      <div className="tax-form-container">
        <div className="tax-form-header">
          <h1>📋 Tax Form</h1>
          <p>Loading your information...</p>
        </div>
        <div className="tax-form-content">
          <div className="tax-form-loading">
            <div className="tax-form-spinner"></div>
            <p>Loading your personal information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tax-form-container">
      <div className="tax-form-header">
        <h1>📋 Tax Form</h1>
        <p>Complete your tax information step by step</p>
      </div>

      <div className="tax-form-content">
        <div className="tax-form-tabs-container">
          <div className="tax-form-tabs-header">
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={`tax-form-tab-button ${activeTab === index ? 'active' : ''} ${index < activeTab ? 'completed' : ''}`}
              >
                <span className="tax-form-tab-icon">{tab.icon}</span>
                <span className="tax-form-tab-label">{tab.name}</span>
                {index < activeTab && <span className="tax-form-checkmark">✓</span>}
              </div>
            ))}
          </div>

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
        isOpen={dialogOpen}
        type={dialogType}
        title={dialogTitle}
        message={dialogMessage}
        onClose={handleDialogClose}
      />
    </div>
  );
};

export default TaxForm; 