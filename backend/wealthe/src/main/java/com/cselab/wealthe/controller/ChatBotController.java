package com.cselab.wealthe.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClientException;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import jakarta.annotation.PostConstruct;

@RestController
public class ChatBotController {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent}")
    private String geminiApiUrl;

    @PostConstruct
    public void validateConfiguration() {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            System.err.println("WARNING: gemini.api.key is not configured. Please set it in application.properties or as an environment variable.");
        }
    }

    @PostMapping("/user/chatbot")
    @CrossOrigin(origins = "*")
    public ResponseEntity<Map<String, Object>> chatbot(@RequestBody Map<String, Object> payload) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Check if API key is configured
            if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Gemini API key is not configured. Please contact administrator.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

            // Extract question from payload
            String question = (String) payload.get("question");

            if (question == null || question.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Question is required");
                return ResponseEntity.badRequest().body(response);
            }

            // Append Bangladesh tax rule context
            String enhancedQuestion = question + " - reply this question in terms of bangladeshi tax rule";

            // Prepare request for Gemini API
            Map<String, Object> geminiRequest = new HashMap<>();

            // Create contents array
            List<Map<String, Object>> contents = new ArrayList<>();
            Map<String, Object> content = new HashMap<>();

            List<Map<String, Object>> parts = new ArrayList<>();
            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", enhancedQuestion);
            parts.add(textPart);

            content.put("parts", parts);
            contents.add(content);

            geminiRequest.put("contents", contents);

            // Set up headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", geminiApiKey);

            // Create HTTP entity
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(geminiRequest, headers);

            // Make API call to Gemini
            ResponseEntity<String> geminiResponse = restTemplate.postForEntity(
                    geminiApiUrl, entity, String.class
            );

            if (geminiResponse.getStatusCode() == HttpStatus.OK) {
                // Parse Gemini response
                ObjectMapper mapper = new ObjectMapper();
                JsonNode responseNode = mapper.readTree(geminiResponse.getBody());

                // Extract the text from Gemini response
                String geminiReply = "";
                if (responseNode.has("candidates") &&
                        responseNode.get("candidates").isArray() &&
                        responseNode.get("candidates").size() > 0) {

                    JsonNode candidate = responseNode.get("candidates").get(0);
                    if (candidate.has("content") &&
                            candidate.get("content").has("parts") &&
                            candidate.get("content").get("parts").isArray() &&
                            candidate.get("content").get("parts").size() > 0) {

                        JsonNode responsePart = candidate.get("content").get("parts").get(0);
                        if (responsePart.has("text")) {
                            geminiReply = responsePart.get("text").asText();
                        }
                    }
                }

                if (geminiReply.isEmpty()) {
                    response.put("success", false);
                    response.put("message", "No response received from AI");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                }

                // Return successful response
                response.put("success", true);
                response.put("question", question);
                response.put("reply", geminiReply);
                return ResponseEntity.ok(response);

            } else {
                response.put("success", false);
                response.put("message", "Error from AI service: " + geminiResponse.getStatusCode());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }

        } catch (RestClientException e) {
            System.err.println("Error calling Gemini API: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Error connecting to AI service: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);

        } catch (Exception e) {
            System.err.println("Error in chatbot API: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}

// Configuration class for RestTemplate
@Configuration
class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}