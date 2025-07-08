package com.cselab.wealthe.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.mockito.ArgumentCaptor;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.jdbc.support.GeneratedKeyHolder;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

//import static org.hamcrest.Matchers.any;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.*;

@ExtendWith(MockitoExtension.class)
public class AdminApiControllerTests {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @InjectMocks
    private AdminApiController adminApiController;

    @Test
    void testGetTotalUsers_success() {
        Map<String, Object> result = Map.of("total", 15);
        when(jdbcTemplate.queryForMap(anyString())).thenReturn(result);

        Map<String, Object> response = adminApiController.getTotalUsers();
        assertEquals(15, response.get("total"));
        System.out.println("total user success done");
    }

    @Test
    void testGetTotalUsers_printsNumberOfUsers() {
        Map<String, Object> result = Map.of("total", 15);
        when(jdbcTemplate.queryForMap(anyString())).thenReturn(result);

        Map<String, Object> response = adminApiController.getTotalUsers();
        System.out.println("Number of users: " + response.get("total"));
        assertEquals(15, response.get("total"));
        System.out.println("total user print success done");
    }

    @Test
    void testGetTotalUsers_exceptionHandled() {
        when(jdbcTemplate.queryForMap(anyString())).thenThrow(new RuntimeException("exception handled"));

        Map<String, Object> response = adminApiController.getTotalUsers();
        assertEquals(0, response.get("total"));
        System.out.println("total user error done");
    }

    @Test
    void testGetIncomeSlab_success() {
        String sql = "SELECT id, category, slab_no, slab_length AS slab_size, tax_rate\n" +
                "FROM rule_income ORDER BY ID\n";
        Map<String, Object> row1 = Map.of(
                "id", 1,
                "category", "regular",
                "slab_no", 1,
                "slab_size", 250000,
                "tax_rate", 0
        );
        Map<String, Object> row2 = Map.of(
                "id", 2,
                "category", "regular",
                "slab_no", 2,
                "slab_size", 250000,
                "tax_rate", 5
        );
        List<Map<String, Object>> mockResult = List.of(row1, row2);

        when(jdbcTemplate.queryForList(sql)).thenReturn(mockResult);

        List<Map<String, Object>> response = adminApiController.getIncomeSlab();
        assertEquals(2, response.size());
        assertEquals("regular", response.get(0).get("category"));
        assertEquals(5, response.get(1).get("tax_rate"));
        System.out.println("income slab success done");
    }

    @Test
    void testGetIncomeSlab_exceptionHandled() {
        String sql = "SELECT id, category, slab_no, slab_length AS slab_size, tax_rate\n" +
                "FROM rule_income ORDER BY ID\n";
        when(jdbcTemplate.queryForList(sql)).thenThrow(new RuntimeException("exception handled"));

        List<Map<String, Object>> response = adminApiController.getIncomeSlab();
        assertEquals(null, response);
        System.out.println("income slab error done");
    }

    @Test
    void testGetIncomeCategories_success() {
        String sql = "SELECT * FROM rule_income_category\n";
        Map<String, Object> row1 = Map.of(
                "id", 1,
                "category", "regular"
        );
        Map<String, Object> row2 = Map.of(
                "id", 2,
                "category", "senior"
        );
        List<Map<String, Object>> mockResult = List.of(row1, row2);

        when(jdbcTemplate.queryForList(sql)).thenReturn(mockResult);

        List<Map<String, Object>> response = adminApiController.getIncomeCategories();
        assertEquals(2, response.size());
        assertEquals("regular", response.get(0).get("category"));
        assertEquals("senior", response.get(1).get("category"));
        System.out.println("income category success done");
    }

    @Test
    void testGetIncomeCategories_exceptionHandled() {
        String sql = "SELECT * FROM rule_income_category\n";
        when(jdbcTemplate.queryForList(sql)).thenThrow(new RuntimeException("exception handled"));

        List<Map<String, Object>> response = adminApiController.getIncomeCategories();
        assertEquals(null, response);
        System.out.println("income category error done");
    }


