package com.cselab.wealthe.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;

@Service
public class FetchPdfDataService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Tax Form Data Model
    public static class TaxFormData {
        // Basic info
        private Integer id;
        private Integer userId;
        private LocalDate date;
        private Boolean doneSubmit;

        // Income fields
        private Double incomeSalary;
        private Double incomeAgriculture;
        private Double incomeRent;
        private Double incomeInterest;
        private Double incomeOthers;
        private Boolean doneIncome;

        // Expense fields
        private Double expensePersonal;
        private Double expenseHousing;
        private Double expenseUtility;
        private Double expenseEducation;
        private Double expenseTransport;
        private Double expenseOthers;
        private Boolean doneExpense;

        // Investment fields
        private Double investment3MonthShanchaypatra;
        private Double investment5YearsShanchaypatra;
        private Double investmentFdr;
        private Double investmentZakat;
        private Double investmentFamilyShanchaypatra;
        private Boolean doneInvestment;

        // Asset fields
        private Double assetBankAccount;
        private Double assetCar;
        private Double assetFlat;
        private Double assetJewelery;
        private Double assetPlot;

        // Liability fields
        private Double liabilityBankLoan;
        private Double liabilityPersonLoan;
        private Boolean doneAssetLiability;

        // Tax calculation fields
        private Double taxCompGrossTax;
        private Double taxCompRebate;
        private Double taxCompNetTax;
        private Double taxCompMinTax;
        private Double taxCompPayable;

        // Constructors
        public TaxFormData() {}

        // Getters and Setters
        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }

        public Integer getUserId() { return userId; }
        public void setUserId(Integer userId) { this.userId = userId; }

        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }

        public Boolean getDoneSubmit() { return doneSubmit; }
        public void setDoneSubmit(Boolean doneSubmit) { this.doneSubmit = doneSubmit; }

        public Double getIncomeSalary() { return incomeSalary; }
        public void setIncomeSalary(Double incomeSalary) { this.incomeSalary = incomeSalary; }

        public Double getIncomeAgriculture() { return incomeAgriculture; }
        public void setIncomeAgriculture(Double incomeAgriculture) { this.incomeAgriculture = incomeAgriculture; }

        public Double getIncomeRent() { return incomeRent; }
        public void setIncomeRent(Double incomeRent) { this.incomeRent = incomeRent; }

        public Double getIncomeInterest() { return incomeInterest; }
        public void setIncomeInterest(Double incomeInterest) { this.incomeInterest = incomeInterest; }

        public Double getIncomeOthers() { return incomeOthers; }
        public void setIncomeOthers(Double incomeOthers) { this.incomeOthers = incomeOthers; }

        public Boolean getDoneIncome() { return doneIncome; }
        public void setDoneIncome(Boolean doneIncome) { this.doneIncome = doneIncome; }

        public Double getExpensePersonal() { return expensePersonal; }
        public void setExpensePersonal(Double expensePersonal) { this.expensePersonal = expensePersonal; }

        public Double getExpenseHousing() { return expenseHousing; }
        public void setExpenseHousing(Double expenseHousing) { this.expenseHousing = expenseHousing; }

        public Double getExpenseUtility() { return expenseUtility; }
        public void setExpenseUtility(Double expenseUtility) { this.expenseUtility = expenseUtility; }

        public Double getExpenseEducation() { return expenseEducation; }
        public void setExpenseEducation(Double expenseEducation) { this.expenseEducation = expenseEducation; }

        public Double getExpenseTransport() { return expenseTransport; }
        public void setExpenseTransport(Double expenseTransport) { this.expenseTransport = expenseTransport; }

        public Double getExpenseOthers() { return expenseOthers; }
        public void setExpenseOthers(Double expenseOthers) { this.expenseOthers = expenseOthers; }

        public Boolean getDoneExpense() { return doneExpense; }
        public void setDoneExpense(Boolean doneExpense) { this.doneExpense = doneExpense; }

        public Double getInvestment3MonthShanchaypatra() { return investment3MonthShanchaypatra; }
        public void setInvestment3MonthShanchaypatra(Double investment3MonthShanchaypatra) { this.investment3MonthShanchaypatra = investment3MonthShanchaypatra; }

        public Double getInvestment5YearsShanchaypatra() { return investment5YearsShanchaypatra; }
        public void setInvestment5YearsShanchaypatra(Double investment5YearsShanchaypatra) { this.investment5YearsShanchaypatra = investment5YearsShanchaypatra; }

        public Double getInvestmentFdr() { return investmentFdr; }
        public void setInvestmentFdr(Double investmentFdr) { this.investmentFdr = investmentFdr; }

        public Double getInvestmentZakat() { return investmentZakat; }
        public void setInvestmentZakat(Double investmentZakat) { this.investmentZakat = investmentZakat; }

        public Double getInvestmentFamilyShanchaypatra() { return investmentFamilyShanchaypatra; }
        public void setInvestmentFamilyShanchaypatra(Double investmentFamilyShanchaypatra) { this.investmentFamilyShanchaypatra = investmentFamilyShanchaypatra; }

        public Boolean getDoneInvestment() { return doneInvestment; }
        public void setDoneInvestment(Boolean doneInvestment) { this.doneInvestment = doneInvestment; }

        public Double getAssetBankAccount() { return assetBankAccount; }
        public void setAssetBankAccount(Double assetBankAccount) { this.assetBankAccount = assetBankAccount; }

        public Double getAssetCar() { return assetCar; }
        public void setAssetCar(Double assetCar) { this.assetCar = assetCar; }

        public Double getAssetFlat() { return assetFlat; }
        public void setAssetFlat(Double assetFlat) { this.assetFlat = assetFlat; }

        public Double getAssetJewelery() { return assetJewelery; }
        public void setAssetJewelery(Double assetJewelery) { this.assetJewelery = assetJewelery; }

        public Double getAssetPlot() { return assetPlot; }
        public void setAssetPlot(Double assetPlot) { this.assetPlot = assetPlot; }

        public Double getLiabilityBankLoan() { return liabilityBankLoan; }
        public void setLiabilityBankLoan(Double liabilityBankLoan) { this.liabilityBankLoan = liabilityBankLoan; }

        public Double getLiabilityPersonLoan() { return liabilityPersonLoan; }
        public void setLiabilityPersonLoan(Double liabilityPersonLoan) { this.liabilityPersonLoan = liabilityPersonLoan; }

        public Boolean getDoneAssetLiability() { return doneAssetLiability; }
        public void setDoneAssetLiability(Boolean doneAssetLiability) { this.doneAssetLiability = doneAssetLiability; }

        public Double getTaxCompGrossTax() { return taxCompGrossTax; }
        public void setTaxCompGrossTax(Double taxCompGrossTax) { this.taxCompGrossTax = taxCompGrossTax; }

        public Double getTaxCompRebate() { return taxCompRebate; }
        public void setTaxCompRebate(Double taxCompRebate) { this.taxCompRebate = taxCompRebate; }

        public Double getTaxCompNetTax() { return taxCompNetTax; }
        public void setTaxCompNetTax(Double taxCompNetTax) { this.taxCompNetTax = taxCompNetTax; }

        public Double getTaxCompMinTax() { return taxCompMinTax; }
        public void setTaxCompMinTax(Double taxCompMinTax) { this.taxCompMinTax = taxCompMinTax; }

        public Double getTaxCompPayable() { return taxCompPayable; }
        public void setTaxCompPayable(Double taxCompPayable) { this.taxCompPayable = taxCompPayable; }


        @Override
        public String toString() {
            return "TaxFormData{" +
                    "id=" + id +
                    ", userId=" + userId +
                    ", date=" + date +
                    ", doneSubmit=" + doneSubmit +
                    ", incomeSalary=" + incomeSalary +
                    ", incomeAgriculture=" + incomeAgriculture +
                    ", incomeRent=" + incomeRent +
                    ", incomeInterest=" + incomeInterest +
                    ", incomeOthers=" + incomeOthers +
                    ", doneIncome=" + doneIncome +
                    ", expensePersonal=" + expensePersonal +
                    ", expenseHousing=" + expenseHousing +
                    ", expenseUtility=" + expenseUtility +
                    ", expenseEducation=" + expenseEducation +
                    ", expenseTransport=" + expenseTransport +
                    ", expenseOthers=" + expenseOthers +
                    ", doneExpense=" + doneExpense +
                    ", investment3MonthShanchaypatra=" + investment3MonthShanchaypatra +
                    ", investment5YearsShanchaypatra=" + investment5YearsShanchaypatra +
                    ", investmentFdr=" + investmentFdr +
                    ", investmentZakat=" + investmentZakat +
                    ", investmentFamilyShanchaypatra=" + investmentFamilyShanchaypatra +
                    ", doneInvestment=" + doneInvestment +
                    ", assetBankAccount=" + assetBankAccount +
                    ", assetCar=" + assetCar +
                    ", assetFlat=" + assetFlat +
                    ", assetJewelery=" + assetJewelery +
                    ", assetPlot=" + assetPlot +
                    ", liabilityBankLoan=" + liabilityBankLoan +
                    ", liabilityPersonLoan=" + liabilityPersonLoan +
                    ", doneAssetLiability=" + doneAssetLiability +
                    ", taxCompGrossTax=" + taxCompGrossTax +
                    ", taxCompRebate=" + taxCompRebate +
                    ", taxCompNetTax=" + taxCompNetTax +
                    ", taxCompMinTax=" + taxCompMinTax +
                    ", taxCompPayable=" + taxCompPayable +
                    '}';
        }
    }

    public TaxFormData getSubmittedTaxFormData(int userId) {
        try {
            String sql = "SELECT * FROM tax_form_table WHERE user_id = ? AND done_submit = true ORDER BY id DESC LIMIT 1";
            Map<String, Object> result = jdbcTemplate.queryForMap(sql, userId);

            return mapToTaxFormData(result);

        } catch (EmptyResultDataAccessException e) {
            System.out.println("No submitted tax form found for user: " + userId);
            return null;
        } catch (Exception e) {
            System.out.println("Error fetching tax form data: " + e);
            e.printStackTrace();
            return null;
        }
    }

    private TaxFormData mapToTaxFormData(Map<String, Object> result) {
        TaxFormData taxFormData = new TaxFormData();

        // Basic info
        taxFormData.setId(safeConvertToInteger(result.get("id")));
        taxFormData.setUserId(safeConvertToInteger(result.get("user_id")));
        taxFormData.setDate(safeConvertToLocalDate(result.get("date")));
        taxFormData.setDoneSubmit(safeConvertToBoolean(result.get("done_submit")));

        // Income fields
        taxFormData.setIncomeSalary(safeConvertToDouble(result.get("income_salary")));
        taxFormData.setIncomeAgriculture(safeConvertToDouble(result.get("income_agriculture")));
        taxFormData.setIncomeRent(safeConvertToDouble(result.get("income_rent")));
        taxFormData.setIncomeInterest(safeConvertToDouble(result.get("income_interest")));
        taxFormData.setIncomeOthers(safeConvertToDouble(result.get("income_others")));
        taxFormData.setDoneIncome(safeConvertToBoolean(result.get("done_income")));

        // Expense fields
        taxFormData.setExpensePersonal(safeConvertToDouble(result.get("expense_personal")));
        taxFormData.setExpenseHousing(safeConvertToDouble(result.get("expense_housing")));
        taxFormData.setExpenseUtility(safeConvertToDouble(result.get("expense_utility")));
        taxFormData.setExpenseEducation(safeConvertToDouble(result.get("expense_education")));
        taxFormData.setExpenseTransport(safeConvertToDouble(result.get("expense_transport")));
        taxFormData.setExpenseOthers(safeConvertToDouble(result.get("expense_others")));
        taxFormData.setDoneExpense(safeConvertToBoolean(result.get("done_expense")));

        // Investment fields
        taxFormData.setInvestment3MonthShanchaypatra(safeConvertToDouble(result.get("investment_3_month_shanchaypatra")));
        taxFormData.setInvestment5YearsShanchaypatra(safeConvertToDouble(result.get("investment_5_years_shanchaypatra")));
        taxFormData.setInvestmentFdr(safeConvertToDouble(result.get("investment_fdr")));
        taxFormData.setInvestmentZakat(safeConvertToDouble(result.get("investment_zakat")));
        taxFormData.setInvestmentFamilyShanchaypatra(safeConvertToDouble(result.get("investment_family_shanchaypatra")));
        taxFormData.setDoneInvestment(safeConvertToBoolean(result.get("done_investment")));

        // Asset fields
        taxFormData.setAssetBankAccount(safeConvertToDouble(result.get("asset_bank_account")));
        taxFormData.setAssetCar(safeConvertToDouble(result.get("asset_car")));
        taxFormData.setAssetFlat(safeConvertToDouble(result.get("asset_flat")));
        taxFormData.setAssetJewelery(safeConvertToDouble(result.get("asset_jewelery")));
        taxFormData.setAssetPlot(safeConvertToDouble(result.get("asset_plot")));

        // Liability fields
        taxFormData.setLiabilityBankLoan(safeConvertToDouble(result.get("liability_bank_loan")));
        taxFormData.setLiabilityPersonLoan(safeConvertToDouble(result.get("liability_person_loan")));
        taxFormData.setDoneAssetLiability(safeConvertToBoolean(result.get("done_asset_liability")));

        // Tax calculation fields
        taxFormData.setTaxCompGrossTax(safeConvertToDouble(result.get("tax_comp_gross_tax")));
        taxFormData.setTaxCompRebate(safeConvertToDouble(result.get("tax_comp_rebate")));
        taxFormData.setTaxCompNetTax(safeConvertToDouble(result.get("tax_comp_net_tax")));
        taxFormData.setTaxCompMinTax(safeConvertToDouble(result.get("tax_comp_min_tax")));
        taxFormData.setTaxCompPayable(safeConvertToDouble(result.get("tax_comp_payable")));

        return taxFormData;
    }

    // Helper methods for safe type conversion
    private Integer safeConvertToInteger(Object value) {
        if (value == null) return null;
        if (value instanceof Integer) return (Integer) value;
        if (value instanceof Number) return ((Number) value).intValue();
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Double safeConvertToDouble(Object value) {
        if (value == null) return null;
        if (value instanceof Double) return (Double) value;
        if (value instanceof Number) return ((Number) value).doubleValue();
        try {
            return Double.parseDouble(value.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Boolean safeConvertToBoolean(Object value) {
        if (value == null) return null;
        if (value instanceof Boolean) return (Boolean) value;
        if (value instanceof Number) return ((Number) value).intValue() != 0;
        try {
            return Boolean.parseBoolean(value.toString());
        } catch (Exception e) {
            return null;
        }
    }

    private LocalDate safeConvertToLocalDate(Object value) {
        if (value == null) return null;
        if (value instanceof LocalDate) return (LocalDate) value;
        if (value instanceof java.sql.Date) return ((java.sql.Date) value).toLocalDate();
        try {
            return LocalDate.parse(value.toString());
        } catch (Exception e) {
            return null;
        }
    }

}