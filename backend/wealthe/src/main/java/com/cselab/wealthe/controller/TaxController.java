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

            // Build response object
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
}