    @Test
    void testGetExpenseCategories_success() {
        String sql = "SELECT * FROM rule_expense_category\n";
        Map<String, Object> row1 = Map.of(
                "id", 1,
                "category", "food"
        );
        Map<String, Object> row2 = Map.of(
                "id", 2,
                "category", "transport"
        );
        List<Map<String, Object>> mockResult = List.of(row1, row2);

        when(jdbcTemplate.queryForList(sql)).thenReturn(mockResult);

        List<Map<String, Object>> response = adminApiController.getExpenseCategories();
        assertEquals(2, response.size());
        assertEquals("food", response.get(0).get("category"));
        assertEquals("transport", response.get(1).get("category"));
        System.out.println("expense category success done");
    }

    @Test
    void testGetExpenseCategories_exceptionHandled() {
        String sql = "SELECT * FROM rule_expense_category\n";
        when(jdbcTemplate.queryForList(sql)).thenThrow(new RuntimeException("exception handled"));

        List<Map<String, Object>> response = adminApiController.getExpenseCategories();
        assertEquals(null, response);
        System.out.println("expense category error done");
    }

    @Test
    void testGetInvestmentType_success() {
        String sql = "SELECT id, title, rate_rebate, \n" +
                "       min_amount::numeric(20,2) AS minimum, \n" +
                "       max_amount::numeric(20,2) AS maximum,\n" +
                "       description \n" +
                "FROM rule_investment_type ORDER BY id;\n";
        Map<String, Object> row1 = Map.of(
                "id", 1,
                "title", "FD",
                "rate_rebate", 7.5,
                "minimum", 10000.00,
                "maximum", 1000000.00,
                "description", "Fixed Deposit"
        );
        Map<String, Object> row2 = Map.of(
                "id", 2,
                "title", "PPF",
                "rate_rebate", 8.0,
                "minimum", 500.00,
                "maximum", 150000.00,
                "description", "Public Provident Fund"
        );
        List<Map<String, Object>> mockResult = List.of(row1, row2);

        when(jdbcTemplate.queryForList(sql)).thenReturn(mockResult);

        List<Map<String, Object>> response = adminApiController.getInvestmentType();
        assertEquals(2, response.size());
        assertEquals("FD", response.get(0).get("title"));
        assertEquals(8.0, response.get(1).get("rate_rebate"));
        System.out.println("investment type success done");
    }

    @Test
    void testGetInvestmentType_exceptionHandled() {
        String sql = "SELECT id, title, rate_rebate, \n" +
                "       min_amount::numeric(20,2) AS minimum, \n" +
                "       max_amount::numeric(20,2) AS maximum,\n" +
                "       description \n" +
                "FROM rule_investment_type ORDER BY id;\n";
        when(jdbcTemplate.queryForList(sql)).thenThrow(new RuntimeException("exception handled"));

        List<Map<String, Object>> response = adminApiController.getInvestmentType();
        assertEquals(null, response);
        System.out.println("investment type error done");
    }

    @Test
    void testGetRebateRules_success() {
        String sql = "SELECT id, max_rebate_amount::numeric(20,2) AS maximum, max_of_income FROM rule_rebate";
        Map<String, Object> row1 = Map.of(
                "id", 1,
                "maximum", 50000.00,
                "max_of_income", 10
        );
        Map<String, Object> row2 = Map.of(
                "id", 2,
                "maximum", 75000.00,
                "max_of_income", 15
        );
        List<Map<String, Object>> mockResult = List.of(row1, row2);

        when(jdbcTemplate.queryForList(sql)).thenReturn(mockResult);

        List<Map<String, Object>> response = adminApiController.getRebateRules();
        assertEquals(2, response.size());
        assertEquals(50000.00, response.get(0).get("maximum"));
        assertEquals(15, response.get(1).get("max_of_income"));
        System.out.println("rebate rules success done");
    }

