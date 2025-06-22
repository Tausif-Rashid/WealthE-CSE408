package com.cselab.wealthe.controller;

import com.cselab.wealthe.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class AuthController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    @CrossOrigin(origins = "*")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String name = request.get("name");

        // Validation
        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        // Check if user already exists
        String checkUserSql = "SELECT COUNT(*) FROM users WHERE email = ?";
        Integer userCount = jdbcTemplate.queryForObject(checkUserSql, Integer.class, email);

        if (userCount != null && userCount > 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "User already exists"));
        }

        // Hash password and insert user
        String hashedPassword = passwordEncoder.encode(password);
        String insertSql = "INSERT INTO users (email, password, name, created_at) VALUES (?, ?, ?, NOW()) RETURNING id";

        try {
            Integer userId = jdbcTemplate.queryForObject(insertSql, Integer.class, email, hashedPassword, name);

            // Generate JWT token
            String token = jwtUtil.generateToken(userId.toString());

            return ResponseEntity.ok(Map.of(
                    "message", "User registered successfully",
                    "userId", userId,
                    "token", token
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    @CrossOrigin(origins = "*")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        System.out.println(email);
        System.out.println(password);


        // Validation
        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        try {
            // Get user from database
            String sql = "SELECT id, email, password_hash,role FROM credentials WHERE email = ?";
            List<Map<String, Object>> users = jdbcTemplate.queryForList(sql, email);

            if (users.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
            }

            Map<String, Object> user = users.get(0);
            String storedPassword = (String) user.get("password_hash");
            System.out.println(storedPassword);
            System.out.println(passwordEncoder.encode(storedPassword));

            // Verify password
            if (!passwordEncoder.matches(password, storedPassword)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
            }

            // Generate JWT token
            String token = jwtUtil.generateToken( user.get("id").toString());

            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "token", token,
                    "user", Map.of(
                            "id", user.get("id"),
                            "email", user.get("email"),
                            "role", user.get("role")
                    )
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }
}