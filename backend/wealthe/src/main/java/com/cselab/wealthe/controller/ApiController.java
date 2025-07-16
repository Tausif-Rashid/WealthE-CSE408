package com.cselab.wealthe.controller;

import com.cselab.wealthe.util.JwtUtil;

// For EmptyResultDataAccessException
import org.springframework.dao.EmptyResultDataAccessException;

//import java.util.logging.Logger;

//import org.slf4j.LoggerFactory;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.HashMap;

import java.util.List;
import java.util.Map;

@RestController
public class ApiController {

    @Autowired
    private JwtUtil jwtUtil;

    // Add this field in your controller class
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private static final Logger logger = LoggerFactory.getLogger(ApiController.class);


    @GetMapping("/user/info")
    public List<Map<String, Object>> getUserInfo() { //Returns an array of user object with 1 element
        String sql;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int id = Integer.parseInt(auth.getName());

        if (id != 0) {
            sql = "SELECT * FROM user_info WHERE id = ?";
            return jdbcTemplate.queryForList(sql, id);
        }
        logger.debug("failed to get id in /user/info");
        return null;
    }

    @GetMapping("/user/tax_info")
    public List<Map<String, Object>> getUserTaxInfo() {
        String sql;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int id = Integer.parseInt(auth.getName());

        if (id != 0) {
            //sql = "SELECT * FROM user_tax_info WHERE id = ?";
            sql = "SELECT user_tax_info.id, tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name, credentials.email\n" +
                    "FROM user_tax_info\n" +
                    "JOIN credentials ON user_tax_info.id = credentials.id WHERE user_tax_info.id = ?";
            return jdbcTemplate.queryForList(sql, id);
        }
        logger.debug("failed to get id in /user/tax_info");
        return null;
    }

    @GetMapping("/user/expense")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getUserExpenseList() {
        String sql;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int id = Integer.parseInt(auth.getName());

        if (id != 0) {
            try{
                sql = "SELECT * FROM expense WHERE user_id=? ORDER BY date DESC";
                return jdbcTemplate.queryForList(sql, id);
            } catch (Exception e) {
                System.out.println(e);
                return null;
            }
        } else {
            return null;
        }
    }

    @GetMapping("/areas")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getAreas(@RequestParam(required = false) String type) {
        String sql;
        if (type != null && !type.isEmpty()) {
            sql = "SELECT * FROM rule_tax_area_list WHERE area_name = ?";
            return jdbcTemplate.queryForList(sql, type);
        } else {
            sql = "SELECT * FROM rule_tax_area_list";
            return jdbcTemplate.queryForList(sql);
        }
    }

    @GetMapping("/data")
    public List<Map<String, Object>> getData(
            @RequestParam(required = false) String table,
            @RequestParam(required = false) String limit) {

        if (table == null || table.isEmpty()) {
            return List.of(Map.of("error", "Table parameter is required"));
        }

        // Basic SQL injection protection by allowing only alphanumeric table names
        if (!table.matches("^[a-zA-Z0-9_]+$")) {
            return List.of(Map.of("error", "Invalid table name"));
        }

        String sql = "SELECT * FROM " + table;

        if (limit != null && !limit.isEmpty() && limit.matches("^\\d+$")) {
            sql += " LIMIT " + limit;
        }

        try {
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e) {
            return List.of(Map.of("error", "Query failed: " + e.getMessage()));
        }
    }

    @PostMapping("/user/update-profile")
    @CrossOrigin(origins = "*")
    public ResponseEntity<Map<String, Object>> updateUserProfile(@RequestBody Map<String, Object> payload) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int userId = Integer.parseInt(auth.getName());
        System.out.println("user id: " + userId);

        Map<String, Object> response = new HashMap<>();

