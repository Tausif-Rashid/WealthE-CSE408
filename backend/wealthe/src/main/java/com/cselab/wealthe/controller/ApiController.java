package com.cselab.wealthe.controller;

import com.cselab.wealthe.service.FetchPdfDataService;
import com.cselab.wealthe.util.JwtUtil;
import com.cselab.wealthe.service.PdfService;

// For EmptyResultDataAccessException
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import java.util.ArrayList;
import java.util.HashMap;

import java.util.List;
import java.util.Map;
import java.io.File;

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
    private PdfService pdfService;

    @Autowired
    private FetchPdfDataService fetchPdfDataService;

    @Autowired
    private static final Logger logger = LoggerFactory.getLogger(ApiController.class);

    @GetMapping("/user/previous-data")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getPreviousMonthsData() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        List<Map<String, Object>> response = new ArrayList<>();

        try {
            int userId = Integer.parseInt(auth.getName());

            if (userId == 0) {
                logger.debug("Failed to get user id in /user/previous-data");
                return response;
            }

            // Combined query to get both income and expense data with proper ordering
            String combinedSql = "WITH months AS (" +
                    "  SELECT DISTINCT " +
                    "    EXTRACT(YEAR FROM date) as year_num, " +
                    "    EXTRACT(MONTH FROM date) as month_num, " +
                    "    TO_CHAR(date, 'Month') as month_name " +
                    "  FROM (SELECT date FROM income WHERE user_id = ? AND date >= CURRENT_DATE - INTERVAL '4 months' " +
                    "        UNION " +
                    "        SELECT date FROM expense WHERE user_id = ? AND date >= CURRENT_DATE - INTERVAL '4 months') t " +
                    "), " +
                    "income_data AS (" +
                    "  SELECT " +
                    "    EXTRACT(YEAR FROM date) as year_num, " +
                    "    EXTRACT(MONTH FROM date) as month_num, " +
                    "    SUM(amount) as total_income " +
                    "  FROM income " +
                    "  WHERE user_id = ? AND date >= CURRENT_DATE - INTERVAL '4 months' " +
                    "  GROUP BY EXTRACT(YEAR FROM date), EXTRACT(MONTH FROM date) " +
                    "), " +
                    "expense_data AS (" +
                    "  SELECT " +
                    "    EXTRACT(YEAR FROM date) as year_num, " +
                    "    EXTRACT(MONTH FROM date) as month_num, " +
                    "    SUM(amount) as total_expense " +
                    "  FROM expense " +
                    "  WHERE user_id = ? AND date >= CURRENT_DATE - INTERVAL '4 months' " +
                    "  GROUP BY EXTRACT(YEAR FROM date), EXTRACT(MONTH FROM date) " +
                    ") " +
                    "SELECT " +
                    "  m.month_name as month, " +
                    "  COALESCE(i.total_income, 0) as income, " +
                    "  COALESCE(e.total_expense, 0) as expense " +
                    "FROM months m " +
                    "LEFT JOIN income_data i ON m.year_num = i.year_num AND m.month_num = i.month_num " +
                    "LEFT JOIN expense_data e ON m.year_num = e.year_num AND m.month_num = e.month_num " +
                    "ORDER BY m.year_num, m.month_num";

            response = jdbcTemplate.queryForList(combinedSql, userId, userId, userId, userId);

            // Clean up month names (remove extra spaces)
            for (Map<String, Object> monthData : response) {
                String month = monthData.get("month").toString().trim();
                monthData.put("month", month);
            }

            return response;

        } catch (Exception e) {
            System.out.println("Error occurred: " + e);
            e.printStackTrace();
            logger.error("Failed to retrieve previous months data: " + e.getMessage());
            return response;
        }
    }

    @GetMapping("/user/monthly-income")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getMonthlyIncomeByType() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int userId = Integer.parseInt(auth.getName());

        if (userId != 0) {
            String sql = "SELECT type, SUM(amount) as total_income " +
                    "FROM income " +
                    "WHERE user_id = ? " +
                    "AND date >= DATE_TRUNC('month', CURRENT_DATE) " +
                    "AND date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' " +
                    "GROUP BY type " +
                    "ORDER BY total_income DESC";

            return jdbcTemplate.queryForList(sql, userId);
        }

        logger.debug("Failed to get user id in /user/monthly-income-by-type");
        return null;
    }

    @GetMapping("/user/monthly-expense")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getMonthlyExpenseByType() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int userId = Integer.parseInt(auth.getName());

        if (userId != 0) {
            String sql = "SELECT type, SUM(amount) as total_expense " +
                    "FROM expense " +
                    "WHERE user_id = ? " +
                    "AND date >= DATE_TRUNC('month', CURRENT_DATE) " +
                    "AND date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' " +
                    "GROUP BY type " +
                    "ORDER BY total_expense DESC";

            return jdbcTemplate.queryForList(sql, userId);
        }

        logger.debug("Failed to get user id in /user/monthly-expense-by-type");
        return null;
    }

    @GetMapping("/user/info")
    public List<Map<String, Object>> getUserInfo() { //Returns an array of user object with 1 element
        String sql;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int id = Integer.parseInt(auth.getName());

//        FetchPdfDataService.TaxFormData data = fetchPdfDataService.fetchAllTaxFormData(id);
//        System.out.println(data.toString());

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

    @GetMapping("/user/investment")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getUserInvestmentList() {
        String sql;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        int id = Integer.parseInt(auth.getName());

        if (id != 0) {
            try{
                sql = "SELECT * FROM investment WHERE user_id=? ORDER BY date DESC";
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

    @GetMapping("/user/generate-pdf")
    @CrossOrigin(origins = "*")
    public ResponseEntity<Map<String, Object>> generateTaxFormPdf() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String filePath = pdfService.generateTaxFormPdf();
            
            response.put("success", true);
            response.put("message", "Tax Form PDF generated successfully");
            response.put("filePath", filePath);
            response.put("fileName", filePath.substring(filePath.lastIndexOf(System.getProperty("file.separator")) + 1));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error generating Tax Form PDF: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to generate Tax Form PDF: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/user/tax-submissions")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getTaxSubmissions() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            int userId = Integer.parseInt(auth.getName());
            
            String sql = "SELECT id, date, done_submit FROM tax_form_table WHERE user_id = ? ORDER BY date DESC";
            return jdbcTemplate.queryForList(sql, userId);
            
        } catch (Exception e) {
            logger.error("Error fetching tax submissions: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    @PostMapping("/user/generate-tax-pdf")
    @CrossOrigin(origins = "*")
    public ResponseEntity<Map<String, Object>> generateTaxPdf(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            int userId = Integer.parseInt(auth.getName());
            
            // Extract submission ID from request body
            Integer submissionId = (Integer) request.get("submissionId");
            if (submissionId == null) {
                response.put("success", false);
                response.put("message", "Submission ID is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Verify the submission belongs to the user
            String verifySql = "SELECT id FROM tax_form_table WHERE id = ? AND user_id = ?";
            List<Map<String, Object>> result = jdbcTemplate.queryForList(verifySql, submissionId, userId);


            
            if (result.isEmpty()) {
                response.put("success", false);
                response.put("message", "Submission not found or access denied");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }
            
            // Generate filename: user_id + submission_id + return.pdf
            String filename = userId + "_" + submissionId + "_return.pdf";
            String filePath = "generated_pdfs" + System.getProperty("file.separator") + filename;
            
            // Check if file already exists
            File existingFile = new File(filePath);
            if (existingFile.exists()) {
                response.put("success", true);
                response.put("message", "PDF already exists");
                response.put("fileName", filename);
                return ResponseEntity.ok(response);
            }
            
            // Generate PDF using the existing service
            String generatedFilePath = pdfService.generateTaxFormPdfForSubmission(submissionId);
            
            response.put("success", true);
            response.put("message", "PDF generated successfully");
            response.put("fileName", filename);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error generating tax PDF: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to generate PDF: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/user/download-pdf/{fileName}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<Resource> downloadPdf(@PathVariable String fileName) {
        try {
            // Security check: ensure the user can only access their own files
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            int userId = Integer.parseInt(auth.getName());
            
            // Validate filename contains user ID for security
            if (!fileName.contains("tax_form_" + userId + "_") && !fileName.contains("user_info_" + userId + "_") && !fileName.contains(userId + "_")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            File file = new File("generated_pdfs" + System.getProperty("file.separator") + fileName);
            
            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }
            
            Resource resource = new FileSystemResource(file);
            
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"");
            headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE);
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(file.length())
                    .body(resource);
                    
        } catch (Exception e) {
            logger.error("Error downloading PDF: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}