    @Test
    void testGetRebateRules_exceptionHandled() {
        String sql = "SELECT id, max_rebate_amount::numeric(20,2) AS maximum, max_of_income FROM rule_rebate";
        when(jdbcTemplate.queryForList(sql)).thenThrow(new RuntimeException("exception handled"));

        List<Map<String, Object>> response = adminApiController.getRebateRules();
        assertEquals(null, response);
        System.out.println("rebate rules error done");
    }


    @Test
    void testGetTaxAreaList_success() {
        String sql = "SELECT DISTINCT area_name from rule_tax_area_list \n" +
                "EXCEPT SELECT area_name from rule_tax_zone_min_tax;";
        Map<String, Object> row1 = Map.of("area_name", "Dhaka");
        Map<String, Object> row2 = Map.of("area_name", "Chittagong");
        List<Map<String, Object>> mockResult = List.of(row1, row2);

        when(jdbcTemplate.queryForList(sql)).thenReturn(mockResult);

        List<Map<String, Object>> response = adminApiController.getTaxAreaList();
        assertEquals(2, response.size());
        assertEquals("Dhaka", response.get(0).get("area_name"));
        assertEquals("Chittagong", response.get(1).get("area_name"));
        System.out.println("tax area list success done");
    }

    @Test
    void testGetTaxAreaList_exceptionHandled() {
        String sql = "SELECT DISTINCT area_name from rule_tax_area_list \n" +
                "EXCEPT SELECT area_name from rule_tax_zone_min_tax;";
        when(jdbcTemplate.queryForList(sql)).thenThrow(new RuntimeException("exception handled"));

        List<Map<String, Object>> response = adminApiController.getTaxAreaList();
        assertEquals(null, response);
        System.out.println("tax area list error done");
    }

    @Test
    void testGetMinimumTaxList_success() {
        String sql = "SELECT id, area_name, min_amount::numeric(20,2) AS minimum FROM rule_tax_zone_min_tax ORDER BY id";
        Map<String, Object> row1 = Map.of(
                "id", 1,
                "area_name", "Dhaka",
                "minimum", 5000.00
        );
        Map<String, Object> row2 = Map.of(
                "id", 2,
                "area_name", "Chittagong",
                "minimum", 4000.00
        );
        List<Map<String, Object>> mockResult = List.of(row1, row2);

        when(jdbcTemplate.queryForList(sql)).thenReturn(mockResult);

        List<Map<String, Object>> response = adminApiController.getMinimumTaxList();
        assertEquals(2, response.size());
        assertEquals("Dhaka", response.get(0).get("area_name"));
        assertEquals(4000.00, response.get(1).get("minimum"));
        System.out.println("minimum tax list success done");
    }

    @Test
    void testGetMinimumTaxList_exceptionHandled() {
        String sql = "SELECT id, area_name, min_amount::numeric(20,2) AS minimum FROM rule_tax_zone_min_tax ORDER BY id";
        when(jdbcTemplate.queryForList(sql)).thenThrow(new RuntimeException("exception handled"));

        List<Map<String, Object>> response = adminApiController.getMinimumTaxList();
        assertEquals(null, response);
        System.out.println("minimum tax list error done");
    }


    @Test
    void testUpdateIncomeSlab_updateSlabSize() {
        Map<String, Object> request = Map.of("id", 1, "slab_size", 300000);
        String sql = "UPDATE rule_income SET slab_length = ? WHERE id = ?";
        when(jdbcTemplate.update(sql, 300000.0, 1)).thenReturn(1);

        Map<String, Object> response = adminApiController.updateIncomeSlab(request);
        assertEquals(true, response.get("success"));
        assertEquals("Income slab updated successfully", response.get("message"));
        System.out.println("slab size update success done");
    }

