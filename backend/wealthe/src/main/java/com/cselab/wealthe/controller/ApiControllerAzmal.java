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

            String recurrenceType = expenseData.get("recurrenceType") != null ? expenseData.get("recurrenceType").toString() : null;

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

            // Insert into expense table
            String insertExpenseSql = "INSERT INTO expense (user_id, type, amount, description, date) VALUES (?, ?, ?, ?, ?)";

            KeyHolder keyHolder = new GeneratedKeyHolder();

            Double finalAmount = amount;
            java.sql.Date finalSqlDate = sqlDate;
            int rowsAffected = jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(insertExpenseSql, Statement.RETURN_GENERATED_KEYS);
                ps.setInt(1, userId);
                ps.setString(2, type);
                ps.setDouble(3, finalAmount);
                ps.setString(4, description);
                ps.setDate(5, finalSqlDate);
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

                // If it's a recurring expense, insert into recurring_expense table
                if (isRecurring && recurrenceType != null && !recurrenceType.isEmpty()) {
                    String insertRecurringSql = "INSERT INTO recurring_expense (expense_id, date, type) VALUES (?, ?, ?)";
                    jdbcTemplate.update(insertRecurringSql, expenseId, sqlDate, recurrenceType);
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

}