package com.cselab.wealthe.controller;

import com.cselab.wealthe.util.JwtUtil;

//import java.util.logging.Logger;

//import org.slf4j.LoggerFactory;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

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
                    "FROM rule_investment_type;\n";
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
            sql = "SELECT * FROM rule_tax_area_list\n";
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
                // Try different approaches for monetary conversion
                // Option 1: Direct cast (if your DB supports it)
                System.out.println("size: " + slabSize);
                sql = "UPDATE rule_income SET slab_length = ? WHERE id = ?";
                // Option 2: If Option 1 fails, try formatting as string first
                // sql = "UPDATE rule_income SET slab_length = CAST(' + CAST(? AS VARCHAR) AS MONEY) WHERE id = ?";

                // Option 3: If your column is actually numeric, just use direct assignment
//                 sql = "UPDATE rule_income SET slab_length = ? WHERE id = ?";

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