package com.cselab.wealthe.controller;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.*;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import java.math.BigDecimal;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.slf4j.Logger;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.dao.DataIntegrityViolationException;

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

    @Mock
    private Authentication mockAuth;

    @Mock
    private SecurityContext mockSecurityContext;

    @Mock
    private Logger logger;

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

    @Test
    void testGetUserBankLoanList_SuccessfulRetrieval() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("123");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        List<Map<String, Object>> expectedResult = new ArrayList<>();
        Map<String, Object> loan1 = new HashMap<>();
        loan1.put("id", 1);
        loan1.put("user_id", 123);
        loan1.put("bank_name", "ABC Bank");
        loan1.put("account", "1234567890");
        loan1.put("interest", 8.5);
        loan1.put("amount", 50000.0);
        loan1.put("remaining", 35000.0);

        Map<String, Object> loan2 = new HashMap<>();
        loan2.put("id", 2);
        loan2.put("user_id", 123);
        loan2.put("bank_name", "XYZ Bank");
        loan2.put("account", "0987654321");
        loan2.put("interest", 9.0);
        loan2.put("amount", 75000.0);
        loan2.put("remaining", 60000.0);

        expectedResult.add(loan1);
        expectedResult.add(loan2);

        String expectedSql = "SELECT id, user_id, bank_name, account, interest, amount, remaining FROM liability_bank_loan WHERE user_id=?";
        when(jdbcTemplate.queryForList(expectedSql, 123)).thenReturn(expectedResult);

        // When
        List<Map<String, Object>> result = apiController.getUserBankLoanList();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("ABC Bank", result.get(0).get("bank_name"));
        assertEquals("XYZ Bank", result.get(1).get("bank_name"));
        assertEquals(123, result.get(0).get("user_id"));
        assertEquals(35000.0, result.get(0).get("remaining"));

        verify(jdbcTemplate).queryForList(expectedSql, 123);
    }

    @Test
    void testGetUserBankLoanList_EmptyResult() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("456");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        List<Map<String, Object>> emptyResult = new ArrayList<>();
        String expectedSql = "SELECT id, user_id, bank_name, account, interest, amount, remaining FROM liability_bank_loan WHERE user_id=?";
        when(jdbcTemplate.queryForList(expectedSql, 456)).thenReturn(emptyResult);

        // When
        List<Map<String, Object>> result = apiController.getUserBankLoanList();

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());

        verify(jdbcTemplate).queryForList(expectedSql, 456);
    }

    @Test
    void testGetUserBankLoanList_UserIdZero() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("0");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        // When
        List<Map<String, Object>> result = apiController.getUserBankLoanList();

        // Then
        assertNull(result);

        // Verify that jdbcTemplate is never called when user_id is 0
        verify(jdbcTemplate, never()).queryForList(anyString(), anyInt());
    }

    @Test
    void testGetUserBankLoanList_DatabaseException() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("789");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        String expectedSql = "SELECT id, user_id, bank_name, account, interest, amount, remaining FROM liability_bank_loan WHERE user_id=?";
        when(jdbcTemplate.queryForList(expectedSql, 789))
                .thenThrow(new DataAccessException("Database connection failed") {});

        // When
        List<Map<String, Object>> result = apiController.getUserBankLoanList();

        // Then
        assertNull(result);

        verify(jdbcTemplate).queryForList(expectedSql, 789);
    }

    @Test
    void testGetUserBankLoanList_SingleLoanRecord() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("999");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        List<Map<String, Object>> singleLoanResult = new ArrayList<>();
        Map<String, Object> loan = new HashMap<>();
        loan.put("id", 5);
        loan.put("user_id", 999);
        loan.put("bank_name", "National Bank");
        loan.put("account", "5555555555");
        loan.put("interest", 7.5);
        loan.put("amount", 100000.0);
        loan.put("remaining", 80000.0);
        singleLoanResult.add(loan);

        String expectedSql = "SELECT id, user_id, bank_name, account, interest, amount, remaining FROM liability_bank_loan WHERE user_id=?";
        when(jdbcTemplate.queryForList(expectedSql, 999)).thenReturn(singleLoanResult);

        // When
        List<Map<String, Object>> result = apiController.getUserBankLoanList();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("National Bank", result.get(0).get("bank_name"));
        assertEquals(999, result.get(0).get("user_id"));
        assertEquals(80000.0, result.get(0).get("remaining"));

        verify(jdbcTemplate).queryForList(expectedSql, 999);
    }

    @Test
    void testGetUserBankLoanList_RuntimeException() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("555");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        String expectedSql = "SELECT id, user_id, bank_name, account, interest, amount, remaining FROM liability_bank_loan WHERE user_id=?";
        when(jdbcTemplate.queryForList(expectedSql, 555))
                .thenThrow(new RuntimeException("Unexpected error occurred"));

        // When
        List<Map<String, Object>> result = apiController.getUserBankLoanList();

        // Then
        assertNull(result);

        verify(jdbcTemplate).queryForList(expectedSql, 555);
    }

    @Test
    void testAddBankLoan_SuccessfulInsertion() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("123");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        Map<String, Object> bankLoanData = new HashMap<>();
        bankLoanData.put("bank_name", "ABC Bank");
        bankLoanData.put("account", "1234567890");
        bankLoanData.put("interest", 8.5);
        bankLoanData.put("amount", 50000.0);
        bankLoanData.put("remaining", 45000.0);

        String expectedSql = "INSERT INTO liability_bank_loan(user_id, bank_name, account, interest, amount, remaining) VALUES (?, ?, ?, ?, ?, ?)";
        when(jdbcTemplate.update(expectedSql, 123, "ABC Bank", "1234567890", 8.5, 50000.0, 45000.0))
                .thenReturn(1);

        // When
        ResponseEntity<Map<String, Object>> result = apiController.addBankLoan(bankLoanData);

        // Then
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertTrue((Boolean) result.getBody().get("success"));
        assertEquals("Bank loan added successfully", result.getBody().get("message"));

        verify(jdbcTemplate).update(expectedSql, 123, "ABC Bank", "1234567890", 8.5, 50000.0, 45000.0);
    }

    @Test
    void testAddBankLoan_UserIdZero() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("0");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        Map<String, Object> bankLoanData = new HashMap<>();
        bankLoanData.put("bank_name", "ABC Bank");
        bankLoanData.put("account", "1234567890");
        bankLoanData.put("interest", 8.5);
        bankLoanData.put("amount", 50000.0);
        bankLoanData.put("remaining", 45000.0);

        // When
        ResponseEntity<Map<String, Object>> result = apiController.addBankLoan(bankLoanData);

        // Then
        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
        assertNotNull(result.getBody());
        assertFalse((Boolean) result.getBody().get("success"));
        assertEquals("Unauthorized access", result.getBody().get("message"));

        // Verify that jdbcTemplate is never called when user_id is 0
        verify(jdbcTemplate, never()).update(anyString(), (PreparedStatementSetter) any());
    }

    @Test
    void testAddBankLoan_DatabaseInsertionFailed() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("456");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        Map<String, Object> bankLoanData = new HashMap<>();
        bankLoanData.put("bank_name", "XYZ Bank");
        bankLoanData.put("account", "9876543210");
        bankLoanData.put("interest", 9.0);
        bankLoanData.put("amount", 75000.0);
        bankLoanData.put("remaining", 70000.0);

        String expectedSql = "INSERT INTO liability_bank_loan(user_id, bank_name, account, interest, amount, remaining) VALUES (?, ?, ?, ?, ?, ?)";
        when(jdbcTemplate.update(expectedSql, 456, "XYZ Bank", "9876543210", 9.0, 75000.0, 70000.0))
                .thenReturn(0); // Simulate failed insertion

        // When
        ResponseEntity<Map<String, Object>> result = apiController.addBankLoan(bankLoanData);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertNotNull(result.getBody());
        assertFalse((Boolean) result.getBody().get("success"));
        assertEquals("Failed to add bank loan", result.getBody().get("message"));

        verify(jdbcTemplate).update(expectedSql, 456, "XYZ Bank", "9876543210", 9.0, 75000.0, 70000.0);
    }

    @Test
    void testAddBankLoan_DatabaseException() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("789");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        Map<String, Object> bankLoanData = new HashMap<>();
        bankLoanData.put("bank_name", "National Bank");
        bankLoanData.put("account", "5555555555");
        bankLoanData.put("interest", 7.5);
        bankLoanData.put("amount", 100000.0);
        bankLoanData.put("remaining", 95000.0);

        String expectedSql = "INSERT INTO liability_bank_loan(user_id, bank_name, account, interest, amount, remaining) VALUES (?, ?, ?, ?, ?, ?)";
        when(jdbcTemplate.update(expectedSql, 789, "National Bank", "5555555555", 7.5, 100000.0, 95000.0))
                .thenThrow(new DataAccessException("Database connection failed") {});

        // When
        ResponseEntity<Map<String, Object>> result = apiController.addBankLoan(bankLoanData);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        assertNotNull(result.getBody());
        assertFalse((Boolean) result.getBody().get("success"));
        assertTrue(((String) result.getBody().get("message")).contains("Error occurred while adding bank loan"));

        verify(jdbcTemplate).update(expectedSql, 789, "National Bank", "5555555555", 7.5, 100000.0, 95000.0);
    }

    @Test
    void testAddBankLoan_EmptyBankLoanData() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("999");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        Map<String, Object> bankLoanData = new HashMap<>(); // Empty data

        String expectedSql = "INSERT INTO liability_bank_loan(user_id, bank_name, account, interest, amount, remaining) VALUES (?, ?, ?, ?, ?, ?)";
        when(jdbcTemplate.update(expectedSql, 999, null, null, null, null, null))
                .thenReturn(1);

        // When
        ResponseEntity<Map<String, Object>> result = apiController.addBankLoan(bankLoanData);

        // Then
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertTrue((Boolean) result.getBody().get("success"));
        assertEquals("Bank loan added successfully", result.getBody().get("message"));

        verify(jdbcTemplate).update(expectedSql, 999, null, null, null, null, null);
    }

    @Test
    void testAddBankLoan_PartialBankLoanData() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("888");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        Map<String, Object> bankLoanData = new HashMap<>();
        bankLoanData.put("bank_name", "Partial Bank");
        bankLoanData.put("amount", 60000.0);
        // Missing account, interest, and remaining fields

        String expectedSql = "INSERT INTO liability_bank_loan(user_id, bank_name, account, interest, amount, remaining) VALUES (?, ?, ?, ?, ?, ?)";
        when(jdbcTemplate.update(expectedSql, 888, "Partial Bank", null, null, 60000.0, null))
                .thenReturn(1);

        // When
        ResponseEntity<Map<String, Object>> result = apiController.addBankLoan(bankLoanData);

        // Then
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertTrue((Boolean) result.getBody().get("success"));
        assertEquals("Bank loan added successfully", result.getBody().get("message"));

        verify(jdbcTemplate).update(expectedSql, 888, "Partial Bank", null, null, 60000.0, null);
    }

    @Test
    void testAddBankLoan_RuntimeException() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("777");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        Map<String, Object> bankLoanData = new HashMap<>();
        bankLoanData.put("bank_name", "Error Bank");
        bankLoanData.put("account", "4444444444");
        bankLoanData.put("interest", 10.0);
        bankLoanData.put("amount", 80000.0);
        bankLoanData.put("remaining", 75000.0);

        String expectedSql = "INSERT INTO liability_bank_loan(user_id, bank_name, account, interest, amount, remaining) VALUES (?, ?, ?, ?, ?, ?)";
        when(jdbcTemplate.update(expectedSql, 777, "Error Bank", "4444444444", 10.0, 80000.0, 75000.0))
                .thenThrow(new RuntimeException("Unexpected database error"));

        // When
        ResponseEntity<Map<String, Object>> result = apiController.addBankLoan(bankLoanData);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        assertNotNull(result.getBody());
        assertFalse((Boolean) result.getBody().get("success"));
        assertTrue(((String) result.getBody().get("message")).contains("Error occurred while adding bank loan"));
        assertTrue(((String) result.getBody().get("message")).contains("Unexpected database error"));

        verify(jdbcTemplate).update(expectedSql, 777, "Error Bank", "4444444444", 10.0, 80000.0, 75000.0);
    }

    @Test
    void testDeleteBankLoan_SuccessfulDeletion() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("123");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = 5;
        String checkSql = "SELECT COUNT(*) FROM liability_bank_loan WHERE id = ? AND user_id = ?";
        String deleteSql = "DELETE FROM liability_bank_loan WHERE id = ? AND user_id = ?";

        when(jdbcTemplate.queryForObject(checkSql, Integer.class, loanId, 123)).thenReturn(1);
        when(jdbcTemplate.update(deleteSql, loanId, 123)).thenReturn(1);

        // When
        ResponseEntity<Map<String, Object>> result = apiController.deleteBankLoan(loanId);

        // Then
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertTrue((Boolean) result.getBody().get("success"));
        assertEquals("Bank loan deleted successfully", result.getBody().get("message"));

        verify(jdbcTemplate).queryForObject(checkSql, Integer.class, loanId, 123);
        verify(jdbcTemplate).update(deleteSql, loanId, 123);
    }

    @Test
    void testDeleteBankLoan_UserIdZero() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("0");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = 5;

        // When
        ResponseEntity<Map<String, Object>> result = apiController.deleteBankLoan(loanId);

        // Then
        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
        assertNotNull(result.getBody());
        assertFalse((Boolean) result.getBody().get("success"));
        assertEquals("Unauthorized access", result.getBody().get("message"));

        // Verify that jdbcTemplate is never called when user_id is 0
        verify(jdbcTemplate, never()).queryForObject(anyString(), eq(Integer.class), anyInt(), anyInt());
        verify(jdbcTemplate, never()).update(anyString(), anyInt(), anyInt());
    }

    @Test
    void testDeleteBankLoan_BankLoanNotFound() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("456");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = 99;
        String checkSql = "SELECT COUNT(*) FROM liability_bank_loan WHERE id = ? AND user_id = ?";

        when(jdbcTemplate.queryForObject(checkSql, Integer.class, loanId, 456)).thenReturn(0);

        // When
        ResponseEntity<Map<String, Object>> result = apiController.deleteBankLoan(loanId);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertNull(result.getBody()); // notFound().build() returns null body

        verify(jdbcTemplate).queryForObject(checkSql, Integer.class, loanId, 456);
        verify(jdbcTemplate, never()).update(anyString(), anyInt(), anyInt());
    }

    @Test
    void testDeleteBankLoan_UnauthorizedAccess() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("789");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = 10;
        String checkSql = "SELECT COUNT(*) FROM liability_bank_loan WHERE id = ? AND user_id = ?";

        // Loan exists but belongs to different user
        when(jdbcTemplate.queryForObject(checkSql, Integer.class, loanId, 789)).thenReturn(0);

        // When
        ResponseEntity<Map<String, Object>> result = apiController.deleteBankLoan(loanId);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertNull(result.getBody());

        verify(jdbcTemplate).queryForObject(checkSql, Integer.class, loanId, 789);
        verify(jdbcTemplate, never()).update(anyString(), anyInt(), anyInt());
    }

    @Test
    void testDeleteBankLoan_DeletionFailed() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("111");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = 15;
        String checkSql = "SELECT COUNT(*) FROM liability_bank_loan WHERE id = ? AND user_id = ?";
        String deleteSql = "DELETE FROM liability_bank_loan WHERE id = ? AND user_id = ?";

        when(jdbcTemplate.queryForObject(checkSql, Integer.class, loanId, 111)).thenReturn(1);
        when(jdbcTemplate.update(deleteSql, loanId, 111)).thenReturn(0); // Deletion failed

        // When
        ResponseEntity<Map<String, Object>> result = apiController.deleteBankLoan(loanId);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertNotNull(result.getBody());
        assertFalse((Boolean) result.getBody().get("success"));
        assertEquals("Failed to delete bank loan", result.getBody().get("message"));

        verify(jdbcTemplate).queryForObject(checkSql, Integer.class, loanId, 111);
        verify(jdbcTemplate).update(deleteSql, loanId, 111);
    }

    @Test
    void testDeleteBankLoan_DatabaseExceptionOnCheck() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("222");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = 20;
        String checkSql = "SELECT COUNT(*) FROM liability_bank_loan WHERE id = ? AND user_id = ?";

        when(jdbcTemplate.queryForObject(checkSql, Integer.class, loanId, 222))
                .thenThrow(new DataAccessException("Database connection failed during check") {});

        // When
        ResponseEntity<Map<String, Object>> result = apiController.deleteBankLoan(loanId);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        assertNotNull(result.getBody());
        assertFalse((Boolean) result.getBody().get("success"));
        assertTrue(((String) result.getBody().get("message")).contains("Error occurred while deleting bank loan"));

        verify(jdbcTemplate).queryForObject(checkSql, Integer.class, loanId, 222);
        verify(jdbcTemplate, never()).update(anyString(), anyInt(), anyInt());
    }

    @Test
    void testDeleteBankLoan_DatabaseExceptionOnDelete() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("333");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = 25;
        String checkSql = "SELECT COUNT(*) FROM liability_bank_loan WHERE id = ? AND user_id = ?";
        String deleteSql = "DELETE FROM liability_bank_loan WHERE id = ? AND user_id = ?";

        when(jdbcTemplate.queryForObject(checkSql, Integer.class, loanId, 333)).thenReturn(1);
        when(jdbcTemplate.update(deleteSql, loanId, 333))
                .thenThrow(new DataAccessException("Database connection failed during deletion") {});

        // When
        ResponseEntity<Map<String, Object>> result = apiController.deleteBankLoan(loanId);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        assertNotNull(result.getBody());
        assertFalse((Boolean) result.getBody().get("success"));
        assertTrue(((String) result.getBody().get("message")).contains("Error occurred while deleting bank loan"));

        verify(jdbcTemplate).queryForObject(checkSql, Integer.class, loanId, 333);
        verify(jdbcTemplate).update(deleteSql, loanId, 333);
    }

    @Test
    void testDeleteBankLoan_RuntimeException() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("444");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = 45;
        String checkSql = "SELECT COUNT(*) FROM liability_bank_loan WHERE id = ? AND user_id = ?";

        when(jdbcTemplate.queryForObject(checkSql, Integer.class, loanId, 444))
                .thenThrow(new RuntimeException("Unexpected error occurred"));

        // When
        ResponseEntity<Map<String, Object>> result = apiController.deleteBankLoan(loanId);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        assertNotNull(result.getBody());
        assertFalse((Boolean) result.getBody().get("success"));
        assertTrue(((String) result.getBody().get("message")).contains("Error occurred while deleting bank loan"));
        assertTrue(((String) result.getBody().get("message")).contains("Unexpected error occurred"));

        verify(jdbcTemplate).queryForObject(checkSql, Integer.class, loanId, 444);
        verify(jdbcTemplate, never()).update(anyString(), anyInt(), anyInt());
    }

    @Test
    void testDeleteBankLoan_NegativeLoanId() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("555");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = -1;
        String checkSql = "SELECT COUNT(*) FROM liability_bank_loan WHERE id = ? AND user_id = ?";

        when(jdbcTemplate.queryForObject(checkSql, Integer.class, loanId, 555)).thenReturn(0);

        // When
        ResponseEntity<Map<String, Object>> result = apiController.deleteBankLoan(loanId);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertNull(result.getBody());

        verify(jdbcTemplate).queryForObject(checkSql, Integer.class, loanId, 555);
        verify(jdbcTemplate, never()).update(anyString(), anyInt(), anyInt());
    }

    @Test
    void testDeleteBankLoan_ZeroLoanId() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("666");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = 0;
        String checkSql = "SELECT COUNT(*) FROM liability_bank_loan WHERE id = ? AND user_id = ?";

        when(jdbcTemplate.queryForObject(checkSql, Integer.class, loanId, 666)).thenReturn(0);

        // When
        ResponseEntity<Map<String, Object>> result = apiController.deleteBankLoan(loanId);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertNull(result.getBody());

        verify(jdbcTemplate).queryForObject(checkSql, Integer.class, loanId, 666);
        verify(jdbcTemplate, never()).update(anyString(), anyInt(), anyInt());
    }

    @Test
    void testUpdateBankLoan_SuccessfulUpdate() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("123");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = 5;
        Map<String, Object> bankLoanData = new HashMap<>();
        bankLoanData.put("bank_name", "Updated Bank");
        bankLoanData.put("account", "9999999999");
        bankLoanData.put("interest", 7.5);
        bankLoanData.put("amount", 60000.0);
        bankLoanData.put("remaining", 50000.0);

        String checkSql = "SELECT COUNT(*) FROM liability_bank_loan WHERE id = ? AND user_id = ?";
        String updateSql = "UPDATE liability_bank_loan SET bank_name=?, account=?, interest=?, amount=?, remaining=? WHERE id=? AND user_id=?";

        when(jdbcTemplate.queryForObject(checkSql, Integer.class, loanId, 123)).thenReturn(1);
        when(jdbcTemplate.update(updateSql, "Updated Bank", "9999999999", 7.5, 60000.0, 50000.0, loanId, 123)).thenReturn(1);

        // When
        ResponseEntity<Map<String, Object>> result = apiController.updateBankLoan(loanId, bankLoanData);

        // Then
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertTrue((Boolean) result.getBody().get("success"));
        assertEquals("Bank loan updated successfully", result.getBody().get("message"));

        verify(jdbcTemplate).queryForObject(checkSql, Integer.class, loanId, 123);
        verify(jdbcTemplate).update(updateSql, "Updated Bank", "9999999999", 7.5, 60000.0, 50000.0, loanId, 123);
    }

    @Test
    void testUpdateBankLoan_UserIdZero() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("0");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = 5;
        Map<String, Object> bankLoanData = new HashMap<>();
        bankLoanData.put("bank_name", "Test Bank");

        // When
        ResponseEntity<Map<String, Object>> result = apiController.updateBankLoan(loanId, bankLoanData);

        // Then
        assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
        assertNotNull(result.getBody());
        assertFalse((Boolean) result.getBody().get("success"));
        assertEquals("Unauthorized access", result.getBody().get("message"));

        // Verify that jdbcTemplate is never called when user_id is 0
        verify(jdbcTemplate, never()).queryForObject(anyString(), eq(Integer.class), anyInt(), anyInt());
        verify(jdbcTemplate, never()).update(anyString(), (PreparedStatementSetter) any());
    }

    @Test
    void testUpdateBankLoan_BankLoanNotFound() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("456");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = 99;
        Map<String, Object> bankLoanData = new HashMap<>();
        bankLoanData.put("bank_name", "Test Bank");

        String checkSql = "SELECT COUNT(*) FROM liability_bank_loan WHERE id = ? AND user_id = ?";
        when(jdbcTemplate.queryForObject(checkSql, Integer.class, loanId, 456)).thenReturn(0);

        // When
        ResponseEntity<Map<String, Object>> result = apiController.updateBankLoan(loanId, bankLoanData);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertNull(result.getBody()); // notFound().build() returns null body

        verify(jdbcTemplate).queryForObject(checkSql, Integer.class, loanId, 456);
        verify(jdbcTemplate, never()).update(anyString(), (PreparedStatementSetter) any());
    }

    @Test
    void testUpdateBankLoan_UnauthorizedAccess() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("789");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = 10;
        Map<String, Object> bankLoanData = new HashMap<>();
        bankLoanData.put("bank_name", "Test Bank");

        String checkSql = "SELECT COUNT(*) FROM liability_bank_loan WHERE id = ? AND user_id = ?";
        // Loan exists but belongs to different user
        when(jdbcTemplate.queryForObject(checkSql, Integer.class, loanId, 789)).thenReturn(0);

        // When
        ResponseEntity<Map<String, Object>> result = apiController.updateBankLoan(loanId, bankLoanData);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertNull(result.getBody());

        verify(jdbcTemplate).queryForObject(checkSql, Integer.class, loanId, 789);
        verify(jdbcTemplate, never()).update(anyString(), (PreparedStatementSetter) any());
    }

    @Test
    void testUpdateBankLoan_UpdateFailed() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("111");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = 15;
        Map<String, Object> bankLoanData = new HashMap<>();
        bankLoanData.put("bank_name", "Failed Bank");
        bankLoanData.put("account", "1111111111");
        bankLoanData.put("interest", 8.0);
        bankLoanData.put("amount", 40000.0);
        bankLoanData.put("remaining", 35000.0);

        String checkSql = "SELECT COUNT(*) FROM liability_bank_loan WHERE id = ? AND user_id = ?";
        String updateSql = "UPDATE liability_bank_loan SET bank_name=?, account=?, interest=?, amount=?, remaining=? WHERE id=? AND user_id=?";

        when(jdbcTemplate.queryForObject(checkSql, Integer.class, loanId, 111)).thenReturn(1);
        when(jdbcTemplate.update(updateSql, "Failed Bank", "1111111111", 8.0, 40000.0, 35000.0, loanId, 111)).thenReturn(0);

        // When
        ResponseEntity<Map<String, Object>> result = apiController.updateBankLoan(loanId, bankLoanData);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertNotNull(result.getBody());
        assertFalse((Boolean) result.getBody().get("success"));
        assertEquals("Failed to update bank loan", result.getBody().get("message"));

        verify(jdbcTemplate).queryForObject(checkSql, Integer.class, loanId, 111);
        verify(jdbcTemplate).update(updateSql, "Failed Bank", "1111111111", 8.0, 40000.0, 35000.0, loanId, 111);
    }

    @Test
    void testUpdateBankLoan_DatabaseExceptionOnCheck() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("222");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = 20;
        Map<String, Object> bankLoanData = new HashMap<>();
        bankLoanData.put("bank_name", "Error Bank");

        String checkSql = "SELECT COUNT(*) FROM liability_bank_loan WHERE id = ? AND user_id = ?";
        when(jdbcTemplate.queryForObject(checkSql, Integer.class, loanId, 222))
                .thenThrow(new DataAccessException("Database connection failed during check") {});

        // When
        ResponseEntity<Map<String, Object>> result = apiController.updateBankLoan(loanId, bankLoanData);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        assertNotNull(result.getBody());
        assertFalse((Boolean) result.getBody().get("success"));
        assertTrue(((String) result.getBody().get("message")).contains("Error occurred while updating bank loan"));

        verify(jdbcTemplate).queryForObject(checkSql, Integer.class, loanId, 222);
        verify(jdbcTemplate, never()).update(anyString(), (PreparedStatementSetter) any());
    }

    @Test
    void testUpdateBankLoan_DatabaseExceptionOnUpdate() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("333");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = 25;
        Map<String, Object> bankLoanData = new HashMap<>();
        bankLoanData.put("bank_name", "Exception Bank");
        bankLoanData.put("account", "3333333333");
        bankLoanData.put("interest", 9.5);
        bankLoanData.put("amount", 80000.0);
        bankLoanData.put("remaining", 75000.0);

        String checkSql = "SELECT COUNT(*) FROM liability_bank_loan WHERE id = ? AND user_id = ?";
        String updateSql = "UPDATE liability_bank_loan SET bank_name=?, account=?, interest=?, amount=?, remaining=? WHERE id=? AND user_id=?";

        when(jdbcTemplate.queryForObject(checkSql, Integer.class, loanId, 333)).thenReturn(1);
        when(jdbcTemplate.update(updateSql, "Exception Bank", "3333333333", 9.5, 80000.0, 75000.0, loanId, 333))
                .thenThrow(new DataAccessException("Database connection failed during update") {});

        // When
        ResponseEntity<Map<String, Object>> result = apiController.updateBankLoan(loanId, bankLoanData);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        assertNotNull(result.getBody());
        assertFalse((Boolean) result.getBody().get("success"));
        assertTrue(((String) result.getBody().get("message")).contains("Error occurred while updating bank loan"));

        verify(jdbcTemplate).queryForObject(checkSql, Integer.class, loanId, 333);
        verify(jdbcTemplate).update(updateSql, "Exception Bank", "3333333333", 9.5, 80000.0, 75000.0, loanId, 333);
    }

    @Test
    void testUpdateBankLoan_EmptyBankLoanData() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("444");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = 45;
        Map<String, Object> bankLoanData = new HashMap<>(); // Empty data

        String checkSql = "SELECT COUNT(*) FROM liability_bank_loan WHERE id = ? AND user_id = ?";
        String updateSql = "UPDATE liability_bank_loan SET bank_name=?, account=?, interest=?, amount=?, remaining=? WHERE id=? AND user_id=?";

        when(jdbcTemplate.queryForObject(checkSql, Integer.class, loanId, 444)).thenReturn(1);
        when(jdbcTemplate.update(updateSql, null, null, null, null, null, loanId, 444)).thenReturn(1);

        // When
        ResponseEntity<Map<String, Object>> result = apiController.updateBankLoan(loanId, bankLoanData);

        // Then
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertTrue((Boolean) result.getBody().get("success"));
        assertEquals("Bank loan updated successfully", result.getBody().get("message"));

        verify(jdbcTemplate).queryForObject(checkSql, Integer.class, loanId, 444);
        verify(jdbcTemplate).update(updateSql, null, null, null, null, null, loanId, 444);
    }

    @Test
    void testUpdateBankLoan_PartialBankLoanData() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("555");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = 50;
        Map<String, Object> bankLoanData = new HashMap<>();
        bankLoanData.put("bank_name", "Partial Bank");
        bankLoanData.put("amount", 70000.0);
        // Missing account, interest, and remaining fields

        String checkSql = "SELECT COUNT(*) FROM liability_bank_loan WHERE id = ? AND user_id = ?";
        String updateSql = "UPDATE liability_bank_loan SET bank_name=?, account=?, interest=?, amount=?, remaining=? WHERE id=? AND user_id=?";

        when(jdbcTemplate.queryForObject(checkSql, Integer.class, loanId, 555)).thenReturn(1);
        when(jdbcTemplate.update(updateSql, "Partial Bank", null, null, 70000.0, null, loanId, 555)).thenReturn(1);

        // When
        ResponseEntity<Map<String, Object>> result = apiController.updateBankLoan(loanId, bankLoanData);

        // Then
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertTrue((Boolean) result.getBody().get("success"));
        assertEquals("Bank loan updated successfully", result.getBody().get("message"));

        verify(jdbcTemplate).queryForObject(checkSql, Integer.class, loanId, 555);
        verify(jdbcTemplate).update(updateSql, "Partial Bank", null, null, 70000.0, null, loanId, 555);
    }

    @Test
    void testUpdateBankLoan_RuntimeException() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("666");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = 55;
        Map<String, Object> bankLoanData = new HashMap<>();
        bankLoanData.put("bank_name", "Runtime Error Bank");

        String checkSql = "SELECT COUNT(*) FROM liability_bank_loan WHERE id = ? AND user_id = ?";
        when(jdbcTemplate.queryForObject(checkSql, Integer.class, loanId, 666))
                .thenThrow(new RuntimeException("Unexpected error occurred"));

        // When
        ResponseEntity<Map<String, Object>> result = apiController.updateBankLoan(loanId, bankLoanData);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        assertNotNull(result.getBody());
        assertFalse((Boolean) result.getBody().get("success"));
        assertTrue(((String) result.getBody().get("message")).contains("Error occurred while updating bank loan"));
        assertTrue(((String) result.getBody().get("message")).contains("Unexpected error occurred"));

        verify(jdbcTemplate).queryForObject(checkSql, Integer.class, loanId, 666);
        verify(jdbcTemplate, never()).update(anyString(), (PreparedStatementSetter) any());
    }

    @Test
    void testUpdateBankLoan_NegativeLoanId() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("777");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = -1;
        Map<String, Object> bankLoanData = new HashMap<>();
        bankLoanData.put("bank_name", "Negative ID Bank");

        String checkSql = "SELECT COUNT(*) FROM liability_bank_loan WHERE id = ? AND user_id = ?";
        when(jdbcTemplate.queryForObject(checkSql, Integer.class, loanId, 777)).thenReturn(0);

        // When
        ResponseEntity<Map<String, Object>> result = apiController.updateBankLoan(loanId, bankLoanData);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertNull(result.getBody());

        verify(jdbcTemplate).queryForObject(checkSql, Integer.class, loanId, 777);
        verify(jdbcTemplate, never()).update(anyString(), (PreparedStatementSetter) any());
    }

    @Test
    void testUpdateBankLoan_ZeroLoanId() {
        // Given
        Authentication mockAuth = mock(Authentication.class);
        when(mockAuth.getName()).thenReturn("888");

        SecurityContext mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);

        int loanId = 0;
        Map<String, Object> bankLoanData = new HashMap<>();
        bankLoanData.put("bank_name", "Zero ID Bank");

        String checkSql = "SELECT COUNT(*) FROM liability_bank_loan WHERE id = ? AND user_id = ?";
        when(jdbcTemplate.queryForObject(checkSql, Integer.class, loanId, 888)).thenReturn(0);

        // When
        ResponseEntity<Map<String, Object>> result = apiController.updateBankLoan(loanId, bankLoanData);

        // Then
        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertNull(result.getBody());

        verify(jdbcTemplate).queryForObject(checkSql, Integer.class, loanId, 888);
        verify(jdbcTemplate, never()).update(anyString(), (PreparedStatementSetter) any());
    }

    @Test
    void testGetInvestmentType_SuccessfulRetrieval() {
        // Given
        String expectedSql = "SELECT id, title, rate_rebate, \n" +
                "       min_amount::numeric(20,2) AS minimum, \n" +
                "       max_amount::numeric(20,2) AS maximum,\n" +
                "       description \n" +
                "FROM rule_investment_type ORDER BY id;\n";

        List<Map<String, Object>> mockResult = new ArrayList<>();

        Map<String, Object> investment1 = new HashMap<>();
        investment1.put("id", 1);
        investment1.put("title", "Fixed Deposit");
        investment1.put("rate_rebate", 5.5);
        investment1.put("minimum", new BigDecimal("1000.00"));
        investment1.put("maximum", new BigDecimal("100000.00"));
        investment1.put("description", "Low risk fixed deposit investment");

        Map<String, Object> investment2 = new HashMap<>();
        investment2.put("id", 2);
        investment2.put("title", "Mutual Fund");
        investment2.put("rate_rebate", 8.0);
        investment2.put("minimum", new BigDecimal("500.00"));
        investment2.put("maximum", new BigDecimal("50000.00"));
        investment2.put("description", "Medium risk mutual fund investment");

        mockResult.add(investment1);
        mockResult.add(investment2);

        when(jdbcTemplate.queryForList(expectedSql)).thenReturn(mockResult);

        // When
        List<Map<String, Object>> result = apiController.getInvestmentType();

        // Then
        assertNotNull(result);
        assertEquals(2, result.size());

        // Verify first investment
        Map<String, Object> firstInvestment = result.get(0);
        assertEquals(1, firstInvestment.get("id"));
        assertEquals("Fixed Deposit", firstInvestment.get("title"));
        assertEquals(5.5, firstInvestment.get("rate_rebate"));
        assertEquals(new BigDecimal("1000.00"), firstInvestment.get("minimum"));
        assertEquals(new BigDecimal("100000.00"), firstInvestment.get("maximum"));
        assertEquals("Low risk fixed deposit investment", firstInvestment.get("description"));

        // Verify second investment
        Map<String, Object> secondInvestment = result.get(1);
        assertEquals(2, secondInvestment.get("id"));
        assertEquals("Mutual Fund", secondInvestment.get("title"));
        assertEquals(8.0, secondInvestment.get("rate_rebate"));

        verify(jdbcTemplate, times(1)).queryForList(expectedSql);
    }

    @Test
    void testGetInvestmentType_EmptyResult() {
        // Given
        String expectedSql = "SELECT id, title, rate_rebate, \n" +
                "       min_amount::numeric(20,2) AS minimum, \n" +
                "       max_amount::numeric(20,2) AS maximum,\n" +
                "       description \n" +
                "FROM rule_investment_type ORDER BY id;\n";

        List<Map<String, Object>> emptyResult = new ArrayList<>();
        when(jdbcTemplate.queryForList(expectedSql)).thenReturn(emptyResult);

        // When
        List<Map<String, Object>> result = apiController.getInvestmentType();

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        assertEquals(0, result.size());

        verify(jdbcTemplate, times(1)).queryForList(expectedSql);
    }

    @Test
    void testGetInvestmentType_SingleResult() {
        // Given
        String expectedSql = "SELECT id, title, rate_rebate, \n" +
                "       min_amount::numeric(20,2) AS minimum, \n" +
                "       max_amount::numeric(20,2) AS maximum,\n" +
                "       description \n" +
                "FROM rule_investment_type ORDER BY id;\n";

        List<Map<String, Object>> singleResult = new ArrayList<>();
        Map<String, Object> investment = new HashMap<>();
        investment.put("id", 1);
        investment.put("title", "Stocks");
        investment.put("rate_rebate", 12.5);
        investment.put("minimum", new BigDecimal("2000.00"));
        investment.put("maximum", new BigDecimal("200000.00"));
        investment.put("description", "High risk stock investment");
        singleResult.add(investment);

        when(jdbcTemplate.queryForList(expectedSql)).thenReturn(singleResult);

        // When
        List<Map<String, Object>> result = apiController.getInvestmentType();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Stocks", result.get(0).get("title"));
        assertEquals(12.5, result.get(0).get("rate_rebate"));

        verify(jdbcTemplate, times(1)).queryForList(expectedSql);
    }

    @Test
    void testGetInvestmentType_DataAccessException() {
        // Given
        String expectedSql = "SELECT id, title, rate_rebate, \n" +
                "       min_amount::numeric(20,2) AS minimum, \n" +
                "       max_amount::numeric(20,2) AS maximum,\n" +
                "       description \n" +
                "FROM rule_investment_type ORDER BY id;\n";

        when(jdbcTemplate.queryForList(expectedSql))
                .thenThrow(new DataAccessException("Database connection failed") {});

        // When
        List<Map<String, Object>> result = apiController.getInvestmentType();

        // Then
        assertNull(result);

        verify(jdbcTemplate, times(1)).queryForList(expectedSql);
    }

    @Test
    void testGetInvestmentType_EmptyResultDataAccessException() {
        // Given
        String expectedSql = "SELECT id, title, rate_rebate, \n" +
                "       min_amount::numeric(20,2) AS minimum, \n" +
                "       max_amount::numeric(20,2) AS maximum,\n" +
                "       description \n" +
                "FROM rule_investment_type ORDER BY id;\n";

        when(jdbcTemplate.queryForList(expectedSql))
                .thenThrow(new EmptyResultDataAccessException(1));

        // When
        List<Map<String, Object>> result = apiController.getInvestmentType();

        // Then
        assertNull(result);

        verify(jdbcTemplate, times(1)).queryForList(expectedSql);
    }

    @Test
    void testGetInvestmentType_DataIntegrityViolationException() {
        // Given
        String expectedSql = "SELECT id, title, rate_rebate, \n" +
                "       min_amount::numeric(20,2) AS minimum, \n" +
                "       max_amount::numeric(20,2) AS maximum,\n" +
                "       description \n" +
                "FROM rule_investment_type ORDER BY id;\n";

        when(jdbcTemplate.queryForList(expectedSql))
                .thenThrow(new DataIntegrityViolationException("Data integrity violation"));

        // When
        List<Map<String, Object>> result = apiController.getInvestmentType();

        // Then
        assertNull(result);

        verify(jdbcTemplate, times(1)).queryForList(expectedSql);
    }

    @Test
    void testGetInvestmentType_RuntimeException() {
        // Given
        String expectedSql = "SELECT id, title, rate_rebate, \n" +
                "       min_amount::numeric(20,2) AS minimum, \n" +
                "       max_amount::numeric(20,2) AS maximum,\n" +
                "       description \n" +
                "FROM rule_investment_type ORDER BY id;\n";

        when(jdbcTemplate.queryForList(expectedSql))
                .thenThrow(new RuntimeException("Unexpected runtime error"));

        // When
        List<Map<String, Object>> result = apiController.getInvestmentType();

        // Then
        assertNull(result);

        verify(jdbcTemplate, times(1)).queryForList(expectedSql);
    }

    @Test
    void testGetInvestmentType_NullPointerException() {
        // Given
        String expectedSql = "SELECT id, title, rate_rebate, \n" +
                "       min_amount::numeric(20,2) AS minimum, \n" +
                "       max_amount::numeric(20,2) AS maximum,\n" +
                "       description \n" +
                "FROM rule_investment_type ORDER BY id;\n";

        when(jdbcTemplate.queryForList(expectedSql))
                .thenThrow(new NullPointerException("Null pointer exception"));

        // When
        List<Map<String, Object>> result = apiController.getInvestmentType();

        // Then
        assertNull(result);

        verify(jdbcTemplate, times(1)).queryForList(expectedSql);
    }

    @Test
    void testGetInvestmentType_ResultWithNullValues() {
        // Given
        String expectedSql = "SELECT id, title, rate_rebate, \n" +
                "       min_amount::numeric(20,2) AS minimum, \n" +
                "       max_amount::numeric(20,2) AS maximum,\n" +
                "       description \n" +
                "FROM rule_investment_type ORDER BY id;\n";

        List<Map<String, Object>> resultWithNulls = new ArrayList<>();
        Map<String, Object> investment = new HashMap<>();
        investment.put("id", 1);
        investment.put("title", "Bond");
        investment.put("rate_rebate", null); // Null rate_rebate
        investment.put("minimum", new BigDecimal("1000.00"));
        investment.put("maximum", null); // Null maximum
        investment.put("description", null); // Null description
        resultWithNulls.add(investment);

        when(jdbcTemplate.queryForList(expectedSql)).thenReturn(resultWithNulls);

        // When
        List<Map<String, Object>> result = apiController.getInvestmentType();

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());

        Map<String, Object> resultInvestment = result.get(0);
        assertEquals(1, resultInvestment.get("id"));
        assertEquals("Bond", resultInvestment.get("title"));
        assertNull(resultInvestment.get("rate_rebate"));
        assertEquals(new BigDecimal("1000.00"), resultInvestment.get("minimum"));
        assertNull(resultInvestment.get("maximum"));
        assertNull(resultInvestment.get("description"));

        verify(jdbcTemplate, times(1)).queryForList(expectedSql);
    }

    @Test
    void testGetInvestmentType_LargeDataSet() {
        // Given
        String expectedSql = "SELECT id, title, rate_rebate, \n" +
                "       min_amount::numeric(20,2) AS minimum, \n" +
                "       max_amount::numeric(20,2) AS maximum,\n" +
                "       description \n" +
                "FROM rule_investment_type ORDER BY id;\n";

        List<Map<String, Object>> largeResult = new ArrayList<>();

        // Create 100 investment types
        for (int i = 1; i <= 100; i++) {
            Map<String, Object> investment = new HashMap<>();
            investment.put("id", i);
            investment.put("title", "Investment Type " + i);
            investment.put("rate_rebate", 5.0 + (i % 10));
            investment.put("minimum", new BigDecimal(String.valueOf(1000 * i)));
            investment.put("maximum", new BigDecimal(String.valueOf(100000 * i)));
            investment.put("description", "Description for investment " + i);
            largeResult.add(investment);
        }

        when(jdbcTemplate.queryForList(expectedSql)).thenReturn(largeResult);

        // When
        List<Map<String, Object>> result = apiController.getInvestmentType();

        // Then
        assertNotNull(result);
        assertEquals(100, result.size());
        assertEquals("Investment Type 1", result.get(0).get("title"));
        assertEquals("Investment Type 100", result.get(99).get("title"));

        verify(jdbcTemplate, times(1)).queryForList(expectedSql);
    }

    @Test
    void testGetInvestmentType_VerifySqlQuery() {
        // Given
        String expectedSql = "SELECT id, title, rate_rebate, \n" +
                "       min_amount::numeric(20,2) AS minimum, \n" +
                "       max_amount::numeric(20,2) AS maximum,\n" +
                "       description \n" +
                "FROM rule_investment_type ORDER BY id;\n";

        List<Map<String, Object>> mockResult = new ArrayList<>();
        when(jdbcTemplate.queryForList(expectedSql)).thenReturn(mockResult);

        // When
        apiController.getInvestmentType();

        // Then
        verify(jdbcTemplate, times(1)).queryForList(expectedSql);
        verifyNoMoreInteractions(jdbcTemplate);
    }

    @Test
    void testCalculateTaxEstimation_DatabaseException() {
        // Given
        when(mockAuth.getName()).thenReturn("123");

        Map<String, Object> requestData = new HashMap<>();
        requestData.put("expectedNonRecurringIncome", "50000");

        when(jdbcTemplate.queryForObject(anyString(), eq(Double.class), eq(123), any(java.sql.Date.class)))
                .thenThrow(new DataAccessException("Database connection failed") {});

        // When
        ResponseEntity<Map<String, Object>> result = apiController.calculateTaxEstimation(requestData);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        assertNotNull(result.getBody());
        assertFalse((Boolean) result.getBody().get("success"));
        assertTrue(((String) result.getBody().get("message")).contains("Internal server error"));
    }

}
