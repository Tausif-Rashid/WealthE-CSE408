package com.cselab.wealthe.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class ApiControllerTests {

    @Mock
    JdbcTemplate jdbcTemplate;

    @Mock
    Authentication authentication;

    @Mock
    SecurityContext securityContext;

    @InjectMocks
    ApiController apiController;

    @Test
    void testGetUserInfo_success() {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("5");

        List<Map<String, Object>> expected = List.of(Map.of("id", 5, "name", "Alice"));
        when(jdbcTemplate.queryForList("SELECT * FROM user_info WHERE id = ?", 5)).thenReturn(expected);

        // Act
        List<Map<String, Object>> result = apiController.getUserInfo();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(5, result.get(0).get("id"));
        assertEquals("Alice", result.get(0).get("name"));
    }

    @Test
    void testGetUserInfo_idZero_returnsNull() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("0");

        List<Map<String, Object>> result = apiController.getUserInfo();
        assertNull(result);
    }

    @Test
    void testGetUserTaxInfo_success() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("7");

        String sql = "SELECT user_tax_info.id, tin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name, credentials.email\n" +
                "FROM user_tax_info\n" +
                "JOIN credentials ON user_tax_info.id = credentials.id WHERE user_tax_info.id = ?";

        List<Map<String, Object>> expected = List.of(Map.of(
                "id", 7,
                "tin", "TIN123",
                "is_resident", true,
                "is_ff", false,
                "is_female", false,
                "is_disabled", false,
                "tax_zone", "Dhaka",
                "tax_circle", "Circle-1",
                "area_name", "Banani",
                "email", "user@example.com"
        ));
        when(jdbcTemplate.queryForList(sql, 7)).thenReturn(expected);

        List<Map<String, Object>> result = apiController.getUserTaxInfo();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(7, result.get(0).get("id"));
        assertEquals("TIN123", result.get(0).get("tin"));
        assertEquals("user@example.com", result.get(0).get("email"));
    }

    @Test
    void testGetUserTaxInfo_idZero_returnsNull() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("0");

        List<Map<String, Object>> result = apiController.getUserTaxInfo();
        assertNull(result);
    }

    @Test
    void testGetUserExpenseList_success() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("12");

        String sql = "SELECT * FROM expense WHERE user_id=? ORDER BY date DESC";
        List<Map<String, Object>> expected = List.of(
                Map.of(
                        "id", 1,
                        "user_id", 12,
                        "type", "Food",
                        "amount", 500,
                        "description", "Lunch",
                        "date", "2024-07-01"
                )
        );
        when(jdbcTemplate.queryForList(sql, 12)).thenReturn(expected);

        List<Map<String, Object>> result = apiController.getUserExpenseList();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(12, result.get(0).get("user_id"));
        assertEquals("Food", result.get(0).get("type"));
        assertEquals(500, result.get(0).get("amount"));
        assertEquals("Lunch", result.get(0).get("description"));
        assertEquals("2024-07-01", result.get(0).get("date"));
    }

    @Test
    void testGetUserExpenseList_idZero_returnsNull() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("0");

        List<Map<String, Object>> result = apiController.getUserExpenseList();
        assertNull(result);
    }

    @Test
    void testGetUserExpenseList_dbException_returnsNull() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("12");

        String sql = "SELECT * FROM expense WHERE user_id=? ORDER BY date DESC";
        when(jdbcTemplate.queryForList(sql, 12)).thenThrow(new RuntimeException("db error"));

        List<Map<String, Object>> result = apiController.getUserExpenseList();
        assertNull(result);
    }

    @Test
    void testGetAreas_withType() {
        String type = "Dhaka";
        String sql = "SELECT * FROM rule_tax_area_list WHERE area_name = ?";
        List<Map<String, Object>> expected = List.of(
                Map.of("area_name", "Dhaka", "id", 1)
        );
        when(jdbcTemplate.queryForList(sql, type)).thenReturn(expected);

        List<Map<String, Object>> result = apiController.getAreas(type);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Dhaka", result.get(0).get("area_name"));
    }

    @Test
    void testGetAreas_withoutType() {
        String sql = "SELECT * FROM rule_tax_area_list";
        List<Map<String, Object>> expected = List.of(
                Map.of("area_name", "Dhaka", "id", 1),
                Map.of("area_name", "Chittagong", "id", 2)
        );
        when(jdbcTemplate.queryForList(sql)).thenReturn(expected);

        List<Map<String, Object>> result = apiController.getAreas(null);

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Dhaka", result.get(0).get("area_name"));
        assertEquals("Chittagong", result.get(1).get("area_name"));
    }

    @Test
    void testGetData_tableRequired() {
        List<Map<String, Object>> result = apiController.getData(null, null);
        assertEquals(1, result.size());
        assertEquals("Table parameter is required", result.get(0).get("error"));

        result = apiController.getData("", null);
        assertEquals(1, result.size());
        assertEquals("Table parameter is required", result.get(0).get("error"));
    }

    @Test
    void testGetData_invalidTableName() {
        List<Map<String, Object>> result = apiController.getData("user; DROP TABLE user_info;", null);
        assertEquals(1, result.size());
        assertEquals("Invalid table name", result.get(0).get("error"));
    }

    @Test
    void testGetData_success_noLimit() {
        String table = "user_info";
        String sql = "SELECT * FROM user_info";
        List<Map<String, Object>> expected = List.of(Map.of("id", 1, "name", "Alice"));
        when(jdbcTemplate.queryForList(sql)).thenReturn(expected);

        List<Map<String, Object>> result = apiController.getData(table, null);
        assertEquals(1, result.size());
        assertEquals(1, result.get(0).get("id"));
        assertEquals("Alice", result.get(0).get("name"));
    }

    @Test
    void testGetData_success_withLimit() {
        String table = "user_info";
        String limit = "2";
        String sql = "SELECT * FROM user_info LIMIT 2";
        List<Map<String, Object>> expected = List.of(
                Map.of("id", 1, "name", "Alice"),
                Map.of("id", 2, "name", "Bob")
        );
        when(jdbcTemplate.queryForList(sql)).thenReturn(expected);

        List<Map<String, Object>> result = apiController.getData(table, limit);
        assertEquals(2, result.size());
        assertEquals("Alice", result.get(0).get("name"));
        assertEquals("Bob", result.get(1).get("name"));
    }

    @Test
    void testGetData_queryFails() {
        String table = "user_info";
        String sql = "SELECT * FROM user_info";
        when(jdbcTemplate.queryForList(sql)).thenThrow(new RuntimeException("db error"));

        List<Map<String, Object>> result = apiController.getData(table, null);
        assertEquals(1, result.size());
        assertTrue(((String)result.get(0).get("error")).contains("Query failed:"));
    }
}
