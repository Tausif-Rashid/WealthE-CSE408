package com.cselab.wealthe.controller;

// Required imports
import com.cselab.wealthe.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.PreparedStatementSetter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.util.*;

import org.slf4j.Logger;

@ExtendWith(MockitoExtension.class)
class TaxControllerTests {

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private JdbcTemplate jdbcTemplate;

    // Note: Logger should be mocked carefully or use static mocking
    @Mock
    private Logger logger;

    @InjectMocks
    private TaxController taxController;

    private Authentication mockAuth;
    private SecurityContext mockSecurityContext;

    @BeforeEach
    void setUp() {
        mockAuth = mock(Authentication.class);
        mockSecurityContext = mock(SecurityContext.class);
        when(mockSecurityContext.getAuthentication()).thenReturn(mockAuth);
        SecurityContextHolder.setContext(mockSecurityContext);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    // ==================== getTaxIncome Tests ====================

    @Test
    void testGetTaxIncome_WithTaxFormData_Success() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(123))).thenReturn(1);

        Map<String, Object> formData = new HashMap<>();
        formData.put("income_salary", 50000.0);
        formData.put("income_agriculture", 20000.0);
        formData.put("income_rent", 15000.0);
        formData.put("income_interest", 5000.0);
        formData.put("income_others", 10000.0);

        when(jdbcTemplate.queryForMap(anyString(), eq(123))).thenReturn(formData);

        // Act
        Map<String, Object> result = taxController.getTaxIncome();

        // Assert
        assertEquals(50000.0, result.get("salary"));
        assertEquals(20000.0, result.get("agriculture"));
        assertEquals(15000.0, result.get("rent"));
        assertEquals(5000.0, result.get("interest"));
        assertEquals(10000.0, result.get("other"));
    }

    @Test
    void testGetTaxIncome_NoTaxFormData_CalculatesFromIncome() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(123))).thenReturn(0);

        // Mock the individual income queries
        when(jdbcTemplate.queryForObject(contains("Salary"), eq(Double.class), eq(123), anyString())).thenReturn(30000.0);
        when(jdbcTemplate.queryForObject(contains("Agriculture"), eq(Double.class), eq(123), anyString())).thenReturn(10000.0);
        when(jdbcTemplate.queryForObject(contains("Rent"), eq(Double.class), eq(123), anyString())).thenReturn(8000.0);
        when(jdbcTemplate.queryForObject(contains("Interest"), eq(Double.class), eq(123), anyString())).thenReturn(2000.0);
        when(jdbcTemplate.queryForObject(contains("NOT IN"), eq(Double.class), eq(123), anyString())).thenReturn(5000.0);

        // Act
        Map<String, Object> result = taxController.getTaxIncome();

        // Assert
        assertEquals(30000.0, result.get("salary"));
        assertEquals(10000.0, result.get("agriculture"));
        assertEquals(8000.0, result.get("rent"));
        assertEquals(2000.0, result.get("interest"));
        assertEquals(5000.0, result.get("other"));
    }

    @Test
    void testGetTaxIncome_AuthenticationException() {
        // Arrange
        when(mockAuth.getName()).thenThrow(new RuntimeException("Authentication error"));

        // Act
        Map<String, Object> result = taxController.getTaxIncome();

        // Assert
        assertTrue(result.containsKey("error"));
        assertTrue(result.get("error").toString().contains("Failed to retrieve tax income data"));
    }

    @Test
    void testGetTaxIncome_EmptyResultDataAccessException() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(123))).thenReturn(1);
        when(jdbcTemplate.queryForMap(anyString(), eq(123))).thenThrow(new EmptyResultDataAccessException(1));

        // Mock fallback queries
        when(jdbcTemplate.queryForObject(contains("Salary"), eq(Double.class), eq(123), anyString())).thenReturn(25000.0);
        when(jdbcTemplate.queryForObject(contains("Agriculture"), eq(Double.class), eq(123), anyString())).thenReturn(0.0);
        when(jdbcTemplate.queryForObject(contains("Rent"), eq(Double.class), eq(123), anyString())).thenReturn(0.0);
        when(jdbcTemplate.queryForObject(contains("Interest"), eq(Double.class), eq(123), anyString())).thenReturn(0.0);
        when(jdbcTemplate.queryForObject(contains("NOT IN"), eq(Double.class), eq(123), anyString())).thenReturn(0.0);

        // Act
        Map<String, Object> result = taxController.getTaxIncome();

        // Assert
        assertEquals(25000.0, result.get("salary"));
        assertEquals(0.0, result.get("agriculture"));
    }

    // ==================== getTaxExpense Tests ====================

    @Test
    void testGetTaxExpense_WithTaxFormData_Success() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(123))).thenReturn(1);

        Map<String, Object> formData = new HashMap<>();
        formData.put("expense_personal", 10000.0);
        formData.put("expense_housing", 20000.0);
        formData.put("expense_utility", 5000.0);
        formData.put("expense_education", 8000.0);
        formData.put("expense_transport", 3000.0);
        formData.put("expense_others", 2000.0);

        when(jdbcTemplate.queryForMap(anyString(), eq(123))).thenReturn(formData);

        // Act
        Map<String, Object> result = taxController.getTaxExpense();

        // Assert
        assertEquals(10000.0, result.get("personal"));
        assertEquals(20000.0, result.get("housing"));
        assertEquals(5000.0, result.get("utility"));
        assertEquals(8000.0, result.get("education"));
        assertEquals(3000.0, result.get("transportation"));
        assertEquals(2000.0, result.get("others"));
    }

    @Test
    void testGetTaxExpense_NoTaxFormData_CalculatesFromExpense() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(123))).thenReturn(0);

        // Mock the individual expense queries
        when(jdbcTemplate.queryForObject(contains("Rent"), eq(Double.class), eq(123), anyString())).thenReturn(15000.0);
        when(jdbcTemplate.queryForObject(contains("Utility"), eq(Double.class), eq(123), anyString())).thenReturn(4000.0);
        when(jdbcTemplate.queryForObject(contains("Educational"), eq(Double.class), eq(123), anyString())).thenReturn(6000.0);
        when(jdbcTemplate.queryForObject(contains("Transportation"), eq(Double.class), eq(123), anyString())).thenReturn(2500.0);
        when(jdbcTemplate.queryForObject(contains("Others"), eq(Double.class), eq(123), anyString())).thenReturn(1500.0);
        when(jdbcTemplate.queryForObject(contains("NOT IN"), eq(Double.class), eq(123), anyString())).thenReturn(8000.0);

        // Act
        Map<String, Object> result = taxController.getTaxExpense();

        // Assert
        assertEquals(8000.0, result.get("personal"));
        assertEquals(15000.0, result.get("housing"));
        assertEquals(4000.0, result.get("utility"));
        assertEquals(6000.0, result.get("education"));
        assertEquals(2500.0, result.get("transportation"));
        assertEquals(1500.0, result.get("others"));
    }

    @Test
    void testGetTaxExpense_Exception() {
        // Arrange
        when(mockAuth.getName()).thenThrow(new RuntimeException("Database error"));

        // Act
        Map<String, Object> result = taxController.getTaxExpense();

        // Assert
        assertTrue(result.containsKey("error"));
        assertTrue(result.get("error").toString().contains("Failed to retrieve tax expense data"));
    }

    // ==================== getTaxAsset Tests ====================

