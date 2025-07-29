package com.cselab.wealthe.controller;

import com.cselab.wealthe.service.FetchPdfDataService;
import com.cselab.wealthe.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
public class TaxController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private static final Logger logger = LoggerFactory.getLogger(TaxController.class);



    @GetMapping("/user/tax-income")
    @CrossOrigin(origins = "*")
    public Map<String, Object> getTaxIncome() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            // Get user ID from authentication
            int userId = Integer.parseInt(auth.getName());

            FetchPdfDataService fetchPdfDataService = null;
            FetchPdfDataService.TaxFormData data = fetchPdfDataService.getSubmittedTaxFormData(userId);
            System.out.println(data.toString());

            // Check if user has submitted tax form data
            String countSql = "SELECT COUNT(*) FROM tax_form_table WHERE user_id = ? ";
            Integer formCount = jdbcTemplate.queryForObject(countSql, Integer.class, userId);

            if (formCount != null && formCount > 0) {
                // User has submitted tax form, get data from tax_form_table
                String formDataSql = "SELECT income_salary, income_agriculture, income_rent, income_interest, income_others FROM tax_form_table WHERE user_id = ? AND done_income = true AND done_submit = false";

                try {
                    Map<String, Object> formData = jdbcTemplate.queryForMap(formDataSql, userId);

                    // Extract values and handle nulls
                    Double salaryTotal = formData.get("income_salary") != null ?
                            Double.parseDouble(formData.get("income_salary").toString()) : 0.0;
                    Double agricultureTotal = formData.get("income_agriculture") != null ?
                            Double.parseDouble(formData.get("income_agriculture").toString()) : 0.0;
                    Double rentTotal = formData.get("income_rent") != null ?
                            Double.parseDouble(formData.get("income_rent").toString()) : 0.0;
                    Double interestTotal = formData.get("income_interest") != null ?
                            Double.parseDouble(formData.get("income_interest").toString()) : 0.0;
                    Double otherTotal = formData.get("income_others") != null ?
                            Double.parseDouble(formData.get("income_others").toString()) : 0.0;

                    // Build response object with tax form data
                    response.put("salary", salaryTotal);
                    response.put("agriculture", agricultureTotal);
                    response.put("rent", rentTotal);
                    response.put("interest", interestTotal);
                    response.put("other", otherTotal);

                    return response;

                } catch (EmptyResultDataAccessException e) {
                    // No records found with done_income = true, fall back to original method
                    System.out.println("No tax form data with done_income = true found, using original calculation");
                }
            }

            // Original calculation logic (when no tax form data exists or done_income is not true)
            // Calculate "last July 1st" date dynamically
            LocalDate now = LocalDate.now();
            LocalDate lastJuly1st;

            if (now.getMonthValue() >= 7) {
                // If current month is July or later, use July 1st of current year
                lastJuly1st = LocalDate.of(now.getYear(), 7, 1);
            } else {
                // If current month is before July, use July 1st of previous year
                lastJuly1st = LocalDate.of(now.getYear() - 1, 7, 1);
            }

            String dateFilter = lastJuly1st.toString(); // Converts to 'YYYY-MM-DD' format

            // SQL queries for each income type from last July 1st (cast string to date)
            String salarySql = "SELECT COALESCE(SUM(amount), 0) as total FROM income WHERE user_id = ? AND type = 'Salary' AND date >= ?::date";
            String agricultureSql = "SELECT COALESCE(SUM(amount), 0) as total FROM income WHERE user_id = ? AND type = 'Agriculture' AND date >= ?::date";
            String rentSql = "SELECT COALESCE(SUM(amount), 0) as total FROM income WHERE user_id = ? AND type = 'Rent' AND date >= ?::date";
            String interestSql = "SELECT COALESCE(SUM(amount), 0) as total FROM income WHERE user_id = ? AND type = 'Interest' AND date >= ?::date";
            String otherSql = "SELECT COALESCE(SUM(amount), 0) as total FROM income WHERE user_id = ? AND type NOT IN ('Salary', 'Agriculture', 'Rent', 'Interest') AND date >= ?::date";

            // Execute queries and get totals
            Double salaryTotal = jdbcTemplate.queryForObject(salarySql, Double.class, userId, dateFilter);
            Double agricultureTotal = jdbcTemplate.queryForObject(agricultureSql, Double.class, userId, dateFilter);
            Double rentTotal = jdbcTemplate.queryForObject(rentSql, Double.class, userId, dateFilter);
            Double interestTotal = jdbcTemplate.queryForObject(interestSql, Double.class, userId, dateFilter);
            Double otherTotal = jdbcTemplate.queryForObject(otherSql, Double.class, userId, dateFilter);

            // Build response object with calculated data
            response.put("salary", salaryTotal != null ? salaryTotal : 0.0);
            response.put("agriculture", agricultureTotal != null ? agricultureTotal : 0.0);
            response.put("rent", rentTotal != null ? rentTotal : 0.0);
            response.put("interest", interestTotal != null ? interestTotal : 0.0);
            response.put("other", otherTotal != null ? otherTotal : 0.0);

            return response;

        } catch (Exception e) {
            System.out.println("Error occurred: " + e);
            e.printStackTrace();
            response.put("error", "Failed to retrieve tax income data: " + e.getMessage());
            return response;
        }
    }



    @GetMapping("/user/tax-expense")
    @CrossOrigin(origins = "*")
    public Map<String, Object> getTaxExpense() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            // Get user ID from authentication
            int userId = Integer.parseInt(auth.getName());

            // Check if user has submitted tax form data
            String countSql = "SELECT COUNT(*) FROM tax_form_table WHERE user_id = ?";
            Integer formCount = jdbcTemplate.queryForObject(countSql, Integer.class, userId);

            if (formCount != null && formCount > 0) {
                // User has submitted tax form, get data from tax_form_table
                String formDataSql = "SELECT expense_personal, expense_housing, expense_utility, expense_education, expense_transport, expense_others FROM tax_form_table WHERE user_id = ? AND done_expense = true AND done_submit = false";

                try {
                    Map<String, Object> formData = jdbcTemplate.queryForMap(formDataSql, userId);

                    // Extract values and handle nulls
                    Double personalTotal = formData.get("expense_personal") != null ?
                            Double.parseDouble(formData.get("expense_personal").toString()) : 0.0;
                    Double housingTotal = formData.get("expense_housing") != null ?
                            Double.parseDouble(formData.get("expense_housing").toString()) : 0.0;
                    Double utilityTotal = formData.get("expense_utility") != null ?
                            Double.parseDouble(formData.get("expense_utility").toString()) : 0.0;
                    Double educationTotal = formData.get("expense_education") != null ?
                            Double.parseDouble(formData.get("expense_education").toString()) : 0.0;
                    Double transportTotal = formData.get("expense_transport") != null ?
                            Double.parseDouble(formData.get("expense_transport").toString()) : 0.0;
                    Double othersTotal = formData.get("expense_others") != null ?
                            Double.parseDouble(formData.get("expense_others").toString()) : 0.0;

                    // Build response object with tax form data
                    response.put("personal", personalTotal);
                    response.put("housing", housingTotal);
                    response.put("utility", utilityTotal);
                    response.put("education", educationTotal);
                    response.put("transportation", transportTotal);
                    response.put("others", othersTotal);

                    return response;

                } catch (EmptyResultDataAccessException e) {
                    // No records found with done_expense = true, fall back to original method
                    System.out.println("No tax form data with done_expense = true found, using original calculation");
                }
            }

            // Original calculation logic (when no tax form data exists or done_expense is not true)
            // Calculate "last July 1st" date dynamically
            LocalDate now = LocalDate.now();
            LocalDate lastJuly1st;

            if (now.getMonthValue() >= 7) {
                // If current month is July or later, use July 1st of current year
                lastJuly1st = LocalDate.of(now.getYear(), 7, 1);
            } else {
                // If current month is before July, use July 1st of previous year
                lastJuly1st = LocalDate.of(now.getYear() - 1, 7, 1);
            }

            String dateFilter = lastJuly1st.toString(); // Converts to 'YYYY-MM-DD' format

            // SQL queries for each expense type from last July 1st (cast string to date)
            String housingSql = "SELECT COALESCE(SUM(amount), 0) as total FROM expense WHERE user_id = ? AND type = 'Rent' AND date >= ?::date";
            String utilitySql = "SELECT COALESCE(SUM(amount), 0) as total FROM expense WHERE user_id = ? AND type = 'Utility' AND date >= ?::date";
            String eduSql = "SELECT COALESCE(SUM(amount), 0) as total FROM expense WHERE user_id = ? AND type = 'Educational Expense' AND date >= ?::date";
            String travelSql = "SELECT COALESCE(SUM(amount), 0) as total FROM expense WHERE user_id = ? AND type = 'Transportation' AND date >= ?::date";
            String otherSql = "SELECT COALESCE(SUM(amount), 0) as total FROM expense WHERE user_id = ? AND type = 'Others' AND date >= ?::date";
            String PersonalSql = "SELECT COALESCE(SUM(amount), 0) as total FROM expense WHERE user_id = ? AND type NOT IN ('Utility', 'Educational Expense', 'Rent', 'Transportation', 'Others') AND date >= ?::date";

            // Execute queries and get totals
            Double housingTotal = jdbcTemplate.queryForObject(housingSql, Double.class, userId, dateFilter);
            Double utilityTotal = jdbcTemplate.queryForObject(utilitySql, Double.class, userId, dateFilter);
            Double eduTotal = jdbcTemplate.queryForObject(eduSql, Double.class, userId, dateFilter);
            Double travelTotal = jdbcTemplate.queryForObject(travelSql, Double.class, userId, dateFilter);
            Double otherTotal = jdbcTemplate.queryForObject(otherSql, Double.class, userId, dateFilter);
            Double personalTotal = jdbcTemplate.queryForObject(PersonalSql, Double.class, userId, dateFilter);

            // Build response object with calculated data
            response.put("personal", personalTotal != null ? personalTotal : 0.0);
            response.put("housing", housingTotal != null ? housingTotal : 0.0);
            response.put("utility", utilityTotal != null ? utilityTotal : 0.0);
            response.put("education", eduTotal != null ? eduTotal : 0.0);
            response.put("transportation", travelTotal != null ? travelTotal : 0.0);
            response.put("others", otherTotal != null ? otherTotal : 0.0);

            return response;

        } catch (Exception e) {
            System.out.println("Error occurred: " + e);
            e.printStackTrace();
            response.put("error", "Failed to retrieve tax expense data: " + e.getMessage());
            return response;
        }
    }

    @GetMapping("/user/tax-asset")
    @CrossOrigin(origins = "*")
    public Map<String, Object> getTaxAsset() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            // Get user ID from authentication
            int userId = Integer.parseInt(auth.getName());

            // Check if user has submitted tax form data
            String countSql = "SELECT COUNT(*) FROM tax_form_table WHERE user_id = ?";
            Integer formCount = jdbcTemplate.queryForObject(countSql, Integer.class, userId);

            if (formCount != null && formCount > 0) {
                // User has submitted tax form, get data from tax_form_table
                String formDataSql = "SELECT asset_bank_balance, asset_cars, asset_flats, asset_jewellery, asset_plots FROM tax_form_table WHERE user_id = ? AND done_asset = true AND done_submit = false";

                try {
                    Map<String, Object> formData = jdbcTemplate.queryForMap(formDataSql, userId);

                    // Extract values and handle nulls
                    Double bankAccountTotal = formData.get("asset_bank_balance") != null ?
                            Double.parseDouble(formData.get("asset_bank_balance").toString()) : 0.0;
                    Double carTotal = formData.get("asset_cars") != null ?
                            Double.parseDouble(formData.get("asset_cars").toString()) : 0.0;
                    Double flatTotal = formData.get("asset_flats") != null ?
                            Double.parseDouble(formData.get("asset_flats").toString()) : 0.0;
                    Double jewelryTotal = formData.get("asset_jewellery") != null ?
                            Double.parseDouble(formData.get("asset_jewellery").toString()) : 0.0;
                    Double plotTotal = formData.get("asset_plots") != null ?
                            Double.parseDouble(formData.get("asset_plots").toString()) : 0.0;

                    // Build response object with tax form data
                    response.put("bankAccount", bankAccountTotal);
                    response.put("car", carTotal);
                    response.put("flat", flatTotal);
                    response.put("jewellery", jewelryTotal);
                    response.put("jewellery", jewelryTotal);
                    response.put("plot", plotTotal);

                    return response;

                } catch (EmptyResultDataAccessException e) {
                    // No records found with done_asset = true, fall back to original method
                    System.out.println("No tax form data with done_asset = true found, using original calculation");
                }
            }

            // Original calculation logic (when no tax form data exists or done_asset is not true)
            // SQL queries for each asset type
            String bankAccountSql = "SELECT COALESCE(SUM(amount), 0) as total FROM asset_bank_account WHERE user_id = ?";
            String carSql = "SELECT COALESCE(SUM(cost), 0) as total FROM asset_car WHERE user_id = ?";
            String flatSql = "SELECT COALESCE(SUM(cost), 0) as total FROM asset_flat WHERE user_id = ?";
            String jewelrySql = "SELECT COALESCE(SUM(cost), 0) as total FROM asset_jewelery WHERE user_id = ?";
            String plotSql = "SELECT COALESCE(SUM(cost), 0) as total FROM asset_plot WHERE user_id = ?";

            // Execute queries and get totals
            Double bankAccountTotal = jdbcTemplate.queryForObject(bankAccountSql, Double.class, userId);
            Double carTotal = jdbcTemplate.queryForObject(carSql, Double.class, userId);
            Double flatTotal = jdbcTemplate.queryForObject(flatSql, Double.class, userId);
            Double jewelryTotal = jdbcTemplate.queryForObject(jewelrySql, Double.class, userId);
            Double plotTotal = jdbcTemplate.queryForObject(plotSql, Double.class, userId);

            // Build response object with calculated data
            response.put("bankAccount", bankAccountTotal != null ? bankAccountTotal : 0.0);
            response.put("car", carTotal != null ? carTotal : 0.0);
            response.put("flat", flatTotal != null ? flatTotal : 0.0);
            response.put("jewellery", jewelryTotal != null ? jewelryTotal : 0.0);
            response.put("plot", plotTotal != null ? plotTotal : 0.0);

            return response;

        } catch (Exception e) {
            System.out.println("Error occurred: " + e);
            e.printStackTrace();
            response.put("error", "Failed to retrieve tax asset data: " + e.getMessage());
            return response;
        }
    }

    @GetMapping("/user/tax-liability")
    @CrossOrigin(origins = "*")
    public Map<String, Object> getTaxLiability() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            // Get user ID from authentication
            int userId = Integer.parseInt(auth.getName());

            // Check if user has submitted tax form data
            String countSql = "SELECT COUNT(*) FROM tax_form_table WHERE user_id = ?";
            Integer formCount = jdbcTemplate.queryForObject(countSql, Integer.class, userId);

            if (formCount != null && formCount > 0) {
                // User has submitted tax form, get data from tax_form_table
                String formDataSql = "SELECT liability_bank_loan, liability_person_loan FROM tax_form_table WHERE user_id = ? AND done_asset = true AND done_submit = false";

                try {
                    Map<String, Object> formData = jdbcTemplate.queryForMap(formDataSql, userId);

                    // Extract values and handle nulls
                    Double bankLoanTotal = formData.get("liability_bank_loan") != null ?
                            Double.parseDouble(formData.get("liability_bank_loan").toString()) : 0.0;
                    Double personLoanTotal = formData.get("liability_person_loan") != null ?
                            Double.parseDouble(formData.get("liability_person_loan").toString()) : 0.0;

                    // Build response object with tax form data
                    response.put("bankLoan", bankLoanTotal);
                    response.put("personLoan", personLoanTotal);

                    return response;

                } catch (EmptyResultDataAccessException e) {
                    // No records found with done_asset = true, fall back to original method
                    System.out.println("No tax form data with done_asset = true found, using original calculation");
                }
            }

            // Original calculation logic (when no tax form data exists or done_asset is not true)
            // SQL queries for each liability type
            String personLoanSql = "SELECT COALESCE(SUM(remaining), 0) as total FROM liability_person_loan WHERE user_id = ?";
            String bankLoanSql = "SELECT COALESCE(SUM(remaining), 0) as total FROM liability_bank_loan WHERE user_id = ?";

            // Execute queries and get totals
            Double personLoanTotal = jdbcTemplate.queryForObject(personLoanSql, Double.class, userId);
            Double bankLoanTotal = jdbcTemplate.queryForObject(bankLoanSql, Double.class, userId);

            // Build response object with calculated data
            response.put("personLoan", personLoanTotal != null ? personLoanTotal : 0.0);
            response.put("bankLoan", bankLoanTotal != null ? bankLoanTotal : 0.0);

            return response;

        } catch (Exception e) {
            System.out.println("Error occurred: " + e);
            e.printStackTrace();
            response.put("error", "Failed to retrieve tax liability data: " + e.getMessage());
            return response;
        }
    }

    @PostMapping("/user/tax-personalInfo")
    @CrossOrigin(origins = "*")
    public Map<String, Object> createTaxForm(@RequestBody Map<String, Object> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            // Get user ID from authentication
            int userId = Integer.parseInt(auth.getName());

            // Check if user already has a tax form
            String checkSql = "SELECT COUNT(*) FROM tax_form_table WHERE user_id = ? AND done_submit = false";
            Integer existingCount = jdbcTemplate.queryForObject(checkSql, Integer.class, userId);

            if (existingCount != null && existingCount > 0) {
                response.put("success", true);
                response.put("message", "Tax form already exists for this user");
                return response;
            }

            // Get today's date
            LocalDate today = LocalDate.now();

            // SQL query to insert new tax form with today's date
            String sql = "INSERT INTO tax_form_table(user_id, date) VALUES (?, ?)";

            // Execute the insert
            int rowsAffected = jdbcTemplate.update(sql, userId, today);

            if (rowsAffected > 0) {
                response.put("success", true);
                response.put("message", "Tax form created successfully");
                response.put("rowsAffected", rowsAffected);
            } else {
                response.put("success", false);
                response.put("message", "Failed to create tax form");
            }

            return response;

        } catch (Exception e) {
            System.out.println("Error occurred: " + e);
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to create tax form: " + e.getMessage());
            return response;
        }
    }

    @PostMapping("/user/update-tax-form-income")
    @CrossOrigin(origins = "*")
    public Map<String, Object> updateTaxFormIncome(@RequestBody Map<String, Object> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            // Get user ID from authentication
            int userId = Integer.parseInt(auth.getName());

            // Extract income data from request
            Object salaryObj = request.get("income_salary");
            Object agricultureObj = request.get("income_agriculture");
            Object rentObj = request.get("income_rent");
            Object interestObj = request.get("income_interest");
            Object othersObj = request.get("income_others");

            // Convert to appropriate types with null safety
            Double incomeSalary = salaryObj != null ?
                    (salaryObj instanceof Number ? ((Number) salaryObj).doubleValue() : Double.parseDouble(salaryObj.toString())) : 0.0;
            Double incomeAgriculture = agricultureObj != null ?
                    (agricultureObj instanceof Number ? ((Number) agricultureObj).doubleValue() : Double.parseDouble(agricultureObj.toString())) : 0.0;
            Double incomeRent = rentObj != null ?
                    (rentObj instanceof Number ? ((Number) rentObj).doubleValue() : Double.parseDouble(rentObj.toString())) : 0.0;
            Double incomeInterest = interestObj != null ?
                    (interestObj instanceof Number ? ((Number) interestObj).doubleValue() : Double.parseDouble(interestObj.toString())) : 0.0;
            Double incomeOthers = othersObj != null ?
                    (othersObj instanceof Number ? ((Number) othersObj).doubleValue() : Double.parseDouble(othersObj.toString())) : 0.0;

            // SQL query to update tax form income data
            String sql = "UPDATE tax_form_table SET income_salary = ?, income_agriculture = ?, income_rent = ?, income_interest = ?, income_others = ?, done_income = true WHERE user_id = ? AND done_submit = false";

            // Execute the update
            int rowsAffected = jdbcTemplate.update(sql, incomeSalary, incomeAgriculture, incomeRent, incomeInterest, incomeOthers, userId);

            if (rowsAffected > 0) {
                response.put("success", true);
                response.put("message", "Tax form income data updated successfully");
                response.put("rowsAffected", rowsAffected);
            } else {
                response.put("success", false);
                response.put("message", "No tax form found or form already submitted");
            }

            return response;

        } catch (NumberFormatException e) {
            response.put("success", false);
            response.put("message", "Invalid number format for income values: " + e.getMessage());
            return response;
        } catch (Exception e) {
            System.out.println("Error occurred: " + e);
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to update tax form income: " + e.getMessage());
            return response;
        }
    }

    @PostMapping("/user/update-tax-form-expense")
    @CrossOrigin(origins = "*")
    public Map<String, Object> updateTaxFormExpense(@RequestBody Map<String, Object> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            // Get user ID from authentication
            int userId = Integer.parseInt(auth.getName());

            // Extract expense data from request
            Object personalObj = request.get("personal");
            Object housingObj = request.get("housing");
            Object utilityObj = request.get("utility");
            Object educationObj = request.get("education");
            Object transportObj = request.get("transport");
            Object othersObj = request.get("others");

            // Convert to appropriate types with null safety
            Double expensePersonal = personalObj != null ?
                    (personalObj instanceof Number ? ((Number) personalObj).doubleValue() : Double.parseDouble(personalObj.toString())) : 0.0;
            Double expenseHousing = housingObj != null ?
                    (housingObj instanceof Number ? ((Number) housingObj).doubleValue() : Double.parseDouble(housingObj.toString())) : 0.0;
            Double expenseUtility = utilityObj != null ?
                    (utilityObj instanceof Number ? ((Number) utilityObj).doubleValue() : Double.parseDouble(utilityObj.toString())) : 0.0;
            Double expenseEducation = educationObj != null ?
                    (educationObj instanceof Number ? ((Number) educationObj).doubleValue() : Double.parseDouble(educationObj.toString())) : 0.0;
            Double expenseTransport = transportObj != null ?
                    (transportObj instanceof Number ? ((Number) transportObj).doubleValue() : Double.parseDouble(transportObj.toString())) : 0.0;
            Double expenseOthers = othersObj != null ?
                    (othersObj instanceof Number ? ((Number) othersObj).doubleValue() : Double.parseDouble(othersObj.toString())) : 0.0;

            // SQL query to update tax form expense data
            String sql = "UPDATE tax_form_table SET expense_personal = ?, expense_housing = ?, expense_utility = ?, expense_education = ?, expense_transport = ?, expense_others = ?, done_expense = true WHERE user_id = ? AND done_submit = false";

            // Execute the update
            int rowsAffected = jdbcTemplate.update(sql, expensePersonal, expenseHousing, expenseUtility, expenseEducation, expenseTransport, expenseOthers, userId);

            if (rowsAffected > 0) {
                response.put("success", true);
                response.put("message", "Tax form expense data updated successfully");
                response.put("rowsAffected", rowsAffected);
            } else {
                response.put("success", false);
                response.put("message", "No tax form found or form already submitted");
            }

            return response;

        } catch (NumberFormatException e) {
            response.put("success", false);
            response.put("message", "Invalid number format for expense values: " + e.getMessage());
            return response;
        } catch (Exception e) {
            System.out.println("Error occurred: " + e);
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to update tax form expense: " + e.getMessage());
            return response;
        }
    }

    @PostMapping("/user/update-tax-form-investment")
    @CrossOrigin(origins = "*")
    public Map<String, Object> updateTaxFormInvestment(@RequestBody Map<String, Object> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            // Get user ID from authentication
            int userId = Integer.parseInt(auth.getName());

            // Extract investment data from request
            Object threeMonthObj = request.get("three_month_sanchaypatra");
            Object fiveYearsObj = request.get("five_years_sanchaypatra");
            Object zakatObj = request.get("Zakat");
            Object fdrObj = request.get("FDR");
            Object familyObj = request.get("family_sanchaypatra");

            // Convert to appropriate types with null safety
            Double threeMonthSanchaypatra = threeMonthObj != null ?
                    (threeMonthObj instanceof Number ? ((Number) threeMonthObj).doubleValue() : Double.parseDouble(threeMonthObj.toString())) : 0.0;
            Double fiveYearsSanchaypatra = fiveYearsObj != null ?
                    (fiveYearsObj instanceof Number ? ((Number) fiveYearsObj).doubleValue() : Double.parseDouble(fiveYearsObj.toString())) : 0.0;
            Double zakat = zakatObj != null ?
                    (zakatObj instanceof Number ? ((Number) zakatObj).doubleValue() : Double.parseDouble(zakatObj.toString())) : 0.0;
            Double fdr = fdrObj != null ?
                    (fdrObj instanceof Number ? ((Number) fdrObj).doubleValue() : Double.parseDouble(fdrObj.toString())) : 0.0;
            Double familySanchaypatra = familyObj != null ?
                    (familyObj instanceof Number ? ((Number) familyObj).doubleValue() : Double.parseDouble(familyObj.toString())) : 0.0;

            // SQL query to update tax form investment data
            String sql = "UPDATE tax_form_table SET investment_3_month_shanchaypatra = ?, investment_5_years_shanchaypatra = ?, investment_zakat = ?, investment_fdr = ?, investment_family_shanchaypatra = ?, done_investment = true WHERE user_id = ? AND done_submit = false";

            // Execute the update
            int rowsAffected = jdbcTemplate.update(sql, threeMonthSanchaypatra, fiveYearsSanchaypatra, zakat, fdr, familySanchaypatra, userId);

            if (rowsAffected > 0) {
                response.put("success", true);
                response.put("message", "Tax form investment data updated successfully");
                response.put("rowsAffected", rowsAffected);
            } else {
                response.put("success", false);
                response.put("message", "No tax form found or form already submitted");
            }

            return response;

        } catch (NumberFormatException e) {
            response.put("success", false);
            response.put("message", "Invalid number format for investment values: " + e.getMessage());
            return response;
        } catch (Exception e) {
            System.out.println("Error occurred: " + e);
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to update tax form investment: " + e.getMessage());
            return response;
        }
    }

    @PostMapping("/user/update-tax-form-asset")
    @CrossOrigin(origins = "*")
    public Map<String, Object> updateTaxFormAssetLiability(@RequestBody Map<String, Object> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            // Get user ID from authentication
            int userId = Integer.parseInt(auth.getName());

            // Extract asset and liability data from request
            Object bankAccountObj = request.get("bankAccount");
            Object carObj = request.get("car");
            Object flatObj = request.get("flat");
            Object jeweleryObj = request.get("jewelery");
            Object plotObj = request.get("plot");
            Object bankLoanObj = request.get("bankLoan");
            Object personLoanObj = request.get("personLoan");

            // Convert to appropriate types with null safety
            Double assetBankAccount = bankAccountObj != null ?
                    (bankAccountObj instanceof Number ? ((Number) bankAccountObj).doubleValue() : Double.parseDouble(bankAccountObj.toString())) : 0.0;
            Double assetCar = carObj != null ?
                    (carObj instanceof Number ? ((Number) carObj).doubleValue() : Double.parseDouble(carObj.toString())) : 0.0;
            Double assetFlat = flatObj != null ?
                    (flatObj instanceof Number ? ((Number) flatObj).doubleValue() : Double.parseDouble(flatObj.toString())) : 0.0;
            Double assetJewelery = jeweleryObj != null ?
                    (jeweleryObj instanceof Number ? ((Number) jeweleryObj).doubleValue() : Double.parseDouble(jeweleryObj.toString())) : 0.0;
            Double assetPlot = plotObj != null ?
                    (plotObj instanceof Number ? ((Number) plotObj).doubleValue() : Double.parseDouble(plotObj.toString())) : 0.0;
            Double liabilityBankLoan = bankLoanObj != null ?
                    (bankLoanObj instanceof Number ? ((Number) bankLoanObj).doubleValue() : Double.parseDouble(bankLoanObj.toString())) : 0.0;
            Double liabilityPersonLoan = personLoanObj != null ?
                    (personLoanObj instanceof Number ? ((Number) personLoanObj).doubleValue() : Double.parseDouble(personLoanObj.toString())) : 0.0;

            // SQL query to update tax form asset and liability data
            String sql = "UPDATE tax_form_table SET asset_bank_balance = ?, asset_cars = ?, asset_flats = ?, asset_jewellery = ?, asset_plots = ?, liability_bank_loan = ?, liability_person_loan = ?, done_asset = true WHERE user_id = ? AND done_submit = false";

            // Execute the update
            int rowsAffected = jdbcTemplate.update(sql, assetBankAccount, assetCar, assetFlat, assetJewelery, assetPlot, liabilityBankLoan, liabilityPersonLoan, userId);

            if (rowsAffected > 0) {
                response.put("success", true);
                response.put("message", "Tax form asset and liability data updated successfully");
                response.put("rowsAffected", rowsAffected);
            } else {
                response.put("success", false);
                response.put("message", "No tax form found or form already submitted");
            }

            return response;

        } catch (NumberFormatException e) {
            response.put("success", false);
            response.put("message", "Invalid number format for asset/liability values: " + e.getMessage());
            return response;
        } catch (Exception e) {
            System.out.println("Error occurred: " + e);
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to update tax form asset and liability: " + e.getMessage());
            return response;
        }
    }

    @GetMapping("/user/tax-investment")
    @CrossOrigin(origins = "*")
    public Map<String, Object> getTaxInvestment() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            // Get user ID from authentication
            int userId = Integer.parseInt(auth.getName());

            // Check if user has submitted tax form data
            String countSql = "SELECT COUNT(*) FROM tax_form_table WHERE user_id = ?";
            Integer formCount = jdbcTemplate.queryForObject(countSql, Integer.class, userId);

            if (formCount != null && formCount > 0) {
                // User has submitted tax form, get data from tax_form_table
                String formDataSql = "SELECT investment_3_month_shanchaypatra, investment_5_years_shanchaypatra, investment_fdr, investment_zakat, investment_family_shanchaypatra FROM tax_form_table WHERE user_id = ? AND done_investment = true AND done_submit = false";

                try {
                    Map<String, Object> formData = jdbcTemplate.queryForMap(formDataSql, userId);

                    // Extract values and handle nulls, mapping to response keys
                    Double threeMonthSanchaypatra = formData.get("investment_3_month_shanchaypatra") != null ?
                            Double.parseDouble(formData.get("investment_3_month_shanchaypatra").toString()) : 0.0;
                    Double fiveYearsSanchaypatra = formData.get("investment_5_years_shanchaypatra") != null ?
                            Double.parseDouble(formData.get("investment_5_years_shanchaypatra").toString()) : 0.0;
                    Double fdr = formData.get("investment_fdr") != null ?
                            Double.parseDouble(formData.get("investment_fdr").toString()) : 0.0;
                    Double zakat = formData.get("investment_zakat") != null ?
                            Double.parseDouble(formData.get("investment_zakat").toString()) : 0.0;
                    Double familySanchaypatra = formData.get("investment_family_shanchaypatra") != null ?
                            Double.parseDouble(formData.get("investment_family_shanchaypatra").toString()) : 0.0;

                    // Build response object with tax form data (matching original response format)
                    response.put("threemonthshanchaypatra", threeMonthSanchaypatra);
                    response.put("fiveyearsshanchaypatra", fiveYearsSanchaypatra);
                    response.put("fdr", fdr);
                    response.put("zakat", zakat);
                    response.put("familyshanchaypatra", familySanchaypatra);

                    return response;

                } catch (EmptyResultDataAccessException e) {
                    // No records found with done_investment = true, fall back to original method
                    System.out.println("No tax form data with done_investment = true found, using original calculation");
                }
            }

            // Original calculation logic (when no tax form data exists or done_investment is not true)
            // Calculate "last July 1st" date dynamically
            LocalDate now = LocalDate.now();
            LocalDate lastJuly1st;

            if (now.getMonthValue() >= 7) {
                // If current month is July or later, use July 1st of current year
                lastJuly1st = LocalDate.of(now.getYear(), 7, 1);
            } else {
                // If current month is before July, use July 1st of previous year
                lastJuly1st = LocalDate.of(now.getYear() - 1, 7, 1);
            }

            String dateFilter = lastJuly1st.toString(); // Converts to 'YYYY-MM-DD' format

            // Get all investment types from rule_investment_type table
            String rulesSql = "SELECT title FROM rule_investment_type";
            List<String> investmentTypes = jdbcTemplate.queryForList(rulesSql, String.class);

            Map<String, Double> investmentTotals = new HashMap<>();

            // Query for each investment type dynamically
            for (String investmentType : investmentTypes) {
                String sql = "SELECT COALESCE(SUM(amount), 0) as total FROM investment WHERE user_id = ? AND title = ? AND date >= ?::date";
                Double total = jdbcTemplate.queryForObject(sql, Double.class, userId, investmentType, dateFilter);

                // Create a clean key name (remove spaces, convert to camelCase)
                String key = investmentType.toLowerCase()
                        .replace(" ", "")
                        .replace("-", "")
                        .replace("3month", "threemonth")
                        .replace("5years", "fiveyears");


                investmentTotals.put(key, total != null ? total : 0.0);
            }

            // Add all totals to response
            response.putAll(investmentTotals);

            return response;

        } catch (Exception e) {
            System.out.println("Error occurred: " + e);
            e.printStackTrace();
            response.put("error", "Failed to retrieve investment data: " + e.getMessage());
            return response;
        }
    }



    // Helper method to calculate tax and rebate
    private Map<String, Double> calculateTaxAndRebate(Double income, Double investment, String category) {
        Map<String, Double> result = new HashMap<>();

        // Calculate tax based on Bangladesh tax slabs (2024-25)
        Double tax = calculateTax(income, category);

        // Calculate rebate based on investment (assuming 15% rebate on investment up to certain limit)
        Double rebate = 0.0;
//        Double maxRebateableInvestment = Math.min(investment, income * 0.25); // Max 25% of income
        rebate = Math.min (investment, income*0.03); // 15% rebate

        result.put("totalTax", tax);
        result.put("rebateAmount", rebate);

        return result;
    }

    // Helper method to calculate tax based on Bangladesh tax slabs
    private Double calculateTax(Double taxableIncome, String category) {


        List<Map<String, Object>> slabs;
//        List<Map<String, Object>> taxes = new ArrayList<>();

        String sql = "select * from rule_income where category = ? order by slab_no;";
        System.out.println("api called for admin list user");
        slabs= jdbcTemplate.queryForList(sql, category);
        int count=0;
        double[] slab = {0,0,0,0,0,0};
        double [] rates = {0,0,0,0,0,0};

        for (Map<String, Object> i : slabs){
            //need to work no slab id and rate.....
            //System.out.println(i);
            //System.out.println(i.get("user_id"));
            count = Integer.parseInt(i.get("slab_no").toString()) -1 ;
            slab[count] = Double.parseDouble(i.get("slab_length").toString());
            rates[count] = Double.parseDouble(i.get("tax_rate").toString());
            System.out.println(slab[count]);
        }

        double remaining_income = taxableIncome;
        System.out.println("Total Income: " + remaining_income);
        double total_tax=0;

        for (int i=0; i<count; i++){
            double current = Double.min (remaining_income, slab[i]);
            total_tax+= current*rates[i]/100;
            System.out.println("Tax on " + current + " amount: " + current*rates[i]/100);
            remaining_income -= Double.min(remaining_income, slab[i]);
            if (remaining_income==0) break;
        }


        return total_tax;
    }

    @GetMapping("/user/tax-amount")
    @CrossOrigin(origins = "*")
    public Map<String, Object> getTaxAmount() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            // Get user ID from authentication
            int userId = Integer.parseInt(auth.getName());

            // 1. Get total income from tax_form_table
            String incomeSql = "SELECT COALESCE(SUM(COALESCE(income_salary, 0) + COALESCE(income_agriculture, 0) + COALESCE(income_rent, 0) + COALESCE(income_interest, 0) + COALESCE(income_others, 0)), 0) as total_income FROM tax_form_table WHERE user_id = ? AND done_submit = false";
            Double totalIncome = jdbcTemplate.queryForObject(incomeSql, Double.class, userId);

            if (totalIncome == null) {
                totalIncome = 0.0;
            }

            // 2. Get investment amounts from tax_form_table
            String investmentSql = "SELECT investment_3_month_shanchaypatra, investment_5_years_shanchaypatra, investment_fdr, investment_zakat, investment_family_shanchaypatra FROM tax_form_table WHERE user_id = ? AND done_submit = false";

            Map<String, Object> investmentData = null;
            try {
                investmentData = jdbcTemplate.queryForMap(investmentSql, userId);
            } catch (EmptyResultDataAccessException e) {
                // No investment data found, use zeros
                investmentData = new HashMap<>();
                investmentData.put("investment_3_month_shanchaypatra", 0.0);
                investmentData.put("investment_5_years_shanchaypatra", 0.0);
                investmentData.put("investment_fdr", 0.0);
                investmentData.put("investment_zakat", 0.0);
                investmentData.put("investment_family_shanchaypatra", 0.0);
            }

            // 3. Get investment rules from rule_investment_type
            String rulesSql = "SELECT title, rate_rebate FROM rule_investment_type";
            List<Map<String, Object>> investmentRules = jdbcTemplate.queryForList(rulesSql);

            // Create a map for easy lookup of rates by title
            Map<String, Double> rateMap = new HashMap<>();
            for (Map<String, Object> rule : investmentRules) {
                String title = rule.get("title").toString();
                Double rate = rule.get("rate_rebate") != null ?
                        Double.parseDouble(rule.get("rate_rebate").toString()) : 0.0;
                rateMap.put(title, rate);
            }

            // 4. Calculate total investment with rates
            Double totalInvestment = 0.0;

            // Map investment fields to their corresponding rule titles
            Map<String, String> investmentMapping = new HashMap<>();
            investmentMapping.put("investment_3_month_shanchaypatra", "3 Month Shanchaypatra");
            investmentMapping.put("investment_5_years_shanchaypatra", "5 Years Shanchaypatra");
            investmentMapping.put("investment_fdr", "FDR");
            investmentMapping.put("investment_zakat", "Zakat");
            investmentMapping.put("investment_family_shanchaypatra", "Family Shanchaypatra");

            for (Map.Entry<String, String> entry : investmentMapping.entrySet()) {
                String fieldName = entry.getKey();
                String ruleTitle = entry.getValue();

                Double amount = investmentData.get(fieldName) != null ?
                        Double.parseDouble(investmentData.get(fieldName).toString()) : 0.0;
                Double rate = rateMap.getOrDefault(ruleTitle, 0.0);

                totalInvestment += amount * (rate / 100); // Convert percentage to decimal
            }

            // 5. Get user category for tax calculation
            String category = getUserCategory(userId);

            // 6. Calculate tax and rebate using existing methods
            Map<String, Double> taxCalculation = calculateTaxAndRebate(totalIncome, totalInvestment, category);
            Double grossTax = taxCalculation.get("totalTax");
            Double rebateAmount = taxCalculation.get("rebateAmount");

            // 7. Calculate net tax
            Double netTax = grossTax - rebateAmount;

            // 8. Get minimum tax based on user category/zone
            Double minTax = getMinimumTax(userId);

            // 9. Calculate payable tax (higher of net tax or minimum tax)
            Double payableTax = Math.max(netTax, minTax);

            // 10. Update tax_form_table with calculated values
            String updateSql = "UPDATE tax_form_table SET tax_comp_gross_tax = ?, tax_comp_rebate = ?, tax_comp_net_tax = ?, tax_comp_min_tax = ?, tax_comp_payable = ? WHERE user_id = ? AND done_submit = false";

            int rowsAffected = jdbcTemplate.update(updateSql, grossTax, rebateAmount, netTax, minTax, payableTax, userId);

            if (rowsAffected == 0) {
                response.put("error", "No tax form found or form already submitted");
                return response;
            }

            FetchPdfDataService fetchPdfDataService = null;
            FetchPdfDataService.TaxFormData data = fetchPdfDataService.getSubmittedTaxFormData(userId);
            System.out.println(data.toString());


            // 11. Build response object
            response.put("gross_tax", grossTax != null ? grossTax : 0.0);
            response.put("rebate_amount", rebateAmount != null ? rebateAmount : 0.0);
            response.put("net_tax", netTax != null ? netTax : 0.0);
            response.put("min_tax", minTax != null ? minTax : 0.0);
            response.put("payable_tax", payableTax != null ? payableTax : 0.0);

            return response;

        } catch (Exception e) {
            System.out.println("Error occurred: " + e);
            e.printStackTrace();
            response.put("error", "Failed to retrieve tax amount data: " + e.getMessage());
            return response;
        }
    }

    // Helper method to get user category
    private String getUserCategory(int userId) {
        try {
            String sql = "SELECT is_ff, is_female, is_disabled FROM user_tax_info WHERE id = ?";
            Map<String, Object> userInfo = jdbcTemplate.queryForMap(sql, userId);

            Boolean isFF = userInfo.get("is_ff") != null ? (Boolean) userInfo.get("is_ff") : false;
            Boolean isFemale = userInfo.get("is_female") != null ? (Boolean) userInfo.get("is_female") : false;
            Boolean isDisabled = userInfo.get("is_disabled") != null ? (Boolean) userInfo.get("is_disabled") : false;

            if (isFF) return "ff";
            else if (isDisabled) return "disabled";
            else if (isFemale) return "female";
            else if (isElderly(userId)) return "elderly";
            else return "regular";

        } catch (Exception e) {
            System.out.println("Error getting user category: " + e);
            return "regular"; // Default category
        }
    }

    // Helper method to check if user is elderly
    private boolean isElderly(int userId) {
        try {
            String sql = "SELECT birth_date FROM user_tax_info WHERE id = ?";
            String birthDateStr = jdbcTemplate.queryForObject(sql, String.class, userId);

            if (birthDateStr != null) {
                LocalDate birthDate = LocalDate.parse(birthDateStr);
                LocalDate now = LocalDate.now();
                int age = Period.between(birthDate, now).getYears();
                return age >= 65; // Assuming 65+ is elderly
            }

            return false;
        } catch (Exception e) {
            System.out.println("Error checking elderly status: " + e);
            return false;
        }
    }

    // Helper method to get minimum tax
    private Double getMinimumTax(int userId) {
        String taxAreaSql = "SELECT area_name FROM user_tax_info WHERE id = ?";
        String taxArea = null;
        try {
            taxArea = jdbcTemplate.queryForObject(taxAreaSql, String.class, userId);
        } catch (Exception e) {
            logger.debug("Tax area not found for user: " + userId);
        }

        if (taxArea == null || taxArea.trim().isEmpty()) {
            taxArea = "Rest";
        }

        // Get minimum tax for the area
        String minTaxSql = "SELECT min_amount FROM rule_tax_zone_min_tax WHERE area_name = ?";
        Double minTax = 0.0;
        try {
            minTax = jdbcTemplate.queryForObject(minTaxSql, Double.class, taxArea);
        } catch (Exception e) {
            logger.debug("Minimum tax not found for area: " + taxArea);
        }

        if (minTax == null) {
            minTax =3000.0;
        }
        return minTax;
    }

    @PostMapping("/user/submit-tax-form")
    @CrossOrigin(origins = "*")
    public Map<String, Object> submitTaxForm(@RequestBody Map<String, Object> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            // Get user ID from authentication
            int userId = Integer.parseInt(auth.getName());


            String sql = "UPDATE tax_form_table SET done_submit=true WHERE user_id = ? AND done_submit = false";

            // Execute the update
            int rowsAffected = jdbcTemplate.update(sql, userId);

            if (rowsAffected > 0) {
                response.put("success", true);
                response.put("message", "Tax form submitted successfully");
                response.put("rowsAffected", rowsAffected);
            } else {
                response.put("success", false);
                response.put("message", "No tax form found or form already submitted");
            }

            return response;

        } catch (Exception e) {
            System.out.println("Error occurred: " + e);
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to submit tax form" + e.getMessage());
            return response;
        }
    }


    }