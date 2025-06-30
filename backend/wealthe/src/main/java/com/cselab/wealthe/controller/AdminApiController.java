package com.cselab.wealthe.controller;

import com.cselab.wealthe.util.JwtUtil;

//import java.util.logging.Logger;

//import org.slf4j.LoggerFactory;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AdminApiController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final Logger logger = LoggerFactory.getLogger(AdminApiController.class);

    @GetMapping("/admin/total-users")
    public Map<String, Object> getTotalUsers() {
        try {
            String sql = "SELECT COUNT(*) as total FROM credentials WHERE role = 'user'";
            System.out.println("api called for admin total user");
            return jdbcTemplate.queryForMap(sql);
        } catch (Exception e) {
            logger.error("Failed to get total users count: " + e.getMessage());
            return Map.of("total", 0);
        }
    }

    @GetMapping("/admin/income-slabs")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getIncomeSlab() {
        String sql;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        try{
            sql = "SELECT id, category, slab_no, slab_length AS slab_size, tax_rate\n" +
                    "FROM rule_income ORDER BY ID\n";
            return jdbcTemplate.queryForList(sql);
        }catch(Exception e){
            System.out.println("Error occured: " + e);
            return null;
        }


    }

    @GetMapping("/admin/income-categories")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getIncomeCategories() {
        String sql;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        try{
            sql = "SELECT * FROM rule_income_category\n";
            return jdbcTemplate.queryForList(sql);
        }catch(Exception e){
            System.out.println("Error occured: " + e);
            return null;
        }


    }

    @GetMapping("/admin/expense-categories")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getExpenseCategories() {
        String sql;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        try{
            sql = "SELECT * FROM rule_expense_category\n";
            return jdbcTemplate.queryForList(sql);
        }catch(Exception e){
            System.out.println("Error occured: " + e);
            return null;
        }


    }

    @GetMapping("/admin/investment-categories")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getInvestmentType() {
        String sql;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        try{
            sql = "SELECT id, title, rate_rebate, \n" +
                    "       min_amount::numeric(20,2) AS minimum, \n" +
                    "       max_amount::numeric(20,2) AS maximum,\n" +
                    "       description \n" +
                    "FROM rule_investment_type ORDER BY id;\n";
            System.out.println("SQL successfully run");
            List<Map<String, Object>> temp = jdbcTemplate.queryForList(sql);
            System.out.println(temp);
            return temp;
        }catch(Exception e){
            System.out.println("Error occured: " + e);
            return null;
        }



    }

    @GetMapping("/admin/rebate-rules")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getRebateRules() {
        String sql;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        try{
            sql = "SELECT id, max_rebate_amount::numeric(20,2) AS maximum, max_of_income FROM rule_rebate";
            return jdbcTemplate.queryForList(sql);
        }catch(Exception e){
            System.out.println("Error occured: " + e);
            return null;
        }


    }

    @GetMapping("/admin/tax-area-list")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getTaxAreaList() {
        String sql;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        try{
            sql = "SELECT DISTINCT area_name from rule_tax_area_list \n" +
                    "EXCEPT SELECT area_name from rule_tax_zone_min_tax;";
            return jdbcTemplate.queryForList(sql);
        }catch(Exception e){
            System.out.println("Error occured: " + e);
            return null;
        }


    }

    @GetMapping("/admin/minimum-tax-list")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getMinimumTaxList() {
        String sql;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        try{
            sql = "SELECT id, area_name, min_amount::numeric(20,2) AS minimum FROM rule_tax_zone_min_tax";
            return jdbcTemplate.queryForList(sql);
        }catch(Exception e){
            System.out.println("Error occured: " + e);
            return null;
        }


    }

    @PostMapping("/admin/update-income-slab")
    @CrossOrigin(origins = "*")
    public Map<String, Object> updateIncomeSlab(@RequestBody Map<String, Object> request) {
        String sql;
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            Integer id = (Integer) request.get("id");

            // Check if we're updating slab_size or tax_rate
            if (request.containsKey("slab_size")) {
                Double slabSize = Double.parseDouble(request.get("slab_size").toString());

                System.out.println("size: " + slabSize);
                sql = "UPDATE rule_income SET slab_length = ? WHERE id = ?";

                jdbcTemplate.update(sql, slabSize, id);
            }

            if (request.containsKey("tax_rate")) {
                Double taxRate = Double.parseDouble(request.get("tax_rate").toString());
                // Make sure the column name is correct
                sql = "UPDATE rule_income SET tax_rate = ? WHERE id = ?";
                jdbcTemplate.update(sql, taxRate, id);
            }

            response.put("success", true);
            response.put("message", "Income slab updated successfully");
            return response;

        } catch (Exception e) {
            System.out.println("Error occurred: " + e);
            e.printStackTrace(); // This will give you more detailed error info
            response.put("success", false);
            response.put("message", "Failed to update income slab: " + e.getMessage());
            return response;
        }
    }

    @PostMapping("/admin/delete-taxzone-rule")
    @CrossOrigin(origins = "*")
    public Map<String, Object> deleteMinTax(@RequestBody Map<String, Object> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            // Extract id from request
            if (!request.containsKey("id")) {
                response.put("success", false);
                response.put("message", "Missing 'id' in request body");
                return response;
            }

            Integer id = null;
            Object idObj = request.get("id");

            if (idObj instanceof Integer) {
                id = (Integer) idObj;
            } else if (idObj instanceof String) {
                try {
                    id = Integer.parseInt((String) idObj);
                } catch (NumberFormatException ex) {
                    throw new IllegalArgumentException("Invalid ID format: must be an integer");
                }
            } else {
                throw new IllegalArgumentException("ID must be an integer or string representation of an integer");
            }

            // Perform deletion
            String sql = "DELETE FROM rule_tax_zone_min_tax WHERE id = ?";
            int rowsAffected = jdbcTemplate.update(sql, id);

            if (rowsAffected == 0) {
                response.put("success", false);
                response.put("message", "No record found with the given ID");
                return response;
            }

            // Build success response
            response.put("success", true);
            response.put("message", "Record deleted successfully");
            response.put("deleted_id", id);
            return response;

        } catch (Exception e) {
            System.out.println("Error occurred: " + e);
            e.printStackTrace();

            response.put("success", false);
            response.put("message", "Failed to delete record: " + e.getMessage());
            return response;
        }
    }



    @PostMapping("/admin/add-taxzone-rule")
    @CrossOrigin(origins = "*")
    public Map<String, Object> addMinTax(@RequestBody Map<String, Object> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            // Extract required fields
            if (!request.containsKey("area_name") || !request.containsKey("min_amount")) {
                response.put("success", false);
                response.put("message", "Missing 'area_name' or 'min_amount' in request");
                return response;
            }

            String areaName = request.get("area_name").toString();
            Object amountObj = request.get("min_amount");

            BigDecimal minAmount;

            // Handle different types of numeric input (Double, Integer, String)
            if (amountObj instanceof Number) {
                minAmount = BigDecimal.valueOf(((Number) amountObj).doubleValue());
            } else if (amountObj instanceof String) {
                try {
                    minAmount = new BigDecimal((String) amountObj);
                } catch (NumberFormatException ex) {
                    throw new IllegalArgumentException("Invalid min_amount: must be a number");
                }
            } else {
                throw new IllegalArgumentException("min_amount must be a number or string representation of a number");
            }

            // Perform insert
            String sql = "INSERT INTO rule_tax_zone_min_tax(area_name, min_amount) VALUES (?, ?)";
            jdbcTemplate.update(sql, areaName, minAmount);

            // Build success response
            response.put("success", true);
            response.put("message", "Minimum tax rule added successfully");
            response.put("area_name", areaName);
            response.put("min_amount", minAmount);
            return response;

        } catch (Exception e) {
            System.out.println("Error occurred: " + e);
            e.printStackTrace();

            response.put("success", false);
            response.put("message", "Failed to add minimum tax rule: " + e.getMessage());
            return response;
        }
    }

    @PostMapping("/admin/edit-taxzone-rule")
    @CrossOrigin(origins = "*")
    public Map<String, Object> updateMinTax(@RequestBody Map<String, Object> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            // Validate required fields
            if (!request.containsKey("id") ||
                    !request.containsKey("area_name") ||
                    !request.containsKey("min_amount")) {
                response.put("success", false);
                response.put("message", "Missing required fields (id, area_name, min_amount)");
                return response;
            }

            // Extract and parse id
            Integer id;
            Object idObj = request.get("id");
            if (idObj instanceof Integer) {
                id = (Integer) idObj;
            } else if (idObj instanceof String) {
                try {
                    id = Integer.parseInt((String) idObj);
                } catch (NumberFormatException ex) {
                    throw new IllegalArgumentException("Invalid ID format: must be an integer");
                }
            } else {
                throw new IllegalArgumentException("ID must be an integer or string representation of an integer");
            }

            // Extract area name
            String areaName = request.get("area_name").toString();

            // Extract and parse min_amount as BigDecimal for precision
            BigDecimal minAmount;
            Object amountObj = request.get("min_amount");

            if (amountObj instanceof Number) {
                minAmount = BigDecimal.valueOf(((Number) amountObj).doubleValue());
            } else if (amountObj instanceof String) {
                try {
                    minAmount = new BigDecimal((String) amountObj);
                } catch (NumberFormatException ex) {
                    throw new IllegalArgumentException("Invalid min_amount: must be a number");
                }
            } else {
                throw new IllegalArgumentException("min_amount must be a number or string representation of a number");
            }

            // Perform the update
            String sql = "UPDATE rule_tax_zone_min_tax SET area_name = ?, min_amount = ? WHERE id = ?";
            int rowsAffected = jdbcTemplate.update(sql, areaName, minAmount, id);

            if (rowsAffected == 0) {
                response.put("success", false);
                response.put("message", "No record found with the given ID");
                return response;
            }

            // Build success response
            response.put("success", true);
            response.put("message", "Minimum tax rule updated successfully");
            response.put("updated_id", id);
            return response;

        } catch (Exception e) {
            System.out.println("Error occurred: " + e);
            e.printStackTrace();

            response.put("success", false);
            response.put("message", "Failed to update minimum tax rule: " + e.getMessage());
            return response;
        }
    }


    @PostMapping("/admin/edit-rebate-rule")
    @CrossOrigin(origins = "*")
    public Map<String, Object> updateRebateRule(@RequestBody Map<String, Object> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            Integer id = 1; // Always update record with id = 1

            for (Map.Entry<String, Object> entry : request.entrySet()) {
                String column = entry.getKey();
                if (column=="maximum_of_income"){
                    column = "max_of_income";
                }
                Object value = entry.getValue();
                if (column == "maximumRebate"){
                    column = "max_rebate_amount";
                }

                // Skip "id" field or null values
                if ("id".equalsIgnoreCase(column) || value == null) {
                    continue;
                }

                // Try to parse value as a Number
                BigDecimal numericValue = null;

                if (value instanceof Number) {
                    numericValue = BigDecimal.valueOf(((Number) value).doubleValue());
                } else if (value instanceof String) {
                    try {
                        numericValue = new BigDecimal((String) value);
                    } catch (NumberFormatException ex) {
                        System.out.println("Skipping non-numeric value for column '" + column + "': " + value);
                        continue;
                    }
                } else {
                    System.out.println("Unsupported value type for column '" + column + "': " + value.getClass());
                    continue;
                }

                // Build SQL and execute update
                String sql = "UPDATE rule_rebate SET " + column + " = ? WHERE id = ?";
                jdbcTemplate.update(sql, numericValue, id);
            }

            response.put("success", true);
            response.put("message", "Income rule updated successfully for id = 1");
            return response;

        } catch (Exception e) {
            System.out.println("Error occurred: " + e);
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to update income rule: " + e.getMessage());
            return response;
        }
    }

    @PostMapping("/admin/edit-investment-category")
    public ResponseEntity<?> editInvestmentCategory(@RequestBody Map<String, Object> request) {
        try {
            // Extract data from request
            Integer id = (Integer) request.get("id");
            String title = (String) request.get("title");
            Double rateRebate = Double.valueOf(request.get("rate_rebate").toString());
            Integer minimum = Integer.valueOf(request.get("minimum").toString());
            Integer maximum = Integer.valueOf(request.get("maximum").toString());
            String description = (String) request.get("description");

            // Validate required fields
            if (id == null || title == null || rateRebate == null || minimum == null || maximum == null || description == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing required fields"));
            }

            // Update investment category in database
            String updateQuery = "UPDATE rule_investment_type SET title = ?, rate_rebate = ?, min_amount = ?, max_amount = ?, description = ? WHERE id = ?";

            int rowsUpdated = jdbcTemplate.update(updateQuery, title, rateRebate, minimum, maximum, description, id);

            if (rowsUpdated > 0) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Investment category updated successfully"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of("error", "Investment category not found or no changes made"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update investment category: " + e.getMessage()));
        }
    }

    @PostMapping("/admin/delete-investment-category")
    @CrossOrigin(origins = "*")
    public Map<String, Object> deleteInvestmentCategory(@RequestBody Map<String, Object> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            // Extract required field
            if (!request.containsKey("id")) {
                response.put("success", false);
                response.put("message", "Missing 'id' in request");
                return response;
            }

            Object idObj = request.get("id");
            Integer categoryId;

            // Handle different types of ID input (Integer, String)
            if (idObj instanceof Number) {
                categoryId = ((Number) idObj).intValue();
            } else if (idObj instanceof String) {
                try {
                    categoryId = Integer.parseInt((String) idObj);
                } catch (NumberFormatException ex) {
                    throw new IllegalArgumentException("Invalid id: must be a number");
                }
            } else {
                throw new IllegalArgumentException("id must be a number or string representation of a number");
            }



            // Perform delete
            String sql = "DELETE FROM rule_investment_type WHERE id = ?";
            int rowsAffected = jdbcTemplate.update(sql, categoryId);

            if (rowsAffected > 0) {
                // Build success response
                response.put("success", true);
                response.put("message", "Investment category deleted successfully");
                response.put("deleted_id", categoryId);
                return response;
            } else {
                response.put("success", false);
                response.put("message", "Failed to delete investment category");
                return response;
            }

        } catch (Exception e) {
            System.out.println("Error occurred: " + e);
            e.printStackTrace();

            response.put("success", false);
            response.put("message", "Failed to delete investment category: " + e.getMessage());
            return response;
        }
    }

    @PostMapping("/admin/add-investment-category")
    @CrossOrigin(origins = "*")
    public Map<String, Object> addInvestmentCategory(@RequestBody Map<String, Object> request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Map<String, Object> response = new HashMap<>();

        try {
            // Extract required fields
            if (!request.containsKey("title") || !request.containsKey("rate_rebate") ||
                    !request.containsKey("minimum") || !request.containsKey("maximum") ||
                    !request.containsKey("description")) {
                response.put("success", false);
                response.put("message", "Missing required fields: title, rate_rebate, minimum, maximum, or description");
                return response;
            }

            String title = request.get("title").toString();
            String description = request.get("description").toString();

            Object rateRebateObj = request.get("rate_rebate");
            Object minimumObj = request.get("minimum");
            Object maximumObj = request.get("maximum");

            BigDecimal rateRebate;
            BigDecimal minimum;
            BigDecimal maximum;

            // Handle rate_rebate conversion
            if (rateRebateObj instanceof Number) {
                rateRebate = BigDecimal.valueOf(((Number) rateRebateObj).doubleValue());
            } else if (rateRebateObj instanceof String) {
                try {
                    rateRebate = new BigDecimal((String) rateRebateObj);
                } catch (NumberFormatException ex) {
                    throw new IllegalArgumentException("Invalid rate_rebate: must be a number");
                }
            } else {
                throw new IllegalArgumentException("rate_rebate must be a number or string representation of a number");
            }

            // Handle minimum conversion
            if (minimumObj instanceof Number) {
                minimum = BigDecimal.valueOf(((Number) minimumObj).doubleValue());
            } else if (minimumObj instanceof String) {
                try {
                    String cleanMinimum = ((String) minimumObj).replace(",", "");
                    minimum = new BigDecimal(cleanMinimum);

                } catch (NumberFormatException ex) {
                    throw new IllegalArgumentException("Invalid minimum: must be a number");
                }
            } else {
                throw new IllegalArgumentException("minimum must be a number or string representation of a number");
            }

            // Handle maximum conversion
            if (maximumObj instanceof Number) {
                String cleanMaximum = ((String) minimumObj).replace(",", "");
                maximum = new BigDecimal(cleanMaximum);
            } else if (maximumObj instanceof String) {
                try {
                    maximum = new BigDecimal((String) maximumObj);
                } catch (NumberFormatException ex) {
                    throw new IllegalArgumentException("Invalid maximum: must be a number");
                }
            } else {
                throw new IllegalArgumentException("maximum must be a number or string representation of a number");
            }

            // Perform insert with generated key
            String sql = "INSERT INTO rule_investment_type (title, rate_rebate, min_amount, max_amount, description) VALUES (?, ?, ?, ?, ?)";
            KeyHolder keyHolder = new GeneratedKeyHolder();

            int rowsInserted = jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, title);
                ps.setBigDecimal(2, rateRebate);
                ps.setBigDecimal(3, minimum);
                ps.setBigDecimal(4, maximum);
                ps.setString(5, description);
                return ps;
            }, keyHolder);

            if (rowsInserted > 0) {
                // Get the generated ID
                Number generatedId = keyHolder.getKey();

                // Build success response with all the data (matching frontend expectations)
                response.put("success", true);
                response.put("message", "Investment category added successfully");
                response.put("id", generatedId != null ? generatedId.intValue() : null);
                response.put("title", title);
                response.put("rate_rebate", rateRebate.doubleValue());
                response.put("minimum", minimum.intValue());
                response.put("maximum", maximum.intValue());
                response.put("description", description);
                return response;
            } else {
                response.put("success", false);
                response.put("message", "Failed to add investment category");
                return response;
            }

        } catch (Exception e) {
            System.out.println("Error occurred: " + e);
            e.printStackTrace();

            response.put("success", false);
            response.put("message", "Failed to add investment category: " + e.getMessage());
            return response;
        }
    }


    /*@GetMapping("/user/tax_info")
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
                sql = "SELECT id, user_id,type, CAST(amount AS numeric) as amount, description,date FROM expense WHERE user_id=?";
                return jdbcTemplate.queryForList(sql, id);
            }catch(Exception e){
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
    }*/
}