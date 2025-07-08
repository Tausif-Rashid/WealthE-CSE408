package com.cselab.wealthe.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
public class ApiControllerAzmalTests {

    @Mock
    JdbcTemplate jdbcTemplate;

    @Mock
    Authentication authentication;

    @Mock
    SecurityContext securityContext;

    @InjectMocks
    ApiControllerAzmal apiController;

    @Test
    void testAddExpense_success() throws Exception {
        // Arrange
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("5");

        Map<String, Object> expenseData = new HashMap<>();
        expenseData.put("type", "Food");
        expenseData.put("amount", "250.5");
        expenseData.put("description", "Lunch");
        expenseData.put("date", "2024-07-01");
        expenseData.put("isRecurring", false);

        // Properly set the generated key in the KeyHolder
        when(jdbcTemplate.update(any(), any(KeyHolder.class))).thenAnswer(invocation -> {
            KeyHolder kh = invocation.getArgument(1);
            // For most Spring versions, this works:
            if (kh instanceof GeneratedKeyHolder) {
                // Use reflection to set the keyList field
                java.lang.reflect.Field f = GeneratedKeyHolder.class.getDeclaredField("keyList");
                f.setAccessible(true);
                List<Map<String, Object>> keyList = new ArrayList<>();
                keyList.add(Map.of("id", 10));
                f.set(kh, keyList);
            }
            return 1;
        });

        ResponseEntity<Map<String, Object>> response = apiController.addExpense(expenseData);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue((Boolean) response.getBody().get("success"));
        assertEquals("Expense added successfully", response.getBody().get("message"));
        assertEquals(10, response.getBody().get("expense_id"));
    }

    @Test
    void testAddExpense_unauthorizedUser() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("0");

        Map<String, Object> expenseData = Map.of(
                "type", "Food",
                "amount", "100",
                "description", "Lunch",
                "date", "2024-07-01"
        );

        ResponseEntity<Map<String, Object>> response = apiController.addExpense(expenseData);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertFalse((Boolean) response.getBody().get("success"));
        assertEquals("Unauthorized user", response.getBody().get("message"));
    }

    @Test
    void testAddExpense_invalidAmount() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("5");

        Map<String, Object> expenseData = Map.of(
                "type", "Food",
                "amount", "notANumber",
                "description", "Lunch",
                "date", "2024-07-01"
        );

        ResponseEntity<Map<String, Object>> response = apiController.addExpense(expenseData);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertFalse((Boolean) response.getBody().get("success"));
        assertEquals("Invalid amount format", response.getBody().get("message"));
    }

    @Test
    void testAddExpense_invalidDate() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("5");

        Map<String, Object> expenseData = Map.of(
                "type", "Food",
                "amount", "100",
                "description", "Lunch",
                "date", "07-01-2024" // Invalid format
        );

        // Simulate insert returning 0 due to missing/invalid fields
        when(jdbcTemplate.update(any(), any(KeyHolder.class))).thenReturn(0);

        ResponseEntity<Map<String, Object>> response = apiController.addExpense(expenseData);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertFalse((Boolean) response.getBody().get("success"));
        assertEquals("Failed to insert expense", response.getBody().get("message"));
    }

    @Test
    void testAddExpense_missingFields() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("5");

        Map<String, Object> expenseData = Map.of(
                "type", "Food",
                "amount", "100"
                // missing description and date
        );

        ResponseEntity<Map<String, Object>> response = apiController.addExpense(expenseData);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertFalse((Boolean) response.getBody().get("success"));
        assertEquals("Missing required fields", response.getBody().get("message"));
    }

    @Test
    void testAddExpense_insertFails() {
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("5");

        Map<String, Object> expenseData = Map.of(
                "type", "Food",
                "amount", "100",
                "description", "Lunch",
                "date", "2024-07-01"
        );

        when(jdbcTemplate.update(any(), any(KeyHolder.class))).thenReturn(0);

        ResponseEntity<Map<String, Object>> response = apiController.addExpense(expenseData);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertFalse((Boolean) response.getBody().get("success"));
        assertEquals("Failed to insert expense", response.getBody().get("message"));
    }
}
