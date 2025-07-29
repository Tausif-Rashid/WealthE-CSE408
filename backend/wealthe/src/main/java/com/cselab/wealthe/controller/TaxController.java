package com.cselab.wealthe.controller;

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

            // Build response object
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

    @GetMapping("/user/tax-investment")
    @CrossOrigin(origins = "*")
    public Map<String, Object> getTaxInvestment() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            // Get user ID from authentication
            int userId = Integer.parseInt(auth.getName());

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
                        .replace("-", "");

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

    @GetMapping("/user/tax-asset")
    @CrossOrigin(origins = "*")
    public Map<String, Object> getTaxAsset() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            // Get user ID from authentication
            int userId = Integer.parseInt(auth.getName());

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

            // Build response object
            response.put("bankAccount", bankAccountTotal != null ? bankAccountTotal : 0.0);
            response.put("car", carTotal != null ? carTotal : 0.0);
            response.put("flat", flatTotal != null ? flatTotal : 0.0);
            response.put("jewelry", jewelryTotal != null ? jewelryTotal : 0.0);
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

            // SQL queries for each liability type
            String personLoanSql = "SELECT COALESCE(SUM(remaining), 0) as total FROM liability_person_loan WHERE user_id = ?";
            String bankLoanSql = "SELECT COALESCE(SUM(remaining), 0) as total FROM liability_bank_loan WHERE user_id = ?";

            // Execute queries and get totals
            Double personLoanTotal = jdbcTemplate.queryForObject(personLoanSql, Double.class, userId);
            Double bankLoanTotal = jdbcTemplate.queryForObject(bankLoanSql, Double.class, userId);

            // Build response object
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
            String checkSql = "SELECT COUNT(*) FROM tax_form_table WHERE user_id = ? AND done_submit= false";
            Integer existingCount = jdbcTemplate.queryForObject(checkSql, Integer.class, userId);

            if (existingCount != null && existingCount > 0) {
                response.put("success", false);
                response.put("message", "Tax form already exists for this user");
                return response;
            }

            // SQL query to insert new tax form
            String sql = "INSERT INTO tax_form_table(user_id) VALUES (?)";

            // Execute the insert
            int rowsAffected = jdbcTemplate.update(sql, userId);

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


}