package com.cselab.wealthe.controller;

import com.cselab.wealthe.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
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
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String name = request.get("name");

        // Validation
        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        // Check if user already exists
        String checkUserSql = "SELECT COUNT(*) FROM credentials WHERE email = ?";
        Integer userCount = jdbcTemplate.queryForObject(checkUserSql, Integer.class, email);

        if (userCount != null && userCount > 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "User already exists"));
        }

        // Hash password and insert user
        String hashedPassword = passwordEncoder.encode(password);

//        String insertTax = """
//                INSERT INTO user_tax_info(
//                \ttin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name)
//                \tVALUES ('1234567890', TRUE, FALSE, FALSE, FALSE, 1, 2, 'Dhaka')
//                """;
        String insertCredentials = """
                INSERT INTO public.credentials(
                email, password_hash,role)
                VALUES (?, ?,?)
                """;
        //jdbcTemplate.update(insertTax);
        jdbcTemplate.update(insertCredentials,email,hashedPassword,"user");

        //Get the newly generated id for the user
        String getIdNew = "SELECT id FROM public.credentials WHERE email = ?";
        Integer userId = jdbcTemplate.queryForObject(getIdNew, Integer.class, email);
        System.out.println("Received new id :" + userId);

        if(userId==null){
            System.out.println("Error getting user ID");
            return ResponseEntity.badRequest().body(Map.of("error", "Registration failed: ID not created"));
        }

//        String insertSql = """
//                DO $$
//                DECLARE
//                    new_user_id INT;
//                BEGIN
//                    -- Insert into user_tax_info and get user_id
//                    INSERT INTO public.user_tax_info(
//                \ttin, is_resident, is_ff, is_female, is_disabled, tax_zone, tax_circle, area_name)
//                \tVALUES ('1234567890', TRUE, FALSE, FALSE, FALSE, 1, 2, 'Dhaka')
//                \tRETURNING id INTO new_user_id;
//
//                    -- Use the returned id in second insert
//                    INSERT INTO public.user_info(
//                \tid, name, phone, nid, dob, spouse_name, spouse_tin)
//                \tVALUES (new_user_id,?,'01234556778', '12345667890', '2002-1-1', null, null);
//
//                \tINSERT INTO public.credentials(
//                \tid, email, password_hash)
//                \tVALUES (new_user_id, ?, ?);
//
//                END;
//                $$;""";
        try {
            //jdbcTemplate.update(insertSql, name, email, hashedPassword);
            // Entry user's name
            String userInfoSql = "INSERT INTO public.user_info(\n" +
                    " \tid, name, phone, nid, dob, spouse_name, spouse_tin)\n" +
                    " \tVALUES (?,?,'0', '0', '2002-1-1', null, null)";
            jdbcTemplate.update(userInfoSql,userId, name);

            //String roleAssign = "user";
//            String credSQL = """
//                    \tINSERT INTO public.credentials(
//                    \tid, email, password_hash,role)
//                    \tVALUES (?, ?, ?,?)
//                    """;
            //jdbcTemplate.update(credSQL,userId, email, hashedPassword, roleAssign);
            System.out.println("User info inserted successfully");
        } catch (DataAccessException e) {
            System.err.println("Error inserting user data: " + e.getMessage());
            throw e;
        }

        try {


            // Generate and return JWT token
            String token="";
            token = jwtUtil.generateToken(userId.toString());

            return ResponseEntity.ok(Map.of(
                    "message", "User registered successfully",
                    "userId", userId,
                    "token", token,
                    "role", "user"

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
        //System.out.println(password);


        // Validation
        if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email and password are required"));
        }

        try {
            // Get user from database
            String sql = "SELECT id, email, password_hash,role FROM credentials WHERE email = ?";
            List<Map<String, Object>> users = jdbcTemplate.queryForList(sql, email);

            if (users.isEmpty()) {
                System.out.println("No user found by email");
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
            }

            //test : attempting to read db returned value
            System.out.println(users.get(0).get("email"));
            System.out.println(users.get(0).get("id"));

            Map<String, Object> user = users.get(0);
            String storedPassword = (String) user.get("password_hash");
            System.out.println(storedPassword);
            System.out.println(passwordEncoder.encode(password));

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