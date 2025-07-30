package com.cselab.wealthe.controller;

import com.cselab.wealthe.service.PdfService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.sql.Date;
import java.util.HashMap;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.io.File;
import org.mockito.MockedStatic;
import org.mockito.MockedConstruction; // Add this import

import org.junit.jupiter.api.BeforeEach;
import org.slf4j.Logger;
import org.mockito.MockedStatic;
import java.util.*;


@ExtendWith(MockitoExtension.class)
public class ApiControllerTests {

    @Mock
    JdbcTemplate jdbcTemplate;

    @Mock
    Authentication authentication;

    @Mock
    SecurityContext securityContext;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    private PdfService pdfService;

    @Mock
    private Logger logger;

    @InjectMocks
    ApiController apiController;

    private Map<String, Object> testPayload;

//    @BeforeEach
//    void setUp() {
//        // Reset SecurityContextHolder before each test
//        SecurityContextHolder.clearContext();
//    }

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();
        testPayload = createTestPayload();
    }

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

        @Test
        void testGetUserInvestmentList_SuccessfulRetrieval() {
            // Arrange
            int userId = 123;
            String expectedSql = "SELECT * FROM investment WHERE user_id=? ORDER BY date DESC";

            List<Map<String, Object>> expectedResult = Arrays.asList(
                    createInvestmentMap(1, "Stock A", 1000.0, "2024-01-15"),
                    createInvestmentMap(2, "Bond B", 2000.0, "2024-01-10")
            );

            try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
                // Mock SecurityContextHolder
                mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
                when(securityContext.getAuthentication()).thenReturn(authentication);
                when(authentication.getName()).thenReturn(String.valueOf(userId));

                // Mock JdbcTemplate
                when(jdbcTemplate.queryForList(expectedSql, userId)).thenReturn(expectedResult);

                // Act
                List<Map<String, Object>> result = apiController.getUserInvestmentList();

                // Assert
                assertNotNull(result);
                assertEquals(2, result.size());
                assertEquals(expectedResult, result);

                // Verify interactions
                verify(jdbcTemplate).queryForList(expectedSql, userId);
            }
        }

        @Test
        void testGetUserInvestmentList_UserIdIsZero_ReturnsNull() {
            // Arrange
            int userId = 0;

            try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
                // Mock SecurityContextHolder
                mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
                when(securityContext.getAuthentication()).thenReturn(authentication);
                when(authentication.getName()).thenReturn(String.valueOf(userId));

                // Act
                List<Map<String, Object>> result = apiController.getUserInvestmentList();

                // Assert
                assertNull(result);

                // Verify that jdbcTemplate was never called
                verifyNoInteractions(jdbcTemplate);
            }
        }

        @Test
        void testGetUserInvestmentList_EmptyResultSet() {
            // Arrange
            int userId = 456;
            String expectedSql = "SELECT * FROM investment WHERE user_id=? ORDER BY date DESC";
            List<Map<String, Object>> emptyResult = new ArrayList<>();

            try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
                // Mock SecurityContextHolder
                mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
                when(securityContext.getAuthentication()).thenReturn(authentication);
                when(authentication.getName()).thenReturn(String.valueOf(userId));

                // Mock JdbcTemplate to return empty list
                when(jdbcTemplate.queryForList(expectedSql, userId)).thenReturn(emptyResult);

                // Act
                List<Map<String, Object>> result = apiController.getUserInvestmentList();

                // Assert
                assertNotNull(result);
                assertTrue(result.isEmpty());

                // Verify interactions
                verify(jdbcTemplate).queryForList(expectedSql, userId);
            }
        }

        @Test
        void testGetUserInvestmentList_DatabaseException_ReturnsNull() {
            // Arrange
            int userId = 789;
            String expectedSql = "SELECT * FROM investment WHERE user_id=? ORDER BY date DESC";

            try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
                // Mock SecurityContextHolder
                mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
                when(securityContext.getAuthentication()).thenReturn(authentication);
                when(authentication.getName()).thenReturn(String.valueOf(userId));

                // Mock JdbcTemplate to throw exception
                when(jdbcTemplate.queryForList(expectedSql, userId))
                        .thenThrow(new RuntimeException("Database connection failed"));

                // Act
                List<Map<String, Object>> result = apiController.getUserInvestmentList();

                // Assert
                assertNull(result);

                // Verify interactions
                verify(jdbcTemplate).queryForList(expectedSql, userId);
            }
        }

        @Test
        void testGetUserInvestmentList_NumberFormatException_WhenParsingUserId() {
            // Arrange
            String invalidUserId = "invalid_id";

            try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
                // Mock SecurityContextHolder
                mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
                when(securityContext.getAuthentication()).thenReturn(authentication);
                when(authentication.getName()).thenReturn(invalidUserId);

                // Act & Assert
                assertThrows(NumberFormatException.class, () -> {
                    apiController.getUserInvestmentList();
                });

                // Verify that jdbcTemplate was never called
                verifyNoInteractions(jdbcTemplate);
            }
        }

        @Test
        void testGetUserInvestmentList_NullAuthentication() {
            // Arrange
            try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
                // Mock SecurityContextHolder with null authentication
                mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
                when(securityContext.getAuthentication()).thenReturn(null);

                // Act & Assert
                assertThrows(NullPointerException.class, () -> {
                    apiController.getUserInvestmentList();
                });

                // Verify that jdbcTemplate was never called
                verifyNoInteractions(jdbcTemplate);
            }
        }

        @Test
        void testGetUserInvestmentList_NullSecurityContext() {
            // Arrange
            try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
                // Mock SecurityContextHolder to return null context
                mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(null);

                // Act & Assert
                assertThrows(NullPointerException.class, () -> {
                    apiController.getUserInvestmentList();
                });

                // Verify that jdbcTemplate was never called
                verifyNoInteractions(jdbcTemplate);
            }
        }

        @Test
        void testGetUserInvestmentList_ValidUserWithSpecificDatabaseException() {
            // Arrange
            int userId = 999;
            String expectedSql = "SELECT * FROM investment WHERE user_id=? ORDER BY date DESC";

            try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
                // Mock SecurityContextHolder
                mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
                when(securityContext.getAuthentication()).thenReturn(authentication);
                when(authentication.getName()).thenReturn(String.valueOf(userId));

                // Mock JdbcTemplate to throw specific SQL exception
                when(jdbcTemplate.queryForList(expectedSql, userId))
                        .thenThrow(new org.springframework.dao.DataAccessException("SQL Error") {});

                // Act
                List<Map<String, Object>> result = apiController.getUserInvestmentList();

                // Assert
                assertNull(result);

                // Verify interactions
                verify(jdbcTemplate).queryForList(expectedSql, userId);
            }
        }

        // Helper method to create test data
        private Map<String, Object> createInvestmentMap(int id, String name, double amount, String date) {
            Map<String, Object> investment = new HashMap<>();
            investment.put("id", id);
            investment.put("investment_name", name);
            investment.put("amount", amount);
            investment.put("date", date);
            investment.put("user_id", 123);
            return investment;
        }

        @Test
        void testUpdateUserProfile_SuccessfulUpdate() {
            // Arrange
            int userId = 123;
            String expectedTaxInfoSql = "UPDATE public.user_tax_info SET tin=?, is_resident=?, is_ff=?, is_female=?, is_disabled=?, tax_zone=?, tax_circle=?, area_name=? WHERE id=?";
            String expectedUserInfoSql = "UPDATE public.user_info SET name=?, phone=?, nid=?, dob=?, spouse_name=?, spouse_tin=? WHERE id=?";

            try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
                // Mock SecurityContextHolder
                mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
                when(securityContext.getAuthentication()).thenReturn(authentication);
                when(authentication.getName()).thenReturn(String.valueOf(userId));

                // Mock successful database updates
                when(jdbcTemplate.update(eq(expectedTaxInfoSql), any(), any(), any(), any(), any(), any(), any(), any(), eq(userId)))
                        .thenReturn(1);
                when(jdbcTemplate.update(eq(expectedUserInfoSql), any(), any(), any(), any(), any(), any(), eq(userId)))
                        .thenReturn(1);

                // Act
                ResponseEntity<Map<String, Object>> result = apiController.updateUserProfile(testPayload);

                // Assert
                assertEquals(HttpStatus.OK, result.getStatusCode());
                Map<String, Object> responseBody = result.getBody();
                assertNotNull(responseBody);
                assertTrue((Boolean) responseBody.get("success"));
                assertEquals("Profile updated successfully", responseBody.get("message"));
                assertEquals(2, responseBody.get("updated_records"));

                // Verify database calls
                verify(jdbcTemplate).update(eq(expectedTaxInfoSql),
                        eq("123456789"), eq(true), eq(false), eq(true), eq(false),
                        eq(1), eq(2), eq("Dhaka"), eq(userId));
                verify(jdbcTemplate).update(eq(expectedUserInfoSql),
                        eq("John Doe"), eq("01712345678"), eq("1234567890123"),
                        eq(Date.valueOf("1990-01-01")), eq("Jane Doe"), eq("987654321"), eq(userId));
            }
        }

        @Test
        void testUpdateUserProfile_UserNotAuthenticated() {
            // Arrange
            int userId = 0;

            try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
                // Mock SecurityContextHolder
                mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
                when(securityContext.getAuthentication()).thenReturn(authentication);
                when(authentication.getName()).thenReturn(String.valueOf(userId));

                // Act
                ResponseEntity<Map<String, Object>> result = apiController.updateUserProfile(testPayload);

                // Assert
                assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
                Map<String, Object> responseBody = result.getBody();
                assertNotNull(responseBody);
                assertFalse((Boolean) responseBody.get("success"));
                assertEquals("User not authenticated", responseBody.get("message"));

                // Verify no database calls
                verifyNoInteractions(jdbcTemplate);
            }
        }

        @Test
        void testUpdateUserProfile_InvalidDateFormat() {
            // Arrange
            int userId = 123;
            testPayload.put("dob", "invalid-date-format");

            try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
                mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
                when(securityContext.getAuthentication()).thenReturn(authentication);
                when(authentication.getName()).thenReturn(String.valueOf(userId));

                // Act
                ResponseEntity<Map<String, Object>> result = apiController.updateUserProfile(testPayload);

                // Assert
                assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
                Map<String, Object> responseBody = result.getBody();
                assertNotNull(responseBody);
                assertFalse((Boolean) responseBody.get("success"));
                assertEquals("Invalid date format. Expected format: YYYY-MM-DD", responseBody.get("message"));

                // Verify no database calls
                verifyNoInteractions(jdbcTemplate);
            }
        }

        @Test
        void testUpdateUserProfile_InvalidTaxCircleFormat() {
            // Arrange
            int userId = 123;
            testPayload.put("tax_circle", "invalid-number");

            try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
                mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
                when(securityContext.getAuthentication()).thenReturn(authentication);
                when(authentication.getName()).thenReturn(String.valueOf(userId));

                // Act
                ResponseEntity<Map<String, Object>> result = apiController.updateUserProfile(testPayload);

                // Assert
                assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
                Map<String, Object> responseBody = result.getBody();
                assertNotNull(responseBody);
                assertFalse((Boolean) responseBody.get("success"));
                assertEquals("Invalid tax_circle or tax_zone format", responseBody.get("message"));

                // Verify no database calls
                verifyNoInteractions(jdbcTemplate);
            }
        }

        @Test
        void testUpdateUserProfile_InvalidTaxZoneFormat() {
            // Arrange
            int userId = 123;
            testPayload.put("tax_zone", "invalid-number");

            try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
                mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
                when(securityContext.getAuthentication()).thenReturn(authentication);
                when(authentication.getName()).thenReturn(String.valueOf(userId));

                // Act
                ResponseEntity<Map<String, Object>> result = apiController.updateUserProfile(testPayload);

                // Assert
                assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
                Map<String, Object> responseBody = result.getBody();
                assertNotNull(responseBody);
                assertFalse((Boolean) responseBody.get("success"));
                assertEquals("Invalid tax_circle or tax_zone format", responseBody.get("message"));
            }
        }

        @Test
        void testUpdateUserProfile_DatabaseException() {
            // Arrange
            int userId = 123;

            try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
                mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
                when(securityContext.getAuthentication()).thenReturn(authentication);
                when(authentication.getName()).thenReturn(String.valueOf(userId));

                // Mock database exception
                when(jdbcTemplate.update(anyString(), (PreparedStatementSetter) any()))
                        .thenThrow(new RuntimeException("Database connection failed"));

                // Act
                ResponseEntity<Map<String, Object>> result = apiController.updateUserProfile(testPayload);

                // Assert
                assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
                Map<String, Object> responseBody = result.getBody();
                assertNotNull(responseBody);
                assertFalse((Boolean) responseBody.get("success"));
                assertTrue(((String) responseBody.get("message")).contains("Error updating profile"));
            }
        }

        @Test
        void testUpdateUserProfile_NumberFormatExceptionWhenParsingUserId() {
            // Arrange
            String invalidUserId = "invalid_id";

            try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
                mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
                when(securityContext.getAuthentication()).thenReturn(authentication);
                when(authentication.getName()).thenReturn(invalidUserId);

                // Act & Assert
                assertThrows(NumberFormatException.class, () -> {
                    apiController.updateUserProfile(testPayload);
                });

                verifyNoInteractions(jdbcTemplate);
            }
        }

    @Test
    void testChangePassword_SuccessfulPasswordChange() {
        // Arrange
        int userId = 123;
        Map<String, Object> payload = createPasswordPayload("oldPassword123", "newPassword456");
        String currentPasswordHash = "hashedOldPassword";
        String newPasswordHash = "hashedNewPassword";

        String getCurrentPasswordSql = "SELECT password_hash FROM public.credentials WHERE id = ?";
        String updatePasswordSql = "UPDATE public.credentials SET password_hash = ? WHERE id = ?";

        try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
            // Mock SecurityContextHolder
            mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
            when(securityContext.getAuthentication()).thenReturn(authentication);
            when(authentication.getName()).thenReturn(String.valueOf(userId));

            // Mock database operations
            when(jdbcTemplate.queryForObject(getCurrentPasswordSql, String.class, userId))
                    .thenReturn(currentPasswordHash);
            when(passwordEncoder.matches("oldPassword123", currentPasswordHash)).thenReturn(true);
            when(passwordEncoder.encode("newPassword456")).thenReturn(newPasswordHash);
            when(jdbcTemplate.update(updatePasswordSql, newPasswordHash, userId)).thenReturn(1);

            // Act
            ResponseEntity<Map<String, Object>> result = apiController.changePassword(payload);

            // Assert
            assertEquals(HttpStatus.OK, result.getStatusCode());
            Map<String, Object> responseBody = result.getBody();
            assertNotNull(responseBody);
            assertTrue((Boolean) responseBody.get("success"));
            assertEquals("Password changed successfully", responseBody.get("message"));

            // Verify interactions
            verify(jdbcTemplate).queryForObject(getCurrentPasswordSql, String.class, userId);
            verify(passwordEncoder).matches("oldPassword123", currentPasswordHash);
            verify(passwordEncoder).encode("newPassword456");
            verify(jdbcTemplate).update(updatePasswordSql, newPasswordHash, userId);
        }
    }

    @Test
    void testChangePassword_UserNotAuthenticated() {
        // Arrange
        int userId = 0;
        Map<String, Object> payload = createPasswordPayload("oldPassword123", "newPassword456");

        try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
            mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
            when(securityContext.getAuthentication()).thenReturn(authentication);
            when(authentication.getName()).thenReturn(String.valueOf(userId));

            // Act
            ResponseEntity<Map<String, Object>> result = apiController.changePassword(payload);

            // Assert
            assertEquals(HttpStatus.UNAUTHORIZED, result.getStatusCode());
            Map<String, Object> responseBody = result.getBody();
            assertNotNull(responseBody);
            assertFalse((Boolean) responseBody.get("success"));
            assertEquals("User not authenticated", responseBody.get("message"));

            // Verify no interactions with database or password encoder
            verifyNoInteractions(jdbcTemplate);
            verifyNoInteractions(passwordEncoder);
        }
    }

    @Test
    void testChangePassword_CurrentPasswordNull() {
        // Arrange
        int userId = 123;
        Map<String, Object> payload = createPasswordPayload(null, "newPassword456");

        try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
            mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
            when(securityContext.getAuthentication()).thenReturn(authentication);
            when(authentication.getName()).thenReturn(String.valueOf(userId));

            // Act
            ResponseEntity<Map<String, Object>> result = apiController.changePassword(payload);

            // Assert
            assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
            Map<String, Object> responseBody = result.getBody();
            assertNotNull(responseBody);
            assertFalse((Boolean) responseBody.get("success"));
            assertEquals("Current password is required", responseBody.get("message"));

            verifyNoInteractions(jdbcTemplate);
            verifyNoInteractions(passwordEncoder);
        }
    }

    @Test
    void testChangePassword_CurrentPasswordEmpty() {
        // Arrange
        int userId = 123;
        Map<String, Object> payload = createPasswordPayload("   ", "newPassword456");

        try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
            mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
            when(securityContext.getAuthentication()).thenReturn(authentication);
            when(authentication.getName()).thenReturn(String.valueOf(userId));

            // Act
            ResponseEntity<Map<String, Object>> result = apiController.changePassword(payload);

            // Assert
            assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
            Map<String, Object> responseBody = result.getBody();
            assertNotNull(responseBody);
            assertFalse((Boolean) responseBody.get("success"));
            assertEquals("Current password is required", responseBody.get("message"));

            verifyNoInteractions(jdbcTemplate);
            verifyNoInteractions(passwordEncoder);
        }
    }

    @Test
    void testChangePassword_NewPasswordNull() {
        // Arrange
        int userId = 123;
        Map<String, Object> payload = createPasswordPayload("oldPassword123", null);

        try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
            mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
            when(securityContext.getAuthentication()).thenReturn(authentication);
            when(authentication.getName()).thenReturn(String.valueOf(userId));

            // Act
            ResponseEntity<Map<String, Object>> result = apiController.changePassword(payload);

            // Assert
            assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
            Map<String, Object> responseBody = result.getBody();
            assertNotNull(responseBody);
            assertFalse((Boolean) responseBody.get("success"));
            assertEquals("New password is required", responseBody.get("message"));

            verifyNoInteractions(jdbcTemplate);
            verifyNoInteractions(passwordEncoder);
        }
    }

    @Test
    void testChangePassword_NewPasswordEmpty() {
        // Arrange
        int userId = 123;
        Map<String, Object> payload = createPasswordPayload("oldPassword123", "   ");

        try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
            mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
            when(securityContext.getAuthentication()).thenReturn(authentication);
            when(authentication.getName()).thenReturn(String.valueOf(userId));

            // Act
            ResponseEntity<Map<String, Object>> result = apiController.changePassword(payload);

            // Assert
            assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
            Map<String, Object> responseBody = result.getBody();
            assertNotNull(responseBody);
            assertFalse((Boolean) responseBody.get("success"));
            assertEquals("New password is required", responseBody.get("message"));

            verifyNoInteractions(jdbcTemplate);
            verifyNoInteractions(passwordEncoder);
        }
    }

    @Test
    void testChangePassword_UserCredentialsNotFound() {
        // Arrange
        int userId = 123;
        Map<String, Object> payload = createPasswordPayload("oldPassword123", "newPassword456");
        String getCurrentPasswordSql = "SELECT password_hash FROM public.credentials WHERE id = ?";

        try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
            mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
            when(securityContext.getAuthentication()).thenReturn(authentication);
            when(authentication.getName()).thenReturn(String.valueOf(userId));

            // Mock EmptyResultDataAccessException
            when(jdbcTemplate.queryForObject(getCurrentPasswordSql, String.class, userId))
                    .thenThrow(new org.springframework.dao.EmptyResultDataAccessException(1));

            // Act
            ResponseEntity<Map<String, Object>> result = apiController.changePassword(payload);

            // Assert
            assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
            Map<String, Object> responseBody = result.getBody();
            assertNotNull(responseBody);
            assertFalse((Boolean) responseBody.get("success"));
            assertEquals("User credentials not found", responseBody.get("message"));

            verify(jdbcTemplate).queryForObject(getCurrentPasswordSql, String.class, userId);
            verifyNoInteractions(passwordEncoder);
        }
    }

    @Test
    void testChangePassword_CurrentPasswordIncorrect() {
        // Arrange
        int userId = 123;
        Map<String, Object> payload = createPasswordPayload("wrongPassword", "newPassword456");
        String currentPasswordHash = "hashedOldPassword";
        String getCurrentPasswordSql = "SELECT password_hash FROM public.credentials WHERE id = ?";

        try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
            mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
            when(securityContext.getAuthentication()).thenReturn(authentication);
            when(authentication.getName()).thenReturn(String.valueOf(userId));

            when(jdbcTemplate.queryForObject(getCurrentPasswordSql, String.class, userId))
                    .thenReturn(currentPasswordHash);
            when(passwordEncoder.matches("wrongPassword", currentPasswordHash)).thenReturn(false);

            // Act
            ResponseEntity<Map<String, Object>> result = apiController.changePassword(payload);

            // Assert
            assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
            Map<String, Object> responseBody = result.getBody();
            assertNotNull(responseBody);
            assertFalse((Boolean) responseBody.get("success"));
            assertEquals("Current password is incorrect", responseBody.get("message"));

            verify(jdbcTemplate).queryForObject(getCurrentPasswordSql, String.class, userId);
            verify(passwordEncoder).matches("wrongPassword", currentPasswordHash);
            verify(passwordEncoder, never()).encode(anyString());
        }
    }

    @Test
    void testChangePassword_FailedToUpdatePassword() {
        // Arrange
        int userId = 123;
        Map<String, Object> payload = createPasswordPayload("oldPassword123", "newPassword456");
        String currentPasswordHash = "hashedOldPassword";
        String newPasswordHash = "hashedNewPassword";

        String getCurrentPasswordSql = "SELECT password_hash FROM public.credentials WHERE id = ?";
        String updatePasswordSql = "UPDATE public.credentials SET password_hash = ? WHERE id = ?";

        try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
            mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
            when(securityContext.getAuthentication()).thenReturn(authentication);
            when(authentication.getName()).thenReturn(String.valueOf(userId));

            when(jdbcTemplate.queryForObject(getCurrentPasswordSql, String.class, userId))
                    .thenReturn(currentPasswordHash);
            when(passwordEncoder.matches("oldPassword123", currentPasswordHash)).thenReturn(true);
            when(passwordEncoder.encode("newPassword456")).thenReturn(newPasswordHash);
            // Mock update returning 0 (no rows updated)
            when(jdbcTemplate.update(updatePasswordSql, newPasswordHash, userId)).thenReturn(0);

            // Act
            ResponseEntity<Map<String, Object>> result = apiController.changePassword(payload);

            // Assert
            assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
            Map<String, Object> responseBody = result.getBody();
            assertNotNull(responseBody);
            assertFalse((Boolean) responseBody.get("success"));
            assertEquals("Failed to update password", responseBody.get("message"));

            verify(jdbcTemplate).update(updatePasswordSql, newPasswordHash, userId);
        }
    }

    @Test
    void testChangePassword_DatabaseException() {
        // Arrange
        int userId = 123;
        Map<String, Object> payload = createPasswordPayload("oldPassword123", "newPassword456");
        String getCurrentPasswordSql = "SELECT password_hash FROM public.credentials WHERE id = ?";

        try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
            mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
            when(securityContext.getAuthentication()).thenReturn(authentication);
            when(authentication.getName()).thenReturn(String.valueOf(userId));

            // Mock database exception
            when(jdbcTemplate.queryForObject(getCurrentPasswordSql, String.class, userId))
                    .thenThrow(new RuntimeException("Database connection failed"));

            // Act
            ResponseEntity<Map<String, Object>> result = apiController.changePassword(payload);

            // Assert
            assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
            Map<String, Object> responseBody = result.getBody();
            assertNotNull(responseBody);
            assertFalse((Boolean) responseBody.get("success"));
            assertTrue(((String) responseBody.get("message")).contains("Error changing password"));
        }
    }

    @Test
    void testChangePassword_NumberFormatExceptionWhenParsingUserId() {
        // Arrange
        String invalidUserId = "invalid_id";
        Map<String, Object> payload = createPasswordPayload("oldPassword123", "newPassword456");

        try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
            mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
            when(securityContext.getAuthentication()).thenReturn(authentication);
            when(authentication.getName()).thenReturn(invalidUserId);

            // Act & Assert
            assertThrows(NumberFormatException.class, () -> {
                apiController.changePassword(payload);
            });

            verifyNoInteractions(jdbcTemplate);
            verifyNoInteractions(passwordEncoder);
        }
    }

    @Test
    void testGetTaxAreaListUser_SuccessfulRetrieval() {
        // Arrange
        String expectedSql = "SELECT DISTINCT area_name from rule_tax_area_list \n;";
        List<Map<String, Object>> expectedResult = Arrays.asList(
                createTaxAreaMap("Dhaka"),
                createTaxAreaMap("Chittagong"),
                createTaxAreaMap("Sylhet")
        );

        try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
            // Mock SecurityContextHolder (though not used in logic, it's called)
            mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
            when(securityContext.getAuthentication()).thenReturn(authentication);

            // Mock JdbcTemplate
            when(jdbcTemplate.queryForList(expectedSql)).thenReturn(expectedResult);

            // Act
            List<Map<String, Object>> result = apiController.getTaxAreaListUser();

            // Assert
            assertNotNull(result);
            assertEquals(3, result.size());
            assertEquals(expectedResult, result);

            // Verify interactions
            verify(jdbcTemplate).queryForList(expectedSql);
        }
    }

    @Test
    void testGetTaxAreaListUser_EmptyResultSet() {
        // Arrange
        String expectedSql = "SELECT DISTINCT area_name from rule_tax_area_list \n;";
        List<Map<String, Object>> emptyResult = new ArrayList<>();

        try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
            // Mock SecurityContextHolder
            mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
            when(securityContext.getAuthentication()).thenReturn(authentication);

            // Mock JdbcTemplate to return empty list
            when(jdbcTemplate.queryForList(expectedSql)).thenReturn(emptyResult);

            // Act
            List<Map<String, Object>> result = apiController.getTaxAreaListUser();

            // Assert
            assertNotNull(result);
            assertTrue(result.isEmpty());

            // Verify interactions
            verify(jdbcTemplate).queryForList(expectedSql);
        }
    }

    @Test
    void testGetTaxAreaListUser_DatabaseException_ReturnsNull() {
        // Arrange
        String expectedSql = "SELECT DISTINCT area_name from rule_tax_area_list \n;";

        try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
            // Mock SecurityContextHolder
            mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
            when(securityContext.getAuthentication()).thenReturn(authentication);

            // Mock JdbcTemplate to throw exception
            when(jdbcTemplate.queryForList(expectedSql))
                    .thenThrow(new RuntimeException("Database connection failed"));

            // Act
            List<Map<String, Object>> result = apiController.getTaxAreaListUser();

            // Assert
            assertNull(result);

            // Verify interactions
            verify(jdbcTemplate).queryForList(expectedSql);
        }
    }

    @Test
    void testGetTaxAreaListUser_DataAccessException_ReturnsNull() {
        // Arrange
        String expectedSql = "SELECT DISTINCT area_name from rule_tax_area_list \n;";

        try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
            // Mock SecurityContextHolder
            mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
            when(securityContext.getAuthentication()).thenReturn(authentication);

            // Mock JdbcTemplate to throw Spring DataAccessException
            when(jdbcTemplate.queryForList(expectedSql))
                    .thenThrow(new org.springframework.dao.DataAccessException("SQL Error") {});

            // Act
            List<Map<String, Object>> result = apiController.getTaxAreaListUser();

            // Assert
            assertNull(result);

            // Verify interactions
            verify(jdbcTemplate).queryForList(expectedSql);
        }
    }

    @Test
    void testGetTaxAreaListUser_SingleAreaResult() {
        // Arrange
        String expectedSql = "SELECT DISTINCT area_name from rule_tax_area_list \n;";
        List<Map<String, Object>> singleResult = Arrays.asList(createTaxAreaMap("Dhaka"));

        try (MockedStatic<SecurityContextHolder> mockedSecurityContext = mockStatic(SecurityContextHolder.class)) {
            // Mock SecurityContextHolder
            mockedSecurityContext.when(SecurityContextHolder::getContext).thenReturn(securityContext);
            when(securityContext.getAuthentication()).thenReturn(authentication);

            // Mock JdbcTemplate
            when(jdbcTemplate.queryForList(expectedSql)).thenReturn(singleResult);

            // Act
            List<Map<String, Object>> result = apiController.getTaxAreaListUser();

            // Assert
            assertNotNull(result);
            assertEquals(1, result.size());
            assertEquals("Dhaka", result.get(0).get("area_name"));

            // Verify interactions
            verify(jdbcTemplate).queryForList(expectedSql);
        }
    }


    @Test
    void testDownloadPdf_Success() throws Exception {
        // Arrange
        String fileName = "user_info_123_20240130.pdf";
        String userId = "123";

        Authentication mockAuth = mock(Authentication.class);
        SecurityContext mockSecurityContext = mock(SecurityContext.class);

        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        when(mockAuth.getName()).thenReturn(userId);

        SecurityContextHolder.setContext(mockSecurityContext);

        // Create the actual directory structure and file for testing
        File generatedPdfsDir = new File("generated_pdfs");
        generatedPdfsDir.mkdirs();

        File testFile = new File(generatedPdfsDir, fileName);
        testFile.createNewFile();

        // Write some content to make it a valid file with size
        try (java.io.FileWriter writer = new java.io.FileWriter(testFile)) {
            writer.write("Test PDF content for unit testing");
        }

        // Ensure cleanup
        testFile.deleteOnExit();
        generatedPdfsDir.deleteOnExit();

        // Act
        ResponseEntity<Resource> result = apiController.downloadPdf(fileName);

        // Assert
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertTrue(result.getBody() instanceof FileSystemResource);

        HttpHeaders headers = result.getHeaders();
        assertEquals("attachment; filename=\"" + fileName + "\"",
                headers.getFirst(HttpHeaders.CONTENT_DISPOSITION));
        assertEquals(MediaType.APPLICATION_PDF_VALUE,
                headers.getFirst(HttpHeaders.CONTENT_TYPE));
        assertTrue(result.getHeaders().getContentLength() > 0);

        // Clean up
        testFile.delete();
    }

    @Test
    void testDownloadPdf_Forbidden_InvalidFileName() {
        // Arrange
        String fileName = "user_info_456_20240130.pdf"; // Different user ID
        String userId = "123";

        Authentication mockAuth = mock(Authentication.class);
        SecurityContext mockSecurityContext = mock(SecurityContext.class);

        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        when(mockAuth.getName()).thenReturn(userId);

        SecurityContextHolder.setContext(mockSecurityContext);

        // Act
        ResponseEntity<Resource> result = apiController.downloadPdf(fileName);

        // Assert
        assertEquals(HttpStatus.FORBIDDEN, result.getStatusCode());
        assertNull(result.getBody());
    }

    @Test
    void testDownloadPdf_Forbidden_FileNameWithoutUserPrefix() {
        // Arrange
        String fileName = "some_other_file.pdf";
        String userId = "123";

        Authentication mockAuth = mock(Authentication.class);
        SecurityContext mockSecurityContext = mock(SecurityContext.class);

        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        when(mockAuth.getName()).thenReturn(userId);

        SecurityContextHolder.setContext(mockSecurityContext);

        // Act
        ResponseEntity<Resource> result = apiController.downloadPdf(fileName);

        // Assert
        assertEquals(HttpStatus.FORBIDDEN, result.getStatusCode());
        assertNull(result.getBody());
    }


    @Test
    void testDownloadPdf_NotFound_FileDoesNotExist() {
        // Arrange
        String fileName = "user_info_123_nonexistent_file.pdf";
        String userId = "123";

        Authentication mockAuth = mock(Authentication.class);
        SecurityContext mockSecurityContext = mock(SecurityContext.class);

        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        when(mockAuth.getName()).thenReturn(userId);

        SecurityContextHolder.setContext(mockSecurityContext);

        // Ensure the file doesn't exist by using a unique name
        // The method will try to find this file in generated_pdfs directory
        // Since we're not creating it, it won't exist

        // Act
        ResponseEntity<Resource> result = apiController.downloadPdf(fileName);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertNull(result.getBody());
    }

    // Helper method to create tax area map
    private Map<String, Object> createTaxAreaMap(String areaName) {
        Map<String, Object> taxArea = new HashMap<>();
        taxArea.put("area_name", areaName);
        return taxArea;
    }

    // Helper method to create password payload
    private Map<String, Object> createPasswordPayload(String currentPassword, String newPassword) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("currentPassword", currentPassword);
        payload.put("newPassword", newPassword);
        return payload;
    }


    // Helper method to create test payload
        private Map<String, Object> createTestPayload() {
            Map<String, Object> payload = new HashMap<>();
            payload.put("area_name", "Dhaka");
            payload.put("dob", "1990-01-01");
            payload.put("email", "john.doe@example.com");
            payload.put("name", "John Doe");
            payload.put("nid", "1234567890123");
            payload.put("phone", "01712345678");
            payload.put("spouse_name", "Jane Doe");
            payload.put("spouse_tin", "987654321");
            payload.put("tax_circle", "2");
            payload.put("tax_zone", "1");
            payload.put("tin", "123456789");
            payload.put("is_resident", true);
            payload.put("is_ff", false);
            payload.put("is_female", true);
            payload.put("is_disabled", false);
            return payload;
        }
}
