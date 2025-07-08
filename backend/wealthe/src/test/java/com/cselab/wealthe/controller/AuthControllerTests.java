package com.cselab.wealthe.controller;

import com.cselab.wealthe.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
public class AuthControllerTests {

    @Mock
    JdbcTemplate jdbcTemplate;

    @Mock
    PasswordEncoder passwordEncoder;

    @Mock
    JwtUtil jwtUtil;

    @InjectMocks
    AuthController authController;

    @Test
    void testRegister_success() {
        Map<String, String> request = Map.of(
                "email", "test@example.com",
                "password", "pass123",
                "name", "Test User"
        );

        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq("test@example.com"))).thenReturn(0) // user does not exist
                .thenReturn(42); // new user id
        when(passwordEncoder.encode("pass123")).thenReturn("hashedpass");
        when(jwtUtil.generateToken("42")).thenReturn("jwt-token");

        ResponseEntity<?> response = authController.register(request);

        assertEquals(200, response.getStatusCodeValue());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals("User registered successfully", body.get("message"));
        assertEquals(42, body.get("userId"));
        assertEquals("jwt-token", body.get("token"));
        assertEquals("user", body.get("role"));
    }

    @Test
    void testRegister_missingEmailOrPassword() {
        Map<String, String> request = Map.of(
                "email", "",
                "password", "",
                "name", "Test User"
        );

        ResponseEntity<?> response = authController.register(request);

        assertEquals(400, response.getStatusCodeValue());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals("Email and password are required", body.get("error"));
    }

    @Test
    void testRegister_userAlreadyExists() {
        Map<String, String> request = Map.of(
                "email", "test@example.com",
                "password", "pass123",
                "name", "Test User"
        );

        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq("test@example.com"))).thenReturn(1);

        ResponseEntity<?> response = authController.register(request);

        assertEquals(400, response.getStatusCodeValue());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals("User already exists", body.get("error"));
    }

    @Test
    void testRegister_idNotCreated() {
        Map<String, String> request = Map.of(
                "email", "test@example.com",
                "password", "pass123",
                "name", "Test User"
        );

        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq("test@example.com"))).thenReturn(0) // user does not exist
                .thenReturn(null); // userId not created
        when(passwordEncoder.encode("pass123")).thenReturn("hashedpass");

        ResponseEntity<?> response = authController.register(request);

        assertEquals(400, response.getStatusCodeValue());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertEquals("Registration failed: ID not created", body.get("error"));
    }

    @Test
    void testRegister_userInfoInsertFails() {
        Map<String, String> request = Map.of(
                "email", "test@example.com",
                "password", "pass123",
                "name", "Test User"
        );

        // Step 1: simulate that user does not exist
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq("test@example.com")))
                .thenReturn(0) // user does not exist
                .thenReturn(42); // new inserted id

        // Step 2: encode password
        when(passwordEncoder.encode("pass123")).thenReturn("hashedpass");

        // Step 3: simulate successful insert into credentials
        when(jdbcTemplate.update(
                contains("INSERT INTO public.credentials"),
                eq("test@example.com"),
                eq("hashedpass"),
                eq("user")
        )).thenReturn(1);

        // ✅ Step 4: simulate failure when inserting into user_info
        doThrow(new DataAccessException("fail") {})
                .when(jdbcTemplate)
                .update(
                        contains("INSERT INTO public.user_info"),
                        eq(42),
                        eq("Test User")
                );

        // Step 5: assert exception thrown
        assertThrows(DataAccessException.class, () -> authController.register(request));
    }

    @Test
    void testRegister_jwtGenerationFails() {
        // Arrange
        Map<String, String> request = Map.of(
                "email", "test@example.com",
                "password", "pass123",
                "name", "Test User"
        );

        // Simulate email check: user does not exist, then return generated ID 42
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq("test@example.com")))
                .thenReturn(0) // First: email count check
                .thenReturn(42); // Then: return new user ID

        // Simulate password hashing
        when(passwordEncoder.encode("pass123")).thenReturn("hashedpass");

        // Stub INSERT INTO credentials
        when(jdbcTemplate.update(
                startsWith("INSERT INTO public.credentials"),
                anyString(), anyString(), anyString()
        )).thenReturn(1);

        // Stub INSERT INTO user_info
        when(jdbcTemplate.update(
                startsWith("INSERT INTO public.user_info"),
                anyInt(), anyString()
        )).thenReturn(1);

        // Simulate JWT generation failure
        when(jwtUtil.generateToken("42")).thenThrow(new RuntimeException("jwt fail"));

        // Act
        ResponseEntity<?> response = authController.register(request);

        // Assert
        assertEquals(400, response.getStatusCodeValue());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertTrue(((String) body.get("error")).contains("Registration failed:"));
    }

    @Test
    void testLogin_successful() {
        Map<String, String> request = Map.of(
                "email", "test@example.com",
                "password", "pass123"
        );

        Map<String, Object> userFromDb = new HashMap<>();
        userFromDb.put("id", 42);
        userFromDb.put("email", "test@example.com");
        userFromDb.put("password_hash", "hashedpass");
        userFromDb.put("role", "user");

        // Stub DB lookup
        when(jdbcTemplate.queryForList(anyString(), eq("test@example.com")))
                .thenReturn(List.of(userFromDb));

        // Stub password match
        when(passwordEncoder.matches("pass123", "hashedpass")).thenReturn(true);

        // Stub JWT token generation
        when(jwtUtil.generateToken("42")).thenReturn("jwt_token_abc");

        // Act
        ResponseEntity<?> response = authController.login(request);

        // Assert
        assertEquals(200, response.getStatusCodeValue());
        Map<String, Object> body = (Map<String, Object>) response.getBody();

        assertEquals("Login successful", body.get("message"));
        assertEquals("jwt_token_abc", body.get("token"));

        Map<String, Object> user = (Map<String, Object>) body.get("user");
        assertEquals(42, user.get("id"));
        assertEquals("test@example.com", user.get("email"));
        assertEquals("user", user.get("role"));
    }

    @Test
    void testLogin_invalidPassword() {
        Map<String, String> request = Map.of(
                "email", "test@example.com",
                "password", "wrongpass"
        );

        Map<String, Object> userFromDb = new HashMap<>();
        userFromDb.put("id", 42);
        userFromDb.put("email", "test@example.com");
        userFromDb.put("password_hash", "hashedpass");
        userFromDb.put("role", "user");

        when(jdbcTemplate.queryForList(anyString(), eq("test@example.com")))
                .thenReturn(List.of(userFromDb));

        when(passwordEncoder.matches("wrongpass", "hashedpass")).thenReturn(false);

        ResponseEntity<?> response = authController.login(request);

        assertEquals(400, response.getStatusCodeValue());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertTrue(((String) body.get("error")).contains("Invalid credentials"));
    }

    @Test
    void testLogin_userNotFound() {
        Map<String, String> request = Map.of(
                "email", "unknown@example.com",
                "password", "whatever"
        );

        when(jdbcTemplate.queryForList(anyString(), eq("unknown@example.com")))
                .thenReturn(List.of());

        ResponseEntity<?> response = authController.login(request);

        assertEquals(400, response.getStatusCodeValue());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertTrue(((String) body.get("error")).contains("Invalid credentials"));
    }

    @Test
    void testLogin_missingEmailOrPassword() {
        Map<String, String> request = Map.of("email", "");

        ResponseEntity<?> response = authController.login(request);

        assertEquals(400, response.getStatusCodeValue());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertTrue(((String) body.get("error")).contains("Email and password are required"));
    }

}
