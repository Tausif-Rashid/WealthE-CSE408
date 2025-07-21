package com.cselab.wealthe.controller;

import com.cselab.wealthe.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
public class ApiControllerAzmal {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private static final Logger logger = LoggerFactory.getLogger(ApiControllerAzmal.class);



    @PostMapping("/user/add-expense")
    public ResponseEntity<Map<String, Object>> addExpense(@RequestBody Map<String, Object> expenseData) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            int userId = Integer.parseInt(auth.getName());

            if (userId == 0) {
                logger.debug("Failed to get user id in /user/add-expense");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Unauthorized user");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            // Log the incoming data for debugging
            logger.debug("Received expense data: " + expenseData.toString());

            // Extract and validate expense data from request body
            String type = expenseData.get("type") != null ? expenseData.get("type").toString() : null;
            String description = expenseData.get("description") != null ? expenseData.get("description").toString() : null;
            String date = expenseData.get("date") != null ? expenseData.get("date").toString() : null;

            // Parse amount safely
            Double amount = null;
            if (expenseData.get("amount") != null) {
                try {
                    amount = Double.parseDouble(expenseData.get("amount").toString());
                } catch (NumberFormatException e) {
                    logger.error("Invalid amount format: " + expenseData.get("amount"));
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Invalid amount format");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }

            // Parse boolean values safely
            Boolean isRecurring = false;
            if (expenseData.get("isRecurring") != null) {
                isRecurring = Boolean.parseBoolean(expenseData.get("isRecurring").toString());
            }

            String recurrenceType = null;
            // Only extract recurrenceType if isRecurring is true
            if (isRecurring) {
                recurrenceType = expenseData.get("recurrenceType") != null ? expenseData.get("recurrenceType").toString() : null;
            }

            // Parse date string to SQL Date
            java.sql.Date sqlDate = null;
            if (date != null) {
                try {
                    // Assuming date format is YYYY-MM-DD, adjust format if needed
                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                    java.util.Date utilDate = dateFormat.parse(date);
                    sqlDate = new java.sql.Date(utilDate.getTime());
                } catch (ParseException e) {
                    logger.error("Invalid date format: " + date);
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Invalid date format. Expected: YYYY-MM-DD");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }

            // Validate required fields
            if (type == null || amount == null || description == null || sqlDate == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Missing required fields");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Insert into expense table with recurrence column
            String insertExpenseSql = "INSERT INTO expense (user_id, type, amount, description, date, recurrence) VALUES (?, ?, ?, ?, ?, ?)";

            KeyHolder keyHolder = new GeneratedKeyHolder();

            Double finalAmount = amount;
            java.sql.Date finalSqlDate = sqlDate;
            String finalRecurrenceType = recurrenceType;

            int rowsAffected = jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(insertExpenseSql, Statement.RETURN_GENERATED_KEYS);
                ps.setInt(1, userId);
                ps.setString(2, type);
                ps.setDouble(3, finalAmount);
                ps.setString(4, description);
                ps.setDate(5, finalSqlDate);
                ps.setString(6, finalRecurrenceType);
                return ps;
            }, keyHolder);

            if (rowsAffected > 0) {
                // Get the generated expense_id
                Number generatedId = null;
                Map<String, Object> keys = keyHolder.getKeys();
                if (keys != null && keys.containsKey("id")) {
                    generatedId = (Number) keys.get("id");
                }

                if (generatedId == null) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Failed to get generated expense ID");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
                }

                int expenseId = generatedId.intValue();

                // If it's a recurring expense, update recurrence_parent with its own ID
                if (isRecurring && recurrenceType != null && !recurrenceType.isEmpty()) {
                    String updateRecurrenceParentSql = "UPDATE expense SET recurrence_parent = ? WHERE id = ?";
                    jdbcTemplate.update(updateRecurrenceParentSql, expenseId, expenseId);
                }

                // Return success response with expense_id
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("expense_id", expenseId);
                response.put("message", "Expense added successfully");

                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Failed to insert expense");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            }

        } catch (Exception e) {
            logger.error("Error adding expense: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/user/add-income")
    public ResponseEntity<Map<String, Object>> addIncome(@RequestBody Map<String, Object> incomeData) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            int userId = Integer.parseInt(auth.getName());

            if (userId == 0) {
                logger.debug("Failed to get user id in /user/add-income");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Unauthorized user");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            // Log the incoming data for debugging
            logger.debug("Received income data: " + incomeData.toString());

            // Extract and validate income data from request body
            String type = incomeData.get("type") != null ? incomeData.get("type").toString() : null;
            String title = incomeData.get("title") != null ? incomeData.get("title").toString() : null;
            String date = incomeData.get("date") != null ? incomeData.get("date").toString() : null;

            // Parse amount safely
            Double amount = null;
            if (incomeData.get("amount") != null) {
                try {
                    amount = Double.parseDouble(incomeData.get("amount").toString());
                } catch (NumberFormatException e) {
                    logger.error("Invalid amount format: " + incomeData.get("amount"));
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Invalid amount format");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }

            // Parse profit safely
            Double profit = null;
            if (incomeData.get("profit") != null) {
                try {
                    profit = Double.parseDouble(incomeData.get("profit").toString());
                } catch (NumberFormatException e) {
                    logger.error("Invalid profit format: " + incomeData.get("profit"));
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Invalid profit format");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }

            // Parse exempted_amount safely
            Double exemptedAmount = null;
            if (incomeData.get("exempted_amount") != null) {
                try {
                    exemptedAmount = Double.parseDouble(incomeData.get("exempted_amount").toString());
                } catch (NumberFormatException e) {
                    logger.error("Invalid exempted_amount format: " + incomeData.get("exempted_amount"));
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Invalid exempted amount format");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }

            // Parse boolean values safely
            Boolean isRecurring = false;
            if (incomeData.get("isRecurring") != null) {
                isRecurring = Boolean.parseBoolean(incomeData.get("isRecurring").toString());
            }

            String recurrenceType = null;
            // Only extract recurrenceType if isRecurring is true
            if (isRecurring) {
                recurrenceType = incomeData.get("recurrenceType") != null ? incomeData.get("recurrenceType").toString() : null;
            }

            // Determine if it's salary based on type
            Boolean isSalary = type != null && type.equalsIgnoreCase("Salary");

            // Parse date string to SQL Date
            java.sql.Date sqlDate = null;
            if (date != null) {
                try {
                    // Assuming date format is YYYY-MM-DD, adjust format if needed
                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                    java.util.Date utilDate = dateFormat.parse(date);
                    sqlDate = new java.sql.Date(utilDate.getTime());
                } catch (ParseException e) {
                    logger.error("Invalid date format: " + date);
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Invalid date format. Expected: YYYY-MM-DD");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }

            // Validate required fields
            if (type == null || amount == null || title == null || sqlDate == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Missing required fields");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Insert into income table
            String insertIncomeSql = "INSERT INTO income (user_id, is_salary, type, title, date, recurrence, amount, profit, exempted_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

            KeyHolder keyHolder = new GeneratedKeyHolder();

            Double finalAmount = amount;
            Double finalProfit = profit;
            Double finalExemptedAmount = exemptedAmount;
            java.sql.Date finalSqlDate = sqlDate;
            String finalRecurrenceType = recurrenceType;
            Boolean finalIsSalary = isSalary;

            int rowsAffected = jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(insertIncomeSql, Statement.RETURN_GENERATED_KEYS);
                ps.setInt(1, userId);
                ps.setBoolean(2, finalIsSalary);
                ps.setString(3, type);
                ps.setString(4, title);
                ps.setDate(5, finalSqlDate);
                ps.setString(6, finalRecurrenceType);
                ps.setDouble(7, finalAmount);
                if (finalProfit != null) {
                    ps.setDouble(8, finalProfit);
                } else {
                    ps.setNull(8, java.sql.Types.DOUBLE);
                }
                if (finalExemptedAmount != null) {
                    ps.setDouble(9, finalExemptedAmount);
                } else {
                    ps.setNull(9, java.sql.Types.DOUBLE);
                }
                return ps;
            }, keyHolder);

            if (rowsAffected > 0) {
                // Get the generated income_id
                Number generatedId = null;
                Map<String, Object> keys = keyHolder.getKeys();
                if (keys != null && keys.containsKey("id")) {
                    generatedId = (Number) keys.get("id");
                }

                if (generatedId == null) {
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Failed to get generated income ID");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
                }

                int incomeId = generatedId.intValue();

                // Return success response with income_id
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("income_id", incomeId);
                response.put("message", "Income added successfully");

                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Failed to insert income");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            }

        } catch (Exception e) {
            logger.error("Error adding income: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/user/edit-expense")
    public ResponseEntity<?> editExpense(@RequestBody Map<String, Object> request) {
        try {
            // Extract data from request
            Integer id = (Integer) request.get("id");
            String type = (String) request.get("type");
            Double amount = Double.valueOf(request.get("amount").toString());
            String description = (String) request.get("description");
//            String date = (String) request.get("date");
            Boolean isRecurring = (Boolean) request.get("isRecurring");
            String recurrenceType = null;

            // In your backend controller
            String dateString = (String) request.get("date");
            java.sql.Date date = java.sql.Date.valueOf(dateString); // Converts "2025-07-07" to SQL Date

            // Only extract recurrenceType if isRecurring is true
            if (isRecurring != null && isRecurring) {
                recurrenceType = (String) request.get("recurrenceType");
            }

            System.out.println(id + type + amount + description + date + isRecurring + recurrenceType);
            // Special handling when changing from recurring to non-recurring
            if (isRecurring != null && !isRecurring) {
                // Check the current recurrence_parent before updating
                String checkParentQuery = "SELECT recurrence_parent FROM expense WHERE id = ?";
                try {
                    Integer currentRecurrenceParent = jdbcTemplate.queryForObject(checkParentQuery, Integer.class, id);

                    if (currentRecurrenceParent != null) {
                        // Set recurrence to null for the parent record
                        String updateParentQuery = "UPDATE expense SET recurrence = NULL WHERE id = ?";
                        jdbcTemplate.update(updateParentQuery, currentRecurrenceParent);
                    }
                } catch (Exception e) {
                    // Handle case where query returns null
                    logger.debug("No recurrence_parent found for expense id: " + id);
                }
            }



            // Update expense in database
            String updateQuery = "UPDATE expense SET type = ?, amount = ?, description = ?, date = ?, recurrence = ?, recurrence_parent = ? WHERE id = ?";

            // Set recurrence_parent to the expense ID itself if it's recurring, otherwise null
            Integer recurrenceParent = (isRecurring != null && isRecurring && recurrenceType != null) ? id : null;

            System.out.println(id + type + amount + description + date + isRecurring + recurrenceType + recurrenceParent);
            int rowsUpdated = jdbcTemplate.update(updateQuery, type, amount, description, date, recurrenceType, recurrenceParent, id);

            if (rowsUpdated > 0) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Expense updated successfully"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Expense not found or no changes made"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update expense: " + e.getMessage()));
        }
    }

    @PostMapping("/user/delete-expense")
    public ResponseEntity<?> deleteExpense(@RequestBody Map<String, Object> request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            int userId = Integer.parseInt(auth.getName());

            if (userId == 0) {
                logger.debug("Failed to get user id in /user/delete-expense");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Unauthorized user"));
            }

            // Extract expense ID from request
            Integer expenseId = (Integer) request.get("id");

            // Validate required fields
            if (expenseId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing expense ID"));
            }


            // Delete the expense
            String deleteQuery = "DELETE FROM expense WHERE id = ?";
            int rowsDeleted = jdbcTemplate.update(deleteQuery, expenseId);

            if (rowsDeleted > 0) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Expense deleted successfully"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Failed to delete expense"));
            }

        } catch (Exception e) {
            logger.error("Error deleting expense: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete expense: " + e.getMessage()));
        }
    }

    @GetMapping("/user/income")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getUserExpenseList() {
        String sql;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int id = Integer.parseInt(auth.getName());

        if (id != 0) {
            try{
                sql = "SELECT * FROM income WHERE user_id=? ORDER BY date DESC";
                return jdbcTemplate.queryForList(sql, id);
            }catch(Exception e){
                System.out.println(e);
                return null;
            }
        } else {
            return null;
        }
    }

    @PostMapping("/user/edit-income")
    public ResponseEntity<Map<String, Object>> editIncome(@RequestBody Map<String, Object> incomeData) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            int userId = Integer.parseInt(auth.getName());

            if (userId == 0) {
                logger.debug("Failed to get user id in /user/edit-income");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Unauthorized user");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            // Log the incoming data for debugging
            logger.debug("Received income data for edit: " + incomeData.toString());

            // Extract and validate income ID (required for update)
            Integer incomeId = null;
            if (incomeData.get("id") != null) {
                try {
                    incomeId = Integer.parseInt(incomeData.get("id").toString());
                } catch (NumberFormatException e) {
                    logger.error("Invalid income ID format: " + incomeData.get("id"));
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Invalid income ID format");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }

            if (incomeId == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Income ID is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Extract and validate income data from request body
            String type = incomeData.get("type") != null ? incomeData.get("type").toString() : null;
            String title = incomeData.get("title") != null ? incomeData.get("title").toString() : null;
            String date = incomeData.get("date") != null ? incomeData.get("date").toString() : null;

            // Parse amount safely
            Double amount = null;
            if (incomeData.get("amount") != null) {
                try {
                    amount = Double.parseDouble(incomeData.get("amount").toString());
                } catch (NumberFormatException e) {
                    logger.error("Invalid amount format: " + incomeData.get("amount"));
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Invalid amount format");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }

            // Parse profit safely
            Double profit = null;
            if (incomeData.get("profit") != null) {
                try {
                    profit = Double.parseDouble(incomeData.get("profit").toString());
                } catch (NumberFormatException e) {
                    logger.error("Invalid profit format: " + incomeData.get("profit"));
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Invalid profit format");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }

            // Parse exempted_amount safely
            Double exemptedAmount = null;
            if (incomeData.get("exempted_amount") != null) {
                try {
                    exemptedAmount = Double.parseDouble(incomeData.get("exempted_amount").toString());
                } catch (NumberFormatException e) {
                    logger.error("Invalid exempted_amount format: " + incomeData.get("exempted_amount"));
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Invalid exempted amount format");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }

            // Parse boolean values safely
            Boolean isRecurring = false;
            if (incomeData.get("isRecurring") != null) {
                isRecurring = Boolean.parseBoolean(incomeData.get("isRecurring").toString());
            }

            String recurrenceType = null;
            // Only extract recurrenceType if isRecurring is true
            if (isRecurring) {
                recurrenceType = incomeData.get("recurrenceType") != null ? incomeData.get("recurrenceType").toString() : null;
            }

            // Determine if it's salary based on type
            Boolean isSalary = type != null && type.equalsIgnoreCase("Salary");

            // Parse date string to SQL Date
            java.sql.Date sqlDate = null;
            if (date != null) {
                try {
                    // Assuming date format is YYYY-MM-DD, adjust format if needed
                    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                    java.util.Date utilDate = dateFormat.parse(date);
                    sqlDate = new java.sql.Date(utilDate.getTime());
                } catch (ParseException e) {
                    logger.error("Invalid date format: " + date);
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Invalid date format. Expected: YYYY-MM-DD");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }

            // Validate required fields
            if (type == null || amount == null || title == null || sqlDate == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Missing required fields");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // First, check if the income exists and belongs to the user
            String checkIncomeSql = "SELECT COUNT(*) FROM income WHERE id = ? AND user_id = ?";
            int count = jdbcTemplate.queryForObject(checkIncomeSql, Integer.class, incomeId, userId);

            if (count == 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Income not found or access denied");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }

            // Update the income record
            String updateIncomeSql = "UPDATE income SET is_salary = ?, type = ?, title = ?, date = ?, recurrence = ?, amount = ?, profit = ?, exempted_amount = ? WHERE id = ? AND user_id = ?";

            Double finalAmount = amount;
            Double finalProfit = profit;
            Double finalExemptedAmount = exemptedAmount;
            java.sql.Date finalSqlDate = sqlDate;
            String finalRecurrenceType = recurrenceType;
            Boolean finalIsSalary = isSalary;
            Integer finalIncomeId = incomeId;

            int rowsAffected = jdbcTemplate.update(updateIncomeSql,
                    finalIsSalary,
                    type,
                    title,
                    finalSqlDate,
                    finalRecurrenceType,
                    finalAmount,
                    finalProfit,
                    finalExemptedAmount,
                    finalIncomeId,
                    userId
            );

            if (rowsAffected > 0) {
                // Return success response
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("income_id", incomeId);
                response.put("message", "Income updated successfully");

                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Failed to update income");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            }

        } catch (Exception e) {
            logger.error("Error editing income: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/user/delete-income")
    public ResponseEntity<Map<String, Object>> deleteIncome(@RequestBody Map<String, Object> requestData) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            int userId = Integer.parseInt(auth.getName());

            if (userId == 0) {
                logger.debug("Failed to get user id in /user/delete-income");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Unauthorized user");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            // Log the incoming data for debugging
            logger.debug("Received delete income request: " + requestData.toString());

            // Extract and validate income ID (required for deletion)
            Integer incomeId = null;
            if (requestData.get("id") != null) {
                try {
                    incomeId = Integer.parseInt(requestData.get("id").toString());
                } catch (NumberFormatException e) {
                    logger.error("Invalid income ID format: " + requestData.get("id"));
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Invalid income ID format");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }

            if (incomeId == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Income ID is required");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // First, check if the income exists and belongs to the user
            String checkIncomeSql = "SELECT COUNT(*) FROM income WHERE id = ? AND user_id = ?";
            int count = jdbcTemplate.queryForObject(checkIncomeSql, Integer.class, incomeId, userId);

            if (count == 0) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Income not found or access denied");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }

            // Delete the income record
            String deleteIncomeSql = "DELETE FROM income WHERE id = ? AND user_id = ?";
            int rowsAffected = jdbcTemplate.update(deleteIncomeSql, incomeId, userId);

            if (rowsAffected > 0) {
                // Return success response
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("income_id", incomeId);
                response.put("message", "Income deleted successfully");

                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Failed to delete income");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
            }

        } catch (Exception e) {
            logger.error("Error deleting income: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/user/tax-estimation")
    public ResponseEntity<Map<String, Object>> calculateTaxEstimation(@RequestBody Map<String, Object> requestData) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            int userId = Integer.parseInt(auth.getName());

            if (userId == 0) {
                logger.debug("Failed to get user id in /user/tax-estimation");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Unauthorized user");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            // Log the incoming data for debugging
            logger.debug("Received tax estimation request: " + requestData.toString());

            // Extract inputs from payload
            Double expectedNonRecurringIncome = 0.0;
            if (requestData.get("expectedNonRecurringIncome") != null) {
                try {
                    expectedNonRecurringIncome = Double.parseDouble(requestData.get("expectedNonRecurringIncome").toString());
                } catch (NumberFormatException e) {
                    logger.error("Invalid expectedNonRecurringIncome format: " + requestData.get("expectedNonRecurringIncome"));
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Invalid expected non-recurring income format");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }

            Double bonusAmount = 0.0;
            if (requestData.get("bonusAmount") != null) {
                try {
                    bonusAmount = Double.parseDouble(requestData.get("bonusAmount").toString());
                } catch (NumberFormatException e) {
                    logger.error("Invalid bonusAmount format: " + requestData.get("bonusAmount"));
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Invalid bonus amount format");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }

            Integer numberOfBonus = 0;
            if (requestData.get("numberOfBonus") != null) {
                try {
                    numberOfBonus = Integer.parseInt(requestData.get("numberOfBonus").toString());
                } catch (NumberFormatException e) {
                    logger.error("Invalid numberOfBonus format: " + requestData.get("numberOfBonus"));
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Invalid number of bonus format");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }

            Double makeMoreInvestment = 0.0;
            if (requestData.get("makeMoreInvestment") != null) {
                try {
                    makeMoreInvestment = Double.parseDouble(requestData.get("makeMoreInvestment").toString());
                } catch (NumberFormatException e) {
                    logger.error("Invalid makeMoreInvestment format: " + requestData.get("makeMoreInvestment"));
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("success", false);
                    errorResponse.put("message", "Invalid investment amount format");
                    return ResponseEntity.badRequest().body(errorResponse);
                }
            }

            // 1. Calculate dates - tax year starts from July 1
            LocalDate currentDate = LocalDate.now();
            LocalDate taxYearStart;
            LocalDate taxYearEnd;

            if (currentDate.getMonthValue() >= 7) {
                // Current tax year: July 1 this year to June 30 next year
                taxYearStart = LocalDate.of(currentDate.getYear(), 7, 1);
                taxYearEnd = LocalDate.of(currentDate.getYear() + 1, 6, 30);
            } else {
                // Current tax year: July 1 last year to June 30 this year
                taxYearStart = LocalDate.of(currentDate.getYear() - 1, 7, 1);
                taxYearEnd = LocalDate.of(currentDate.getYear(), 6, 30);
            }

            // 2. Calculate total income where recurrence = null from July 1
            String nonRecurringIncomeSql = "SELECT COALESCE(SUM(amount), 0) FROM income WHERE user_id = ? AND recurrence IS NULL AND date >= ?";
            Double totalNonRecurringIncome = jdbcTemplate.queryForObject(nonRecurringIncomeSql, Double.class, userId, java.sql.Date.valueOf(taxYearStart));
            if (totalNonRecurringIncome == null) {
                totalNonRecurringIncome = 0.0;
            }

            // 4. Add expectedNonRecurringIncome to get total non-recurring income
            Double nonRecurringIncome = totalNonRecurringIncome + expectedNonRecurringIncome;

            // 5. Calculate total income where recurrence != null from July 1
            String recurringIncomeSql = "SELECT amount, recurrence FROM income WHERE user_id = ? AND recurrence IS NOT NULL AND date >= ?";
            List<Map<String, Object>> recurringIncomes = jdbcTemplate.queryForList(recurringIncomeSql, userId, java.sql.Date.valueOf(taxYearStart));

            Double totalRecurringIncome = 0.0;

            // 6. Calculate recurring income based on recurrence type
            for (Map<String, Object> income : recurringIncomes) {
                Double amount = income.get("amount") != null ? Double.parseDouble(income.get("amount").toString()) : 0.0;
                String recurrence = income.get("recurrence") != null ? income.get("recurrence").toString() : "";

                if ("daily".equalsIgnoreCase(recurrence)) {
                    // Calculate days remaining until next June 30th
                    long daysRemaining = ChronoUnit.DAYS.between(currentDate, taxYearEnd) + 1;
                    totalRecurringIncome += amount * daysRemaining;
                } else if ("monthly".equalsIgnoreCase(recurrence)) {
                    // Calculate months remaining until next June 30th
                    long monthsRemaining = ChronoUnit.MONTHS.between(currentDate.withDayOfMonth(1), taxYearEnd.withDayOfMonth(1)) + 1;
                    totalRecurringIncome += amount * monthsRemaining;
                } else if ("annual".equalsIgnoreCase(recurrence) || "yearly".equalsIgnoreCase(recurrence)) {
                    // Annual income, add full amount
                    totalRecurringIncome += amount;
                }
            }

            // 7. Calculate total Income
            Double totalBonusAmount = bonusAmount * numberOfBonus;
            Double totalIncome = nonRecurringIncome + totalRecurringIncome + totalBonusAmount;

            // 8. Set investment amount
            Double investment = makeMoreInvestment;

            //ff, female, disabled
            Boolean priviledged[] = {false, false, false, false};

            String sqlPriv = " select is_ff, is_female, is_disabled from user_tax_info where id = ?";

            List<Map<String, Object>> temp;
            List<Map<String, Object>> privs = List.of();


            temp= jdbcTemplate.queryForList(sqlPriv, userId);

            for (Map<String, Object> i : temp){
                //System.out.println(i);
                //System.out.println(i.get("user_id"));
                priviledged[0] = i.get("is_ff").toString() == "true";
                priviledged[1] = i.get("is_female").toString() == "true";
                priviledged[2] = i.get("is_disabled").toString() == "true";
//                if ()
//                System.out.println(priviledged[0].toString() + priviledged[1].toString() + priviledged[2].toString());
            }

            String category = "regular";

            if (priviledged[0]) category = "ff";
            else if (priviledged[2]) category= "disabled";
            else if (priviledged[3]) category = "female";
            else if (isElderly(userId)) category = "elderly";


            // 9. Calculate tax and rebate
            Map<String, Double> taxCalculation = calculateTaxAndRebate(totalIncome, investment, category);
            Double totalTax = taxCalculation.get("totalTax");
            Double rebateAmount = taxCalculation.get("rebateAmount");

            // 10. Get user's tax area
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
                minTax = 0.0;
            }


            // Calculate estimated tax
            Double estimatedTax = Math.max(minTax, totalTax - rebateAmount);

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", Map.of(
                    "income", totalIncome,
                    "investment", investment,
                    "rebate", rebateAmount,
                    "calculatedTax", totalTax,
                    "minimumTaxForZone", minTax,
                    "estimatedTax", estimatedTax
            ));
            response.put("message", "Tax estimation calculated successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error calculating tax estimation: ", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    private Boolean isElderly(int userID){
        String sqlPriv = " select dob from user_info where id = ?";

        List<Map<String, Object>> temp;


        temp= jdbcTemplate.queryForList(sqlPriv, userID);
        String dob = null;
        for (Map<String, Object> i : temp){
            dob = i.get("dob").toString();
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate date = LocalDate.parse(dob, formatter);
        LocalDate today = LocalDate.now();
        int age = Period.between(date, today).getYears();


        return age>65;


    }
    // Helper method to calculate tax and rebate
    private Map<String, Double> calculateTaxAndRebate(Double income, Double investment, String category) {
        Map<String, Double> result = new HashMap<>();

        // Calculate tax based on Bangladesh tax slabs (2024-25)
        Double tax = calculateTax(income, category);

        // Calculate rebate based on investment (assuming 15% rebate on investment up to certain limit)
        Double rebate = 0.0;
//        Double maxRebateableInvestment = Math.min(investment, income * 0.25); // Max 25% of income
        rebate = Math.min (investment, income*0.03) * 0.15; // 15% rebate

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



    @PostMapping("/user/tax-zones-by-area")
    public List<Map<String, Object>> getTaxArea(@RequestBody Map<String, Object> request) {

        String area = request.get("area_name")!= null ? request.get("area_name").toString() : null ;
        String sql;
        try{
            sql = "select distinct zone_no from rule_tax_area_list where area_name = ? order by zone_no;";

            return jdbcTemplate.queryForList(sql, area);
            // Return success response with expense_id

        } catch(Exception e){
            System.out.println(e);
            return null;
        }
    }

    @PostMapping("/user/tax-circle-by-zone")
    public List<Map<String, Object>> getTaxCircle(@RequestBody Map<String, Object> request) {

        int zone = request.get("tax_zone")!= null ? Integer.parseInt(request.get("tax_zone").toString()): null ;
        String sql;
        try{
            sql = "select distinct circle_no from rule_tax_area_list where zone_no = ? order by circle_no;";

            return jdbcTemplate.queryForList(sql, zone);
            // Return success response with expense_id

        } catch(Exception e){
            System.out.println(e);
            return null;
        }
    }

    @GetMapping("/user/cars")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getUserCarList() {
        String sql;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int id = Integer.parseInt(auth.getName());

        if (id != 0) {
            try{
                sql = "SELECT * FROM asset_car WHERE user_id=? ";
                return jdbcTemplate.queryForList(sql, id);
            } catch (Exception e) {
                System.out.println(e);
                return null;
            }
        } else {
            return null;
        }
    }

    @GetMapping("/user/flats")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getUserFlats() {
        String sql;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int id = Integer.parseInt(auth.getName());

        if (id != 0) {
            try{
                sql = "SELECT * FROM asset_flat WHERE user_id=?";
                return jdbcTemplate.queryForList(sql, id);
            } catch (Exception e) {
                System.out.println(e);
                return null;
            }
        } else {
            return null;
        }
    }

    @GetMapping("/user/jewellery")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getUserJewelleryList() {
        String sql;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int id = Integer.parseInt(auth.getName());

        if (id != 0) {
            try{
                sql = "SELECT * FROM asset_jewelery WHERE user_id=?";
                return jdbcTemplate.queryForList(sql, id);
            } catch (Exception e) {
                System.out.println(e);
                return null;
            }
        } else {
            return null;
        }
    }

    @GetMapping("/user/plots")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getUserPlotList() {
        String sql;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int id = Integer.parseInt(auth.getName());

        if (id != 0) {
            try{
                sql = "SELECT * FROM asset_plot WHERE user_id=?";
                return jdbcTemplate.queryForList(sql, id);
            } catch (Exception e) {
                System.out.println(e);
                return null;
            }
        } else {
            return null;
        }
    }

    @GetMapping("/user/bank-accounts")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getUserBankList() {
        String sql;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int id = Integer.parseInt(auth.getName());

        if (id != 0) {
            try{
                sql = "SELECT * FROM asset_bank_account WHERE user_id=?";
                return jdbcTemplate.queryForList(sql, id);
            } catch (Exception e) {
                System.out.println(e);
                return null;
            }
        } else {
            return null;
        }
    }

}