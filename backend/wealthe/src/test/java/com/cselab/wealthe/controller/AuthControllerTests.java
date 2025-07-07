package com.cselab.wealthe.controller;

import com.cselab.wealthe.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.jdbc.core.JdbcTemplate;

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
    
        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq("test@example.com"))).thenReturn(0)
                .thenReturn(42);
        when(passwordEncoder.encode("pass123")).thenReturn("hashedpass");
        // Allow any update with three args, but throw only for user_info insert
        when(jdbcTemplate.update(anyString(), any(), any())).thenReturn(1);
        doThrow(new DataAccessException("fail"){}).when(jdbcTemplate).update(startsWith("INSERT INTO public.user_info"), any(), any());
    
        assertThrows(DataAccessException.class, () -> authController.register(request));
    }

    @Test
    void testRegister_jwtGenerationFails() {
        Map<String, String> request = Map.of(
                "email", "test@example.com",
                "password", "pass123",
                "name", "Test User"
        );

        when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class), eq("test@example.com"))).thenReturn(0)
                .thenReturn(42);
        when(passwordEncoder.encode("pass123")).thenReturn("hashedpass");
        doNothing().when(jdbcTemplate).update(startsWith("INSERT INTO public.user_info"), any(), any());
        when(jwtUtil.generateToken("42")).thenThrow(new RuntimeException("jwt fail"));

        ResponseEntity<?> response = authController.register(request);

        assertEquals(400, response.getStatusCodeValue());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertTrue(((String)body.get("error")).contains("Registration failed:"));
    }
}