    @Test
    void testUpdateIncomeSlab_updateTaxRate() {
        Map<String, Object> request = Map.of("id", 2, "tax_rate", 10);
        String sql = "UPDATE rule_income SET tax_rate = ? WHERE id = ?";
        when(jdbcTemplate.update(sql, 10.0, 2)).thenReturn(1);

        Map<String, Object> response = adminApiController.updateIncomeSlab(request);
        assertEquals(true, response.get("success"));
        assertEquals("Income slab updated successfully", response.get("message"));
        System.out.println("tax rate update success done");
    }

    @Test
    void testUpdateIncomeSlab_exceptionHandled() {
        Map<String, Object> request = Map.of("id", 1, "slab_size", 300000);
        String sql = "UPDATE rule_income SET slab_length = ? WHERE id = ?";
        when(jdbcTemplate.update(sql, 300000.0, 1)).thenThrow(new RuntimeException("db fail"));

        Map<String, Object> response = adminApiController.updateIncomeSlab(request);
        assertEquals(false, response.get("success"));
        assertEquals(true, ((String) response.get("message")).contains("Failed to update income slab"));
    }

    @Test
    void testDeleteMinTax_success() {
        Map<String, Object> request = Map.of("id", 5);
        String sql = "DELETE FROM rule_tax_zone_min_tax WHERE id = ?";
        when(jdbcTemplate.update(sql, 5)).thenReturn(1);

        Map<String, Object> response = adminApiController.deleteMinTax(request);
        assertEquals(true, response.get("success"));
        assertEquals("Record deleted successfully", response.get("message"));
        assertEquals(5, response.get("deleted_id"));
        System.out.println("min tax delete success done");
    }

    @Test
    void testDeleteMinTax_noRecordFound() {
        Map<String, Object> request = Map.of("id", 99);
        String sql = "DELETE FROM rule_tax_zone_min_tax WHERE id = ?";
        when(jdbcTemplate.update(sql, 99)).thenReturn(0);

        Map<String, Object> response = adminApiController.deleteMinTax(request);
        assertEquals(false, response.get("success"));
        assertEquals("No record found with the given ID", response.get("message"));
        System.out.println("delete min tax no record done");
    }

    @Test
    void testDeleteMinTax_exceptionHandled() {
        Map<String, Object> request = Map.of("id", 1);
        String sql = "DELETE FROM rule_tax_zone_min_tax WHERE id = ?";
        when(jdbcTemplate.update(sql, 1)).thenThrow(new RuntimeException("db fail"));

        Map<String, Object> response = adminApiController.deleteMinTax(request);
        assertEquals(false, response.get("success"));
        assertEquals(true, ((String) response.get("message")).contains("Failed to delete record"));
    }

    @Test
    void testAddMinTax_success_withIntegerAmount() {
        Map<String, Object> request = Map.of("area_name", "Dhaka", "min_amount", 5000);
        String sql = "INSERT INTO rule_tax_zone_min_tax(area_name, min_amount) VALUES (?, ?)";
        // Use matchers for all arguments
        when(jdbcTemplate.update(eq(sql), eq("Dhaka"), any(BigDecimal.class))).thenReturn(1);

        Map<String, Object> response = adminApiController.addMinTax(request);
        assertEquals(true, response.get("success"));
        assertEquals("Minimum tax rule added successfully", response.get("message"));
        assertEquals("Dhaka", response.get("area_name"));
        assertEquals(new BigDecimal("5000.0"), response.get("min_amount"));
    }

    @Test
    void testAddMinTax_success_withStringAmount() {
        Map<String, Object> request = Map.of("area_name", "Dhaka", "min_amount", "5000.50");
        String sql = "INSERT INTO rule_tax_zone_min_tax(area_name, min_amount) VALUES (?, ?)";
        when(jdbcTemplate.update(eq(sql), eq("Dhaka"), any(BigDecimal.class))).thenReturn(1);

        Map<String, Object> response = adminApiController.addMinTax(request);
        assertEquals(true, response.get("success"));
        assertEquals("Minimum tax rule added successfully", response.get("message"));
        assertEquals("Dhaka", response.get("area_name"));
        assertEquals(new BigDecimal("5000.50"), response.get("min_amount"));
    }

