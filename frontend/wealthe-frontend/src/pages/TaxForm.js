import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import MessageDialog from '../components/MessageDialog';
import {createTaxForm, getUserInfo, getTaxInfo, getTaxIncome, updateTaxFormIncome,getTaxExpense,getTaxInvestment,getTaxAsset,getTaxLiability, updateTaxFormExpense,updateTaxFormInvestment,updateTaxFormAssetLiability,submitTaxForm,getTaxAmount} from '../utils/api';
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
      bankAccountTotal: '',
      carTotal: '',
      flatTotal: '',
      jewelryTotal: '',
      plotTotal: '',
      bankLoan: '',
      personLoan: ''
    },
    taxComputation: {
      grossTax: '',
      minTax: '',
      rebateAmount: '',
      payableTax: '',
      netTax: ''
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

  // Prevent number input increment/decrement on arrow keys
  const handleNumberInputKeyDown = (e) => {
    // Prevent increment/decrement on arrow up/down
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }
  };

  // Prevent wheel scroll from changing number values
  const handleNumberInputWheel = (e) => {
    e.target.blur();
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
    if (dialogType === 'success' && activeTab === 6) {
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
        showDialog('error', 'Error', 'Failed to load income data. Please try again.');
        return;
      }
    }

    // Map tab index to form data key
    const tabMapping = ['personalInfo', 'income', 'expense', 'investment', 'assetLiability', 'taxComputation'];
    const tabName = tabMapping[activeTab];
    const currentTabData = formData[tabName];
    
    console.log('Tab name:', tabName, 'Current tab data:', currentTabData);
    
    try {
      setLoading(true);

      console.log(`Handling next for tab: ${tabName}`);
      
      // Make API call to save current tab data and fetch next tab data
      let saveResponse;
      let isSuccess = false;
      
      if (tabName === 'income') {
        console.log('Updating income data:', currentTabData);
        saveResponse = await updateTaxFormIncome(currentTabData);
        
        if (saveResponse && saveResponse.success) {
          isSuccess = true;
          // Fetch expense data for next tab
          try {
            const expenses = await getTaxExpense();
            console.log('Expense data:', expenses);
            
            if (expenses && typeof expenses === 'object') {
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
          } catch (fetchError) {
            console.error('Error fetching expense data:', fetchError);
            showDialog('warning', 'Warning', 'Data saved but failed to load next section data. You can continue filling the form.');
          }
        }
      } else if (tabName === 'expense') {
        console.log('Updating expense data:', currentTabData);
        saveResponse = await updateTaxFormExpense(currentTabData);
        
        if (saveResponse && saveResponse.success) {
          isSuccess = true;
          // Fetch investment data for next tab
          try {
            const investments = await getTaxInvestment();
            console.log('Investment data:', investments);
            
            if (investments && typeof investments === 'object') {
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
          } catch (fetchError) {
            console.error('Error fetching investment data:', fetchError);
            showDialog('warning', 'Warning', 'Data saved but failed to load next section data. You can continue filling the form.');
          }
        }
      } else if (tabName === 'investment') {
        console.log('Updating investment data:', currentTabData);
        saveResponse = await updateTaxFormInvestment(currentTabData);
        
        if (saveResponse && saveResponse.success) {
          isSuccess = true;
          // Fetch asset and liability data for next tab
          try {
            const [assets, liabilities] = await Promise.all([
              getTaxAsset(),
              getTaxLiability()
            ]);
            
            console.log('Asset data:', assets);
            console.log('Liability data:', liabilities);
            
            setFormData(prev => ({
              ...prev,
              assetLiability: {
                ...prev.assetLiability,
                // Asset data
                bankAccountTotal: assets?.bankAccount?.toString() || '',
                carTotal: assets?.car?.toString() || '',
                flatTotal: assets?.flat?.toString() || '',
                jewelryTotal: assets?.jewellery?.toString() || '',
                plotTotal: assets?.plot?.toString() || '',
                // Liability data
                bankLoan: liabilities?.bankLoan?.toString() || '',
                personLoan: liabilities?.personLoan?.toString() || ''
              }
            }));
          } catch (fetchError) {
            console.error('Error fetching asset/liability data:', fetchError);
            showDialog('warning', 'Warning', 'Data saved but failed to load next section data. You can continue filling the form.');
          }
        }
      } else if (tabName === 'assetLiability') {
        console.log('Updating asset liability data:', currentTabData);
        saveResponse = await updateTaxFormAssetLiability(currentTabData);
        
        if (saveResponse && saveResponse.success) {
          isSuccess = true;
          // Fetch tax computation data for final tab
          try {
            const taxAmount = await getTaxAmount();
            console.log('Tax amount data:', taxAmount);
            
            if (taxAmount && typeof taxAmount === 'object') {
              const tax = taxAmount;
              setFormData(prev => ({
                ...prev,
                taxComputation: {
                  ...prev.taxComputation,
                  grossTax: tax.gross_tax?.toString() || '',
                  minTax: tax.min_tax?.toString() || '',
                  rebateAmount: tax.rebate_amount?.toString() || '',
                  payableTax: tax.payable_tax?.toString() || '',
                  netTax: tax.net_tax?.toString() || ''
                }
              }));
            }
          } catch (fetchError) {
            console.error('Error fetching tax computation data:', fetchError);
            showDialog('warning', 'Warning', 'Data saved but failed to load tax computation. You can continue to submit the form.');
          }
        }
      } else if(tabName === 'personalInfo') {
        saveResponse = await createTaxForm();

        if (saveResponse && saveResponse.success) {
          isSuccess = true;
          
        }
      }
      else {
        // Fallback for other tabs (if any)
        console.log("in fallback API call");
        try {
          const API_BASE_URL ='http://localhost:8081';
          const response = await fetch(`${API_BASE_URL}/user/tax-${tabName}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(currentTabData)
          });
          
          if (response.ok) {
            isSuccess = true;
          } else {
            const errorData = await response.json();
            showDialog('error', 'Error', errorData.message || 'Failed to save data');
          }
        } catch (apiError) {
          console.error('Error with fallback API:', apiError);
          showDialog('error', 'Error', 'Failed to save data. Please check your connection and try again.');
        }
      }

      // Handle the result
      if (isSuccess) {
        setActiveTab(prev => prev + 1);
        showDialog('success', 'Success', `${tabs[activeTab].name} data saved successfully!`);
      } else {
        const errorMessage = saveResponse?.message || 'Failed to save data. Please try again.';
        showDialog('error', 'Error', errorMessage);
      }
      
    } catch (error) {
      console.error('Error in handleNext:', error);
      showDialog('error', 'Error', 'An unexpected error occurred. Please check your connection and try again.');
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
    try {
      setLoading(true);
      console.log('Submitting tax form...');
      
      const response = await submitTaxForm();
      console.log('Submit tax form response:', response);
      
      if (response && response.success) {
        setActiveTab(prev => prev + 1);
        showDialog('success', 'Success', 'Tax form submitted successfully! Click OK to go to dashboard.');
      } else {
        const errorMessage = response?.message || 'Failed to submit form. Please try again.';
        showDialog('error', 'Error', errorMessage);
      }
      
    } catch (error) {
      console.error('Error submitting form:', error);
      showDialog('error', 'Error', 'Failed to submit form. Please check your connection and try again.');
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
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
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
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
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
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
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
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
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
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
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
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
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
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
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
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
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
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
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
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
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
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
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
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
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
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
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
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
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
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
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
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
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
        {/* Assets Section */}
        <div className="tax-form-group">
          <label htmlFor="bankAccountTotal">Bank Account Total</label>
          <input
            type="number"
            id="bankAccountTotal"
            value={formData.assetLiability.bankAccountTotal}
            onChange={(e) => handleInputChange('assetLiability', 'bankAccountTotal', e.target.value)}
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
            placeholder="Enter bank account total"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="carTotal">Car Total</label>
          <input
            type="number"
            id="carTotal"
            value={formData.assetLiability.carTotal}
            onChange={(e) => handleInputChange('assetLiability', 'carTotal', e.target.value)}
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
            placeholder="Enter car total value"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="flatTotal">Flat Total</label>
          <input
            type="number"
            id="flatTotal"
            value={formData.assetLiability.flatTotal}
            onChange={(e) => handleInputChange('assetLiability', 'flatTotal', e.target.value)}
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
            placeholder="Enter flat total value"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="jewelryTotal">Jewelry Total</label>
          <input
            type="number"
            id="jewelryTotal"
            value={formData.assetLiability.jewelryTotal}
            onChange={(e) => handleInputChange('assetLiability', 'jewelryTotal', e.target.value)}
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
            placeholder="Enter jewelry total value"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="plotTotal">Plot Total</label>
          <input
            type="number"
            id="plotTotal"
            value={formData.assetLiability.plotTotal}
            onChange={(e) => handleInputChange('assetLiability', 'plotTotal', e.target.value)}
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
            placeholder="Enter plot total value"
          />
        </div>
        {/* Liabilities Section */}
        <div className="tax-form-group">
          <label htmlFor="bankLoan">Bank Loan</label>
          <input
            type="number"
            id="bankLoan"
            value={formData.assetLiability.bankLoan}
            onChange={(e) => handleInputChange('assetLiability', 'bankLoan', e.target.value)}
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
            placeholder="Enter bank loan amount"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="personLoan">Person Loan</label>
          <input
            type="number"
            id="personLoan"
            value={formData.assetLiability.personLoan}
            onChange={(e) => handleInputChange('assetLiability', 'personLoan', e.target.value)}
            onKeyDown={handleNumberInputKeyDown}
            onWheel={handleNumberInputWheel}
            placeholder="Enter person loan amount"
          />
        </div>
      </div>
    </div>
  );

  const renderTaxComputationTab = () => (
    <div className="tax-form-tab-content">
      <h3>Tax Computation Results</h3>
      
      {/* Tax Breakdown */}
      <div className="tax-form-grid">
        <div className="tax-form-group">
          <label htmlFor="grossTax">Gross Tax</label>
          <input
            type="number"
            id="grossTax"
            value={formData.taxComputation.grossTax}
            readOnly
            className="readonly-field"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="rebateAmount">Rebate Amount</label>
          <input
            type="number"
            id="rebateAmount"
            value={formData.taxComputation.rebateAmount}
            readOnly
            className="readonly-field"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="netTax">Net Tax</label>
          <input
            type="number"
            id="netTax"
            value={formData.taxComputation.netTax}
            readOnly
            className="readonly-field"
          />
        </div>
        <div className="tax-form-group">
          <label htmlFor="minTax">Minimum Tax</label>
          <input
            type="number"
            id="minTax"
            value={formData.taxComputation.minTax}
            readOnly
            className="readonly-field"
          />
        </div>
      </div>

      {/* Final Result - Payable Tax */}
      <div className="tax-form-final-result">
        <div className="tax-form-group full-width">
          <label htmlFor="payableTax" className="final-result-label">Final Tax Amount (Payable Tax)</label>
          <input
            type="number"
            id="payableTax"
            value={formData.taxComputation.payableTax}
            readOnly
            className="readonly-field final-result-field"
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