//    @Test
//    void testGetTaxAsset_WithTaxFormData_Success() {
//        // Arrange
//        String userId = "123";
//        when(mockAuth.getName()).thenReturn(userId);
//        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(123))).thenReturn(1);
//
//        Map<String, Object> formData = new HashMap<>();
//        formData.put("asset_bank_balance", 100000.0);
//        formData.put("asset_cars", 500000.0);
//        formData.put("asset_flats", 2000000.0);
//        formData.put("asset_jewellery", 50000.0);
//        formData.put("asset_plots", 1000000.0);
//
//        when(jdbcTemplate.queryForMap(anyString(), eq(123))).thenReturn(formData);
//
//        // Act
//        Map<String, Object> result = taxController.getTaxAsset();
//
//        // Assert
//        assertEquals(100000.0, result.get("bankAccount"));
//        assertEquals(500000.0, result.get("car"));
//        assertEquals(2000000.0, result.get("flat"));
//        assertEquals(50000.0, result.get("jewelry"));
//        assertEquals(1000000.0, result.get("plot"));
//    }

    @Test
    void testGetTaxAsset_NoTaxFormData_CalculatesFromAssetTables() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(123))).thenReturn(0);

        // Mock the individual asset queries
        when(jdbcTemplate.queryForObject(contains("asset_bank_account"), eq(Double.class), eq(123))).thenReturn(75000.0);
        when(jdbcTemplate.queryForObject(contains("asset_car"), eq(Double.class), eq(123))).thenReturn(400000.0);
        when(jdbcTemplate.queryForObject(contains("asset_flat"), eq(Double.class), eq(123))).thenReturn(1800000.0);
        when(jdbcTemplate.queryForObject(contains("asset_jewelery"), eq(Double.class), eq(123))).thenReturn(40000.0);
        when(jdbcTemplate.queryForObject(contains("asset_plot"), eq(Double.class), eq(123))).thenReturn(900000.0);

        // Act
        Map<String, Object> result = taxController.getTaxAsset();

        // Assert
        assertEquals(75000.0, result.get("bankAccount"));
        assertEquals(400000.0, result.get("car"));
        assertEquals(1800000.0, result.get("flat"));
        assertEquals(40000.0, result.get("jewellery"));
        assertEquals(900000.0, result.get("plot"));
    }

    // ==================== getTaxLiability Tests ====================

    @Test
    void testGetTaxLiability_WithTaxFormData_Success() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(123))).thenReturn(1);

        Map<String, Object> formData = new HashMap<>();
        formData.put("liability_bank_loan", 300000.0);
        formData.put("liability_person_loan", 50000.0);

        when(jdbcTemplate.queryForMap(anyString(), eq(123))).thenReturn(formData);

        // Act
        Map<String, Object> result = taxController.getTaxLiability();

        // Assert
        assertEquals(300000.0, result.get("bankLoan"));
        assertEquals(50000.0, result.get("personLoan"));
    }

    @Test
    void testGetTaxLiability_NoTaxFormData_CalculatesFromLiabilityTables() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(123))).thenReturn(0);

        when(jdbcTemplate.queryForObject(contains("liability_person_loan"), eq(Double.class), eq(123))).thenReturn(30000.0);
        when(jdbcTemplate.queryForObject(contains("liability_bank_loan"), eq(Double.class), eq(123))).thenReturn(250000.0);

        // Act
        Map<String, Object> result = taxController.getTaxLiability();

        // Assert
        assertEquals(30000.0, result.get("personLoan"));
        assertEquals(250000.0, result.get("bankLoan"));
    }

    // ==================== createTaxForm Tests ====================