    @Test
    void testAddMinTax_missingFields() {
        Map<String, Object> request = Map.of("area_name", "Dhaka");
        Map<String, Object> response = adminApiController.addMinTax(request);
        assertEquals(false, response.get("success"));
        assertEquals("Missing 'area_name' or 'min_amount' in request", response.get("message"));
    }

    @Test
    void testAddMinTax_invalidAmount() {
        Map<String, Object> request = Map.of("area_name", "Dhaka", "min_amount", "notANumber");
        Map<String, Object> response = adminApiController.addMinTax(request);
        assertEquals(false, response.get("success"));
        assertEquals(true, ((String) response.get("message")).contains("Failed to add minimum tax rule"));
    }

    @Test
    void testAddMinTax_exceptionHandled() {
        Map<String, Object> request = Map.of("area_name", "Dhaka", "min_amount", 5000);
        String sql = "INSERT INTO rule_tax_zone_min_tax(area_name, min_amount) VALUES (?, ?)";
        when(jdbcTemplate.update(eq(sql), eq("Dhaka"), any(BigDecimal.class))).thenThrow(new RuntimeException("db fail"));

        Map<String, Object> response = adminApiController.addMinTax(request);
        assertEquals(false, response.get("success"));
        assertEquals(true, ((String) response.get("message")).contains("Failed to add minimum tax rule"));
    }

    @Test
    void testUpdateMinTax_success_withIntegerAmount() {
        Map<String, Object> request = Map.of("id", 1, "area_name", "Dhaka", "min_amount", 7000);
        String sql = "UPDATE rule_tax_zone_min_tax SET area_name = ?, min_amount = ? WHERE id = ?";
        when(jdbcTemplate.update(eq(sql), eq("Dhaka"), any(BigDecimal.class), eq(1))).thenReturn(1);

        Map<String, Object> response = adminApiController.updateMinTax(request);
        assertEquals(true, response.get("success"));
        assertEquals("Minimum tax rule updated successfully", response.get("message"));
        assertEquals(1, response.get("updated_id"));
    }

    @Test
    void testUpdateMinTax_success_withStringAmount() {
        Map<String, Object> request = Map.of("id", 2, "area_name", "Chittagong", "min_amount", "8000.50");
        String sql = "UPDATE rule_tax_zone_min_tax SET area_name = ?, min_amount = ? WHERE id = ?";
        when(jdbcTemplate.update(eq(sql), eq("Chittagong"), any(BigDecimal.class), eq(2))).thenReturn(1);

        Map<String, Object> response = adminApiController.updateMinTax(request);
        assertEquals(true, response.get("success"));
        assertEquals("Minimum tax rule updated successfully", response.get("message"));
        assertEquals(2, response.get("updated_id"));
    }

    @Test
    void testUpdateMinTax_missingFields() {
        Map<String, Object> request = Map.of("id", 1, "area_name", "Dhaka");
        Map<String, Object> response = adminApiController.updateMinTax(request);
        assertEquals(false, response.get("success"));
        assertEquals("Missing required fields (id, area_name, min_amount)", response.get("message"));
    }

    @Test
    void testUpdateMinTax_noRecordFound() {
        Map<String, Object> request = Map.of("id", 99, "area_name", "Dhaka", "min_amount", 7000);
        String sql = "UPDATE rule_tax_zone_min_tax SET area_name = ?, min_amount = ? WHERE id = ?";
        when(jdbcTemplate.update(eq(sql), eq("Dhaka"), any(BigDecimal.class), eq(99))).thenReturn(0);

        Map<String, Object> response = adminApiController.updateMinTax(request);
        assertEquals(false, response.get("success"));
        assertEquals("No record found with the given ID", response.get("message"));
    }