        if (userId != 0) {
            try {
                // Extract data from payload
                String areaName = (String) payload.get("area_name");
                String dobString = (String) payload.get("dob");

                // Convert date string to java.sql.Date with null check
                java.sql.Date dob = null;
                if (dobString != null && !dobString.trim().isEmpty()) {
                    try {
                        dob = java.sql.Date.valueOf(dobString);
                    } catch (IllegalArgumentException e) {
                        response.put("success", false);
                        response.put("message", "Invalid date format. Expected format: YYYY-MM-DD");
                        return ResponseEntity.badRequest().body(response);
                    }
                }

                String email = (String) payload.get("email");
                String name = (String) payload.get("name");
                String nid = (String) payload.get("nid");
                String phone = (String) payload.get("phone");
                String spouseName = (String) payload.get("spouse_name");
                String spouseTin = (String) payload.get("spouse_tin");

                // Handle integer values that might come as strings
                Integer taxCircle = null;
                Integer taxZone = null;

                try {
                    Object taxCircleObj = payload.get("tax_circle");
                    if (taxCircleObj instanceof Integer) {
                        taxCircle = (Integer) taxCircleObj;
                    } else if (taxCircleObj instanceof String) {
                        taxCircle = Integer.parseInt((String) taxCircleObj);
                    }

                    Object taxZoneObj = payload.get("tax_zone");
                    if (taxZoneObj instanceof Integer) {
                        taxZone = (Integer) taxZoneObj;
                    } else if (taxZoneObj instanceof String) {
                        taxZone = Integer.parseInt((String) taxZoneObj);
                    }
                } catch (NumberFormatException e) {
                    response.put("success", false);
                    response.put("message", "Invalid tax_circle or tax_zone format");
                    return ResponseEntity.badRequest().body(response);
                }

                String tin = (String) payload.get("tin");

                // Extract boolean values from payload
                Boolean isResident = (Boolean) payload.get("is_resident");
                Boolean isFf = (Boolean) payload.get("is_ff");
                Boolean isFemale = (Boolean) payload.get("is_female");
                Boolean isDisabled = (Boolean) payload.get("is_disabled");

                // Set default values if null
                if (isResident == null) isResident = false;
                if (isFf == null) isFf = false;
                if (isFemale == null) isFemale = false;
                if (isDisabled == null) isDisabled = false;

                // Update user_tax_info table
                String sqlTaxInfo = "UPDATE public.user_tax_info SET tin=?, is_resident=?, is_ff=?, is_female=?, is_disabled=?, tax_zone=?, tax_circle=?, area_name=? WHERE id=?";

                int taxInfoRows = jdbcTemplate.update(sqlTaxInfo,
                        tin,              // tin
                        isResident,       // is_resident (from payload)
                        isFf,             // is_ff (from payload)
                        isFemale,         // is_female (from payload)
                        isDisabled,       // is_disabled (from payload)
                        taxZone,          // tax_zone
                        taxCircle,        // tax_circle
                        areaName,         // area_name
                        userId            // WHERE condition
                );

                // Update user_info table
                String sqlUserInfo = "UPDATE public.user_info SET name=?, phone=?, nid=?, dob=?, spouse_name=?, spouse_tin=? WHERE id=?";

                int userInfoRows = jdbcTemplate.update(sqlUserInfo,
                        name,             // name
                        phone,            // phone
                        nid,              // nid
                        dob,              // dob (java.sql.Date object)
                        spouseName,       // spouse_name
                        spouseTin,        // spouse_tin
                        userId            // WHERE condition
                );

                // Check if updates were successful
                if (taxInfoRows > 0 && userInfoRows > 0) {
                    response.put("success", true);
                    response.put("message", "Profile updated successfully");
                    response.put("updated_records", taxInfoRows + userInfoRows);
                    return ResponseEntity.ok(response);
                } else {
                    response.put("success", false);
                    response.put("message", "No records updated. User may not exist.");
                    return ResponseEntity.badRequest().body(response);
                }

            } catch (Exception e) {
                System.out.println("Error updating profile: " + e.getMessage());
                e.printStackTrace();
                response.put("success", false);
                response.put("message", "Error updating profile: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } else {
            response.put("success", false);
            response.put("message", "User not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/user/change-password")
    @CrossOrigin(origins = "*")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody Map<String, Object> payload) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int userId = Integer.parseInt(auth.getName());
        System.out.println("user id: " + userId);

        Map<String, Object> response = new HashMap<>();

        if (userId != 0) {
            try {
                // Extract passwords from payload
                String currentPassword = (String) payload.get("currentPassword");
                String newPassword = (String) payload.get("newPassword");

                // Validate input
                if (currentPassword == null || currentPassword.trim().isEmpty()) {
                    response.put("success", false);
                    response.put("message", "Current password is required");
                    return ResponseEntity.badRequest().body(response);
                }

                if (newPassword == null || newPassword.trim().isEmpty()) {
                    response.put("success", false);
                    response.put("message", "New password is required");
                    return ResponseEntity.badRequest().body(response);
                }

                // First, get the current password hash from database
                String getCurrentPasswordSql = "SELECT password_hash FROM public.credentials WHERE id = ?";
                String currentPasswordHash;

                try {
                    currentPasswordHash = jdbcTemplate.queryForObject(getCurrentPasswordSql, String.class, userId);
                } catch (EmptyResultDataAccessException e) {
                    response.put("success", false);
                    response.put("message", "User credentials not found");
                    return ResponseEntity.badRequest().body(response);
                }

                // Verify current password
                if (!passwordEncoder.matches(currentPassword, currentPasswordHash)) {
                    response.put("success", false);
                    response.put("message", "Current password is incorrect");
                    return ResponseEntity.badRequest().body(response);
                }

                // Hash the new password
                String newPasswordHash = passwordEncoder.encode(newPassword);

                // Update password in database
                String updatePasswordSql = "UPDATE public.credentials SET password_hash = ? WHERE id = ?";

                int updatedRows = jdbcTemplate.update(updatePasswordSql, newPasswordHash, userId);

                if (updatedRows > 0) {
                    response.put("success", true);
                    response.put("message", "Password changed successfully");
                    return ResponseEntity.ok(response);
                } else {
                    response.put("success", false);
                    response.put("message", "Failed to update password");
                    return ResponseEntity.badRequest().body(response);
                }

            } catch (Exception e) {
                System.out.println("Error changing password: " + e.getMessage());
                e.printStackTrace();
                response.put("success", false);
                response.put("message", "Error changing password: " + e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } else {
            response.put("success", false);
            response.put("message", "User not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @GetMapping("/user/tax-area-list")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getTaxAreaListUser() {
        String sql;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        try{
            sql = "SELECT DISTINCT area_name from rule_tax_area_list \n;";
            return jdbcTemplate.queryForList(sql);
        }catch(Exception e){
            System.out.println("Error occured: " + e);
            return null;
        }


    }

}