//    @Test
//    void testCreateTaxForm_Success() {
//        // Arrange
//        String userId = "123";
//        when(mockAuth.getName()).thenReturn(userId);
//        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(123))).thenReturn(0);
//        when(jdbcTemplate.update(anyString(), eq(123))).thenReturn(1);
//
//        Map<String, Object> request = new HashMap<>();
//
//        // Act
//        Map<String, Object> result = taxController.createTaxForm(request);
//
//        // Assert
//        assertTrue((Boolean) result.get("success"));
//        assertEquals("Tax form created successfully", result.get("message"));
//        assertEquals(1, result.get("rowsAffected"));
//    }

    @Test
    void testCreateTaxForm_AlreadyExists() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(123))).thenReturn(1);

        Map<String, Object> request = new HashMap<>();

        // Act
        Map<String, Object> result = taxController.createTaxForm(request);

        // Assert
        assertTrue((Boolean) result.get("success"));
        assertEquals("Tax form already exists for this user", result.get("message"));
    }

//    @Test
//    void testCreateTaxForm_InsertFailed() {
//        // Arrange
//        String userId = "123";
//        when(mockAuth.getName()).thenReturn(userId);
//        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(123))).thenReturn(0);
//        when(jdbcTemplate.update(anyString(), eq(123))).thenReturn(0);
//
//        Map<String, Object> request = new HashMap<>();
//
//        // Act
//        Map<String, Object> result = taxController.createTaxForm(request);
//
//        // Assert
//        assertFalse((Boolean) result.get("success"));
//        assertEquals("Failed to create tax form", result.get("message"));
//    }

    @Test
    void testCreateTaxForm_Exception() {
        // Arrange
        when(mockAuth.getName()).thenThrow(new RuntimeException("Database error"));

        Map<String, Object> request = new HashMap<>();

        // Act
        Map<String, Object> result = taxController.createTaxForm(request);

        // Assert
        assertFalse((Boolean) result.get("success"));
        assertTrue(result.get("message").toString().contains("Failed to create tax form"));
    }

    // ==================== updateTaxFormIncome Tests ====================

    @Test
    void testUpdateTaxFormIncome_Success() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.update(anyString(), any(), any(), any(), any(), any(), eq(123))).thenReturn(1);

        Map<String, Object> request = new HashMap<>();
        request.put("income_salary", 50000.0);
        request.put("income_agriculture", 20000.0);
        request.put("income_rent", 15000.0);
        request.put("income_interest", 5000.0);
        request.put("income_others", 10000.0);

        // Act
        Map<String, Object> result = taxController.updateTaxFormIncome(request);

        // Assert
        assertTrue((Boolean) result.get("success"));
        assertEquals("Tax form income data updated successfully", result.get("message"));
        assertEquals(1, result.get("rowsAffected"));
    }

    @Test
    void testUpdateTaxFormIncome_NoRowsAffected() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.update(anyString(), any(), any(), any(), any(), any(), eq(123))).thenReturn(0);

        Map<String, Object> request = new HashMap<>();
        request.put("income_salary", 50000.0);

        // Act
        Map<String, Object> result = taxController.updateTaxFormIncome(request);

        // Assert
        assertFalse((Boolean) result.get("success"));
        assertEquals("No tax form found or form already submitted", result.get("message"));
    }

    @Test
    void testUpdateTaxFormIncome_NumberFormatException() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);

        Map<String, Object> request = new HashMap<>();
        request.put("income_salary", "invalid_number");

        // Act
        Map<String, Object> result = taxController.updateTaxFormIncome(request);

        // Assert
        assertFalse((Boolean) result.get("success"));
        assertTrue(result.get("message").toString().contains("Invalid number format"));
    }

    @Test
    void testUpdateTaxFormIncome_WithNullValues() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.update(anyString(), any(), any(), any(), any(), any(), eq(123))).thenReturn(1);

        Map<String, Object> request = new HashMap<>();
        request.put("income_salary", null);
        request.put("income_agriculture", 20000);
        request.put("income_rent", null);

        // Act
        Map<String, Object> result = taxController.updateTaxFormIncome(request);

        // Assert
        assertTrue((Boolean) result.get("success"));
        verify(jdbcTemplate).update(anyString(), eq(0.0), eq(20000.0), eq(0.0), eq(0.0), eq(0.0), eq(123));
    }

    // ==================== updateTaxFormExpense Tests ====================

    @Test
    void testUpdateTaxFormExpense_Success() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.update(anyString(), any(), any(), any(), any(), any(), any(), eq(123))).thenReturn(1);

        Map<String, Object> request = new HashMap<>();
        request.put("personal", 10000.0);
        request.put("housing", 20000.0);
        request.put("utility", 5000.0);
        request.put("education", 8000.0);
        request.put("transport", 3000.0);
        request.put("others", 2000.0);

        // Act
        Map<String, Object> result = taxController.updateTaxFormExpense(request);

        // Assert
        assertTrue((Boolean) result.get("success"));
        assertEquals("Tax form expense data updated successfully", result.get("message"));
    }

    // ==================== updateTaxFormInvestment Tests ====================

    @Test
    void testUpdateTaxFormInvestment_Success() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.update(anyString(), any(), any(), any(), any(), any(), eq(123))).thenReturn(1);

        Map<String, Object> request = new HashMap<>();
        request.put("three_month_sanchaypatra", 50000.0);
        request.put("five_years_sanchaypatra", 100000.0);
        request.put("Zakat", 5000.0);
        request.put("FDR", 25000.0);
        request.put("family_sanchaypatra", 30000.0);

        // Act
        Map<String, Object> result = taxController.updateTaxFormInvestment(request);

        // Assert
        assertTrue((Boolean) result.get("success"));
        assertEquals("Tax form investment data updated successfully", result.get("message"));
    }

    // ==================== updateTaxFormAssetLiability Tests ====================

    @Test
    void testUpdateTaxFormAssetLiability_Success() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.update(anyString(), any(), any(), any(), any(), any(), any(), any(), eq(123))).thenReturn(1);

        Map<String, Object> request = new HashMap<>();
        request.put("bankAccount", 100000.0);
        request.put("car", 500000.0);
        request.put("flat", 2000000.0);
        request.put("jewelery", 50000.0);
        request.put("plot", 1000000.0);
        request.put("bankLoan", 300000.0);
        request.put("personLoan", 50000.0);

        // Act
        Map<String, Object> result = taxController.updateTaxFormAssetLiability(request);

        // Assert
        assertTrue((Boolean) result.get("success"));
        assertEquals("Tax form asset and liability data updated successfully", result.get("message"));
    }

    // ==================== getTaxInvestment Tests ====================

    @Test
    void testGetTaxInvestment_WithTaxFormData_Success() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(123))).thenReturn(1);

        Map<String, Object> formData = new HashMap<>();
        formData.put("investment_3_month_shanchaypatra", 50000.0);
        formData.put("investment_5_years_shanchaypatra", 100000.0);
        formData.put("investment_fdr", 25000.0);
        formData.put("investment_zakat", 5000.0);
        formData.put("investment_family_shanchaypatra", 30000.0);

        when(jdbcTemplate.queryForMap(anyString(), eq(123))).thenReturn(formData);

        // Act
        Map<String, Object> result = taxController.getTaxInvestment();

        // Assert
        assertEquals(50000.0, result.get("threemonthshanchaypatra"));
        assertEquals(100000.0, result.get("fiveyearsshanchaypatra"));
        assertEquals(25000.0, result.get("fdr"));
        assertEquals(5000.0, result.get("zakat"));
        assertEquals(30000.0, result.get("familyshanchaypatra"));
    }