    @Test
    void testUpdateMinTax_invalidAmount() {
        Map<String, Object> request = Map.of("id", 1, "area_name", "Dhaka", "min_amount", "notANumber");
        Map<String, Object> response = adminApiController.updateMinTax(request);
        assertEquals(false, response.get("success"));
        assertEquals(true, ((String) response.get("message")).contains("Failed to update minimum tax rule"));
    }

    @Test
    void testUpdateMinTax_exceptionHandled() {
        Map<String, Object> request = Map.of("id", 1, "area_name", "Dhaka", "min_amount", 7000);
        String sql = "UPDATE rule_tax_zone_min_tax SET area_name = ?, min_amount = ? WHERE id = ?";
        when(jdbcTemplate.update(eq(sql), eq("Dhaka"), any(BigDecimal.class), eq(1))).thenThrow(new RuntimeException("db fail"));

        Map<String, Object> response = adminApiController.updateMinTax(request);
        assertEquals(false, response.get("success"));
        assertEquals(true, ((String) response.get("message")).contains("Failed to update minimum tax rule"));
    }

    @Test
    void testUpdateRebateRule_success_singleField() {
        Map<String, Object> request = Map.of("max_of_income", 20);
        String sql = "UPDATE rule_rebate SET max_of_income = ? WHERE id = ?";
        when(jdbcTemplate.update(eq(sql), eq(new BigDecimal("20.0")), eq(1))).thenReturn(1);

        Map<String, Object> response = adminApiController.updateRebateRule(request);
        assertEquals(true, response.get("success"));
        assertEquals("Income rule updated successfully for id = 1", response.get("message"));
    }

    @Test
    void testUpdateRebateRule_success_multipleFields() {
        Map<String, Object> request = Map.of("max_of_income", 20, "max_rebate_amount", "50000.50");
        String sql1 = "UPDATE rule_rebate SET max_of_income = ? WHERE id = ?";
        String sql2 = "UPDATE rule_rebate SET max_rebate_amount = ? WHERE id = ?";
        when(jdbcTemplate.update(eq(sql1), eq(new BigDecimal("20.0")), eq(1))).thenReturn(1);
        when(jdbcTemplate.update(eq(sql2), eq(new BigDecimal("50000.50")), eq(1))).thenReturn(1);

        Map<String, Object> response = adminApiController.updateRebateRule(request);
        assertEquals(true, response.get("success"));
        assertEquals("Income rule updated successfully for id = 1", response.get("message"));
    }

    @Test
    void testUpdateRebateRule_skipsNonNumeric() {
        Map<String, Object> request = Map.of("max_of_income", "notANumber", "max_rebate_amount", 10000);
        String sql = "UPDATE rule_rebate SET max_rebate_amount = ? WHERE id = ?";
        when(jdbcTemplate.update(eq(sql), eq(new BigDecimal("10000.0")), eq(1))).thenReturn(1);

        Map<String, Object> response = adminApiController.updateRebateRule(request);
        assertEquals(true, response.get("success"));
        assertEquals("Income rule updated successfully for id = 1", response.get("message"));
    }

    @Test
    void testUpdateRebateRule_exceptionHandled() {
        Map<String, Object> request = Map.of("max_of_income", 20);
        String sql = "UPDATE rule_rebate SET max_of_income = ? WHERE id = ?";
        when(jdbcTemplate.update(eq(sql), eq(new BigDecimal("20.0")), eq(1))).thenThrow(new RuntimeException("db fail"));

        Map<String, Object> response = adminApiController.updateRebateRule(request);
        assertEquals(false, response.get("success"));
        assertEquals(true, ((String)response.get("message")).contains("Failed to update income rule"));
    }

