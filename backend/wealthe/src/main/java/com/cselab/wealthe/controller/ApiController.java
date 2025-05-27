package com.cselab.wealthe.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@RestController
public class ApiController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/user_info")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getUserInfo(@RequestParam(required = false) Integer id) {
        String sql;
        if (id != null) {
            sql = "SELECT * FROM user_info WHERE id = ?";
            return jdbcTemplate.queryForList(sql, id);
        } else {
            sql = "SELECT * FROM user_info";
            return jdbcTemplate.queryForList(sql);
        }
    }

    @GetMapping("/user_tax_info")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getUserTaxInfo(@RequestParam(required = false) Integer id) {
        String sql;
        if (id != null) {
            sql = "SELECT * FROM user_tax_info WHERE id = ?";
            return jdbcTemplate.queryForList(sql, id);
        } else {
            sql = "SELECT * FROM user_tax_info";
            return jdbcTemplate.queryForList(sql);
        }
    }

    @GetMapping("/user/expense")
    @CrossOrigin(origins = "*")
    public List<Map<String, Object>> getUserExpenseList(@RequestParam(required = false) Integer id) {
        String sql;
        if (id != null) {
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
    }
}