//    @Test
//    void testGetTaxInvestment_NoTaxFormData_CalculatesFromInvestmentTable() {
//        // Arrange
//        String userId = "123";
//        when(mockAuth.getName()).thenReturn(userId);
//        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(123))).thenReturn(0);
//
//        List<String> investmentTypes = Arrays.asList("FDR", "3 Month Shanchaypatra", "5 Years Shanchaypatra");
//        when(jdbcTemplate.queryForList(anyString(), eq(String.class))).thenReturn(investmentTypes);
//
//        when(jdbcTemplate.queryForObject(anyString(), eq(Double.class), eq(123), eq("FDR"), anyString())).thenReturn(20000.0);
//        when(jdbcTemplate.queryForObject(anyString(), eq(Double.class), eq(123), eq("3 Month Shanchaypatra"), anyString())).thenReturn(40000.0);
//        when(jdbcTemplate.queryForObject(anyString(), eq(Double.class), eq(123), eq("5 Years Shanchaypatra"), anyString())).thenReturn(80000.0);
//
//        // Act
//        Map<String, Object> result = taxController.getTaxInvestment();
//
//        // Assert
//        assertEquals(20000.0, result.get("fdr"));
//        assertEquals(40000.0, result.get("3monthshanchaypatra"));
//        assertEquals(80000.0, result.get("5yearsshanchaypatra"));
//    }

    // ==================== getTaxAmount Tests ====================

    @Test
    void testGetTaxAmount_Success() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);

        // Mock total income query
        when(jdbcTemplate.queryForObject(contains("total_income"), eq(Double.class), eq(123))).thenReturn(500000.0);

        // Mock investment data
        Map<String, Object> investmentData = new HashMap<>();
        investmentData.put("investment_3_month_shanchaypatra", 50000.0);
        investmentData.put("investment_5_years_shanchaypatra", 100000.0);
        investmentData.put("investment_fdr", 25000.0);
        investmentData.put("investment_zakat", 5000.0);
        investmentData.put("investment_family_shanchaypatra", 30000.0);

        when(jdbcTemplate.queryForMap(contains("investment"), eq(123))).thenReturn(investmentData);

        // Mock investment rules
        List<Map<String, Object>> investmentRules = new ArrayList<>();
        Map<String, Object> rule1 = new HashMap<>();
        rule1.put("title", "3 Month Shanchaypatra");
        rule1.put("rate_rebate", 15.0);
        investmentRules.add(rule1);

        when(jdbcTemplate.queryForList(contains("rule_investment_type"))).thenReturn(investmentRules);

        // Mock user category data
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("is_ff", false);
        userInfo.put("is_female", false);
        userInfo.put("is_disabled", false);
        when(jdbcTemplate.queryForMap(contains("user_tax_info"), eq(123))).thenReturn(userInfo);

        // Mock tax slabs
        List<Map<String, Object>> slabs = new ArrayList<>();
        Map<String, Object> slab1 = new HashMap<>();
        slab1.put("slab_no", 1);
        slab1.put("slab_length", 300000.0);
        slab1.put("tax_rate", 0.0);
        slabs.add(slab1);

        when(jdbcTemplate.queryForList(anyString(), eq("regular"))).thenReturn(slabs);

        // Mock minimum tax
        when(jdbcTemplate.queryForObject(contains("area_name"), eq(String.class), eq(123))).thenReturn("Dhaka");
        when(jdbcTemplate.queryForObject(contains("min_amount"), eq(Double.class), eq("Dhaka"))).thenReturn(5000.0);

        // Mock update query
        when(jdbcTemplate.update(anyString(), any(), any(), any(), any(), any(), eq(123))).thenReturn(1);

        // Act
        Map<String, Object> result = taxController.getTaxAmount();

        // Assert
        assertNotNull(result.get("gross_tax"));
        assertNotNull(result.get("rebate_amount"));
        assertNotNull(result.get("net_tax"));
        assertNotNull(result.get("min_tax"));
        assertNotNull(result.get("payable_tax"));
    }

    @Test
    void testGetTaxAmount_NoTaxFormFound() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.queryForObject(contains("total_income"), eq(Double.class), eq(123))).thenReturn(null);
        when(jdbcTemplate.queryForMap(contains("investment"), eq(123))).thenThrow(new EmptyResultDataAccessException(1));
        when(jdbcTemplate.queryForList(contains("rule_investment_type"))).thenReturn(new ArrayList<>());

        // Mock user info for category determination
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("is_ff", false);
        userInfo.put("is_female", false);
        userInfo.put("is_disabled", false);
        when(jdbcTemplate.queryForMap(contains("user_tax_info"), eq(123))).thenReturn(userInfo);

        // Mock tax slabs
        when(jdbcTemplate.queryForList(anyString(), eq("regular"))).thenReturn(new ArrayList<>());

        // Mock area and minimum tax
        when(jdbcTemplate.queryForObject(contains("area_name"), eq(String.class), eq(123))).thenReturn("Rest");
        when(jdbcTemplate.queryForObject(contains("min_amount"), eq(Double.class), eq("Rest"))).thenReturn(3000.0);

        // Mock update returns 0 (no rows affected)
        when(jdbcTemplate.update(anyString(), any(), any(), any(), any(), any(), eq(123))).thenReturn(0);

        // Act
        Map<String, Object> result = taxController.getTaxAmount();

        // Assert
        assertTrue(result.containsKey("error"));
        assertEquals("No tax form found or form already submitted", result.get("error"));
    }

    // ==================== submitTaxForm Tests ====================

    @Test
    void testSubmitTaxForm_Success() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.update(anyString(), eq(123))).thenReturn(1);

        Map<String, Object> request = new HashMap<>();

        // Act
        Map<String, Object> result = taxController.submitTaxForm(request);

        // Assert
        assertTrue((Boolean) result.get("success"));
        assertEquals("Tax form submitted successfully", result.get("message"));
        assertEquals(1, result.get("rowsAffected"));
    }

    @Test
    void testSubmitTaxForm_NoRowsAffected() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.update(anyString(), eq(123))).thenReturn(0);

        Map<String, Object> request = new HashMap<>();

        // Act
        Map<String, Object> result = taxController.submitTaxForm(request);

        // Assert
        assertFalse((Boolean) result.get("success"));
        assertEquals("No tax form found or form already submitted", result.get("message"));
    }

    @Test
    void testSubmitTaxForm_Exception() {
        // Arrange
        when(mockAuth.getName()).thenThrow(new RuntimeException("Database error"));

        Map<String, Object> request = new HashMap<>();

        // Act
        Map<String, Object> result = taxController.submitTaxForm(request);

        // Assert
        assertFalse((Boolean) result.get("success"));
        assertTrue(result.get("message").toString().contains("Failed to submit tax form"));
    }

    // ==================== Edge Case Tests ====================

    @Test
    void testGetTaxIncome_WithNullValues() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(123))).thenReturn(1);

        Map<String, Object> formData = new HashMap<>();
        formData.put("income_salary", null);
        formData.put("income_agriculture", null);
        formData.put("income_rent", null);
        formData.put("income_interest", null);
        formData.put("income_others", null);

        when(jdbcTemplate.queryForMap(anyString(), eq(123))).thenReturn(formData);

        // Act
        Map<String, Object> result = taxController.getTaxIncome();

        // Assert
        assertEquals(0.0, result.get("salary"));
        assertEquals(0.0, result.get("agriculture"));
        assertEquals(0.0, result.get("rent"));
        assertEquals(0.0, result.get("interest"));
        assertEquals(0.0, result.get("other"));
    }

    @Test
    void testUpdateTaxFormIncome_WithMixedDataTypes() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.update(anyString(), any(), any(), any(), any(), any(), eq(123))).thenReturn(1);

        Map<String, Object> request = new HashMap<>();
        request.put("income_salary", 50000); // Integer
        request.put("income_agriculture", 20000.5); // Double
        request.put("income_rent", "15000"); // String
        request.put("income_interest", 5000L); // Long
        request.put("income_others", null); // Null

        // Act
        Map<String, Object> result = taxController.updateTaxFormIncome(request);

        // Assert
        assertTrue((Boolean) result.get("success"));
        verify(jdbcTemplate).update(anyString(), eq(50000.0), eq(20000.5), eq(15000.0), eq(5000.0), eq(0.0), eq(123));
    }

    @Test
    void testGetTaxAsset_WithKeyMismatch() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq(123))).thenReturn(0);

        // Mock queries returning null
        when(jdbcTemplate.queryForObject(contains("asset_bank_account"), eq(Double.class), eq(123))).thenReturn(null);
        when(jdbcTemplate.queryForObject(contains("asset_car"), eq(Double.class), eq(123))).thenReturn(null);
        when(jdbcTemplate.queryForObject(contains("asset_flat"), eq(Double.class), eq(123))).thenReturn(null);
        when(jdbcTemplate.queryForObject(contains("asset_jewelery"), eq(Double.class), eq(123))).thenReturn(null);
        when(jdbcTemplate.queryForObject(contains("asset_plot"), eq(Double.class), eq(123))).thenReturn(null);

        // Act
        Map<String, Object> result = taxController.getTaxAsset();

        // Assert
        assertEquals(0.0, result.get("bankAccount"));
        assertEquals(0.0, result.get("car"));
        assertEquals(0.0, result.get("flat"));
        assertEquals(0.0, result.get("jewellery"));
        assertEquals(0.0, result.get("plot"));
    }

    @Test
    void testGetTaxAmount_WithComplexUserCategory() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);

        // Mock income
        when(jdbcTemplate.queryForObject(contains("total_income"), eq(Double.class), eq(123))).thenReturn(800000.0);

        // Mock investment data
        when(jdbcTemplate.queryForMap(contains("investment"), eq(123))).thenThrow(new EmptyResultDataAccessException(1));
        when(jdbcTemplate.queryForList(contains("rule_investment_type"))).thenReturn(new ArrayList<>());

        // Mock user info for female category
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("is_ff", false);
        userInfo.put("is_female", true);
        userInfo.put("is_disabled", false);
        when(jdbcTemplate.queryForMap(contains("user_tax_info"), eq(123))).thenReturn(userInfo);

        // Mock tax slabs for female category
        List<Map<String, Object>> slabs = new ArrayList<>();
        Map<String, Object> slab1 = new HashMap<>();
        slab1.put("slab_no", 1);
        slab1.put("slab_length", 350000.0);
        slab1.put("tax_rate", 0.0);
        slabs.add(slab1);

        Map<String, Object> slab2 = new HashMap<>();
        slab2.put("slab_no", 2);
        slab2.put("slab_length", 450000.0);
        slab2.put("tax_rate", 5.0);
        slabs.add(slab2);

        when(jdbcTemplate.queryForList(anyString(), eq("female"))).thenReturn(slabs);

        // Mock area and minimum tax
        when(jdbcTemplate.queryForObject(contains("area_name"), eq(String.class), eq(123))).thenReturn("Chittagong");
        when(jdbcTemplate.queryForObject(contains("min_amount"), eq(Double.class), eq("Chittagong"))).thenReturn(4000.0);

        // Mock update
        when(jdbcTemplate.update(anyString(), any(), any(), any(), any(), any(), eq(123))).thenReturn(1);

        // Act
        Map<String, Object> result = taxController.getTaxAmount();

        // Assert
        assertNotNull(result.get("gross_tax"));
        assertNotNull(result.get("rebate_amount"));
        assertNotNull(result.get("net_tax"));
        assertNotNull(result.get("min_tax"));
        assertNotNull(result.get("payable_tax"));
        verify(jdbcTemplate).queryForList(anyString(), eq("female"));
    }

    @Test
    void testGetTaxAmount_DisabledUserCategory() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);

        when(jdbcTemplate.queryForObject(contains("total_income"), eq(Double.class), eq(123))).thenReturn(600000.0);
        when(jdbcTemplate.queryForMap(contains("investment"), eq(123))).thenThrow(new EmptyResultDataAccessException(1));
        when(jdbcTemplate.queryForList(contains("rule_investment_type"))).thenReturn(new ArrayList<>());

        // Mock user info for disabled category
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("is_ff", false);
        userInfo.put("is_female", false);
        userInfo.put("is_disabled", true);
        when(jdbcTemplate.queryForMap(contains("user_tax_info"), eq(123))).thenReturn(userInfo);

        when(jdbcTemplate.queryForList(anyString(), eq("disabled"))).thenReturn(new ArrayList<>());
        when(jdbcTemplate.queryForObject(contains("area_name"), eq(String.class), eq(123))).thenReturn("Sylhet");
        when(jdbcTemplate.queryForObject(contains("min_amount"), eq(Double.class), eq("Sylhet"))).thenReturn(2500.0);
        when(jdbcTemplate.update(anyString(), any(), any(), any(), any(), any(), eq(123))).thenReturn(1);

        // Act
        Map<String, Object> result = taxController.getTaxAmount();

        // Assert
        verify(jdbcTemplate).queryForList(anyString(), eq("disabled"));
    }

    @Test
    void testGetTaxAmount_ElderlyUserCategory() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);

        when(jdbcTemplate.queryForObject(contains("total_income"), eq(Double.class), eq(123))).thenReturn(400000.0);
        when(jdbcTemplate.queryForMap(contains("investment"), eq(123))).thenThrow(new EmptyResultDataAccessException(1));
        when(jdbcTemplate.queryForList(contains("rule_investment_type"))).thenReturn(new ArrayList<>());

        // Mock user info for regular user
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("is_ff", false);
        userInfo.put("is_female", false);
        userInfo.put("is_disabled", false);
        when(jdbcTemplate.queryForMap(contains("user_tax_info"), eq(123))).thenReturn(userInfo);

        // Mock birth date for elderly user (age 70)
        String birthDate = LocalDate.now().minusYears(70).toString();
        when(jdbcTemplate.queryForObject(contains("birth_date"), eq(String.class), eq(123))).thenReturn(birthDate);

        when(jdbcTemplate.queryForList(anyString(), eq("elderly"))).thenReturn(new ArrayList<>());
        when(jdbcTemplate.queryForObject(contains("area_name"), eq(String.class), eq(123))).thenReturn("Rajshahi");
        when(jdbcTemplate.queryForObject(contains("min_amount"), eq(Double.class), eq("Rajshahi"))).thenReturn(3500.0);
        when(jdbcTemplate.update(anyString(), any(), any(), any(), any(), any(), eq(123))).thenReturn(1);

        // Act
        Map<String, Object> result = taxController.getTaxAmount();

        // Assert
        verify(jdbcTemplate).queryForList(anyString(), eq("elderly"));
    }

    @Test
    void testGetTaxAmount_FFUserCategory() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);

        when(jdbcTemplate.queryForObject(contains("total_income"), eq(Double.class), eq(123))).thenReturn(700000.0);
        when(jdbcTemplate.queryForMap(contains("investment"), eq(123))).thenThrow(new EmptyResultDataAccessException(1));
        when(jdbcTemplate.queryForList(contains("rule_investment_type"))).thenReturn(new ArrayList<>());

        // Mock user info for FF (Freedom Fighter) category
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("is_ff", true);
        userInfo.put("is_female", false);
        userInfo.put("is_disabled", false);
        when(jdbcTemplate.queryForMap(contains("user_tax_info"), eq(123))).thenReturn(userInfo);

        when(jdbcTemplate.queryForList(anyString(), eq("ff"))).thenReturn(new ArrayList<>());
        when(jdbcTemplate.queryForObject(contains("area_name"), eq(String.class), eq(123))).thenReturn("Barisal");
        when(jdbcTemplate.queryForObject(contains("min_amount"), eq(Double.class), eq("Barisal"))).thenReturn(2000.0);
        when(jdbcTemplate.update(anyString(), any(), any(), any(), any(), any(), eq(123))).thenReturn(1);

        // Act
        Map<String, Object> result = taxController.getTaxAmount();

        // Assert
        verify(jdbcTemplate).queryForList(anyString(), eq("ff"));
    }

    @Test
    void testGetTaxInvestment_Exception() {
        // Arrange
        when(mockAuth.getName()).thenThrow(new RuntimeException("Authentication failed"));

        // Act
        Map<String, Object> result = taxController.getTaxInvestment();

        // Assert
        assertTrue(result.containsKey("error"));
        assertTrue(result.get("error").toString().contains("Failed to retrieve investment data"));
    }

    @Test
    void testUpdateTaxFormExpense_NumberFormatException() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);

        Map<String, Object> request = new HashMap<>();
        request.put("personal", "not_a_number");

        // Act
        Map<String, Object> result = taxController.updateTaxFormExpense(request);

        // Assert
        assertFalse((Boolean) result.get("success"));
        assertTrue(result.get("message").toString().contains("Invalid number format"));
    }

    @Test
    void testUpdateTaxFormInvestment_Exception() {
        // Arrange
        when(mockAuth.getName()).thenThrow(new RuntimeException("Database connection failed"));

        Map<String, Object> request = new HashMap<>();

        // Act
        Map<String, Object> result = taxController.updateTaxFormInvestment(request);

        // Assert
        assertFalse((Boolean) result.get("success"));
        assertTrue(result.get("message").toString().contains("Failed to update tax form investment"));
    }

    @Test
    void testUpdateTaxFormAssetLiability_NumberFormatException() {
        // Arrange
        String userId = "123";
        when(mockAuth.getName()).thenReturn(userId);

        Map<String, Object> request = new HashMap<>();
        request.put("bankAccount", "invalid");

        // Act
        Map<String, Object> result = taxController.updateTaxFormAssetLiability(request);

        // Assert
        assertFalse((Boolean) result.get("success"));
        assertTrue(result.get("message").toString().contains("Invalid number format"));
    }
}