    @Test
    void testEditInvestmentCategory_success() {
        Map<String, Object> request = Map.of(
                "id", 1,
                "title", "FD",
                "rate_rebate", 7.5,
                "minimum", 10000,
                "maximum", 1000000,
                "description", "Fixed Deposit"
        );
        String sql = "UPDATE rule_investment_type SET title = ?, rate_rebate = ?, min_amount = ?, max_amount = ?, description = ? WHERE id = ?";
        when(jdbcTemplate.update(sql, "FD", 7.5, 10000, 1000000, "Fixed Deposit", 1)).thenReturn(1);

        ResponseEntity<?> response = adminApiController.editInvestmentCategory(request);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals(true, body.get("success"));
        assertEquals("Investment category updated successfully", body.get("message"));
    }

    @Test
    void testEditInvestmentCategory_notFound() {
        Map<String, Object> request = Map.of(
                "id", 2,
                "title", "PPF",
                "rate_rebate", 8.0,
                "minimum", 500,
                "maximum", 150000,
                "description", "Public Provident Fund"
        );
        String sql = "UPDATE rule_investment_type SET title = ?, rate_rebate = ?, min_amount = ?, max_amount = ?, description = ? WHERE id = ?";
        when(jdbcTemplate.update(sql, "PPF", 8.0, 500, 150000, "Public Provident Fund", 2)).thenReturn(0);

        ResponseEntity<?> response = adminApiController.editInvestmentCategory(request);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals("Investment category not found or no changes made", body.get("error"));
    }

//    @Test  //for edit_investment_category()
//    void testEditInvestmentCategory_missingFields() {
//        Map<String, Object> request = Map.of(
//                "id", 1,
//                "title", "FD"
//                // missing other fields
//        );
//        ResponseEntity<?> response = adminApiController.editInvestmentCategory(request);
//        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
//        Map<String, Object> body = (Map<String, Object>) response.getBody();
//        assertEquals("Missing required fields", body.get("error"));
//    }

    @Test
    void testEditInvestmentCategory_exceptionHandled() {
        Map<String, Object> request = Map.of(
                "id", 1,
                "title", "FD",
                "rate_rebate", 7.5,
                "minimum", 10000,
                "maximum", 1000000,
                "description", "Fixed Deposit"
        );
        String sql = "UPDATE rule_investment_type SET title = ?, rate_rebate = ?, min_amount = ?, max_amount = ?, description = ? WHERE id = ?";
        when(jdbcTemplate.update(sql, "FD", 7.5, 10000, 1000000, "Fixed Deposit", 1)).thenThrow(new RuntimeException("db fail"));

        ResponseEntity<?> response = adminApiController.editInvestmentCategory(request);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals(true, ((String)body.get("error")).contains("Failed to update investment category"));
    }
    @Test
    void testDeleteInvestmentCategory_success() {
        Map<String, Object> request = Map.of("id", 3);
        String sql = "DELETE FROM rule_investment_type WHERE id = ?";
        when(jdbcTemplate.update(sql, 3)).thenReturn(1);

        Map<String, Object> response = adminApiController.deleteInvestmentCategory(request);
        assertEquals(true, response.get("success"));
        assertEquals("Investment category deleted successfully", response.get("message"));
        assertEquals(3, response.get("deleted_id"));
    }

    @Test
    void testDeleteInvestmentCategory_missingId() {
        Map<String, Object> request = Map.of();
        Map<String, Object> response = adminApiController.deleteInvestmentCategory(request);
        assertEquals(false, response.get("success"));
        assertEquals("Missing 'id' in request", response.get("message"));
    }

    @Test
    void testDeleteInvestmentCategory_invalidIdFormat() {
        Map<String, Object> request = Map.of("id", "notANumber");
        Map<String, Object> response = adminApiController.deleteInvestmentCategory(request);
        assertEquals(false, response.get("success"));
        assertEquals(true, ((String)response.get("message")).contains("Failed to delete investment category"));
    }

    @Test
    void testDeleteInvestmentCategory_noRowsAffected() {
        Map<String, Object> request = Map.of("id", 99);
        String sql = "DELETE FROM rule_investment_type WHERE id = ?";
        when(jdbcTemplate.update(sql, 99)).thenReturn(0);

        Map<String, Object> response = adminApiController.deleteInvestmentCategory(request);
        assertEquals(false, response.get("success"));
        assertEquals("Failed to delete investment category", response.get("message"));
    }

    @Test
    void testDeleteInvestmentCategory_exceptionHandled() {
        Map<String, Object> request = Map.of("id", 1);
        String sql = "DELETE FROM rule_investment_type WHERE id = ?";
        when(jdbcTemplate.update(sql, 1)).thenThrow(new RuntimeException("db fail"));

        Map<String, Object> response = adminApiController.deleteInvestmentCategory(request);
        assertEquals(false, response.get("success"));
        assertEquals(true, ((String) response.get("message")).contains("Failed to delete investment category"));
    }

    @Test
    void testAddInvestmentCategory_success() throws Exception {
        Map<String, Object> request = Map.of(
            "title", "FD",
            "rate_rebate", "7.5",         // as String
            "minimum", "10000",           // as String
            "maximum", "1000000",         // as String
            "description", "Fixed Deposit"
        );
        String sql = "INSERT INTO rule_investment_type (title, rate_rebate, min_amount, max_amount, description) VALUES (?, ?, ?, ?, ?)";

        when(jdbcTemplate.update(any(), any(KeyHolder.class))).thenAnswer(invocation -> {
            return 1; // You may skip id check if you can't mock getKey()
        });

        Map<String, Object> response = adminApiController.addInvestmentCategory(request);
        assertEquals(true, response.get("success"));
        assertEquals("Investment category added successfully", response.get("message"));
        assertEquals("FD", response.get("title"));
        assertEquals(7.5, response.get("rate_rebate"));
        assertEquals(10000, response.get("minimum"));
        assertEquals(1000000, response.get("maximum"));
        assertEquals("Fixed Deposit", response.get("description"));
    }

    @Test
    void testAddInvestmentCategory_missingFields() {
        Map<String, Object> request = Map.of(
                "title", "FD",
                "rate_rebate", 7.5
                // missing minimum, maximum, description
        );
        Map<String, Object> response = adminApiController.addInvestmentCategory(request);
        assertEquals(false, response.get("success"));
        assertEquals("Missing required fields: title, rate_rebate, minimum, maximum, or description", response.get("message"));
    }

    @Test
    void testAddInvestmentCategory_invalidRateRebate() {
        Map<String, Object> request = Map.of(
                "title", "FD",
                "rate_rebate", "notANumber",
                "minimum", 10000,
                "maximum", 1000000,
                "description", "Fixed Deposit"
        );
        Map<String, Object> response = adminApiController.addInvestmentCategory(request);
        assertEquals(false, response.get("success"));
        assertEquals(true, ((String)response.get("message")).contains("Failed to add investment category"));
    }

    @Test
    void testAddInvestmentCategory_insertFails() {
        Map<String, Object> request = Map.of(
            "title", "FD",
            "rate_rebate", "7.5",         // as String
            "minimum", "10000",           // as String
            "maximum", "1000000",         // as String
            "description", "Fixed Deposit"
        );
        when(jdbcTemplate.update(any(), any(KeyHolder.class))).thenReturn(0);

        Map<String, Object> response = adminApiController.addInvestmentCategory(request);
        assertEquals(false, response.get("success"));
        assertEquals("Failed to add investment category", response.get("message"));
    }

    @Test
    void testAddInvestmentCategory_exceptionHandled() {
        Map<String, Object> request = Map.of(
            "title", "FD",
            "rate_rebate", "7.5",         // as String
            "minimum", "10000",           // as String
            "maximum", "1000000",         // as String
            "description", "Fixed Deposit"
        );
        when(jdbcTemplate.update(any(), any(KeyHolder.class))).thenThrow(new RuntimeException("db fail"));

        Map<String, Object> response = adminApiController.addInvestmentCategory(request);
        assertEquals(false, response.get("success"));
        assertEquals(true, ((String)response.get("message")).contains("Failed to add investment category"));
    }
}