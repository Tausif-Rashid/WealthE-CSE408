package com.cselab.wealthe.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChatBotControllerTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private ChatBotController chatBotController;

    private final String VALID_API_KEY = "test-api-key";
    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

    @BeforeEach
    void setUp() {
        // Set up the controller with valid configuration
        ReflectionTestUtils.setField(chatBotController, "geminiApiKey", VALID_API_KEY);
        ReflectionTestUtils.setField(chatBotController, "geminiApiUrl", GEMINI_API_URL);
    }

    @Test
    void testValidateConfiguration_WithValidApiKey() {
        // Given
        ReflectionTestUtils.setField(chatBotController, "geminiApiKey", VALID_API_KEY);

        // When & Then - No exception should be thrown
        assertDoesNotThrow(() -> chatBotController.validateConfiguration());
    }

    @Test
    void testValidateConfiguration_WithEmptyApiKey() {
        // Given
        ReflectionTestUtils.setField(chatBotController, "geminiApiKey", "");

        // When & Then - Should not throw exception but log warning
        assertDoesNotThrow(() -> chatBotController.validateConfiguration());
    }

    @Test
    void testValidateConfiguration_WithNullApiKey() {
        // Given
        ReflectionTestUtils.setField(chatBotController, "geminiApiKey", null);

        // When & Then - Should not throw exception but log warning
        assertDoesNotThrow(() -> chatBotController.validateConfiguration());
    }

    @Test
    void testChatbot_SuccessfulResponse() {
        // Given
        Map<String, Object> payload = new HashMap<>();
        payload.put("question", "What is income tax?");

        String mockGeminiResponse = """
            {
                "candidates": [
                    {
                        "content": {
                            "parts": [
                                {
                                    "text": "Income tax in Bangladesh is a direct tax imposed on individual and corporate income."
                                }
                            ]
                        }
                    }
                ]
            }
            """;

        ResponseEntity<String> mockResponseEntity = new ResponseEntity<>(mockGeminiResponse, HttpStatus.OK);

        when(restTemplate.postForEntity(eq(GEMINI_API_URL), any(HttpEntity.class), eq(String.class)))
                .thenReturn(mockResponseEntity);

        // When
        ResponseEntity<Map<String, Object>> result = chatBotController.chatbot(payload);

        // Then
        assertEquals(HttpStatus.OK, result.getStatusCode());
        Map<String, Object> responseBody = result.getBody();
        assertNotNull(responseBody);
        assertTrue((Boolean) responseBody.get("success"));
        assertEquals("What is income tax?", responseBody.get("question"));
        assertEquals("Income tax in Bangladesh is a direct tax imposed on individual and corporate income.",
                responseBody.get("reply"));

        verify(restTemplate).postForEntity(eq(GEMINI_API_URL), any(HttpEntity.class), eq(String.class));
    }

    @Test
    void testChatbot_EmptyApiKey() {
        // Given
        ReflectionTestUtils.setField(chatBotController, "geminiApiKey", "");
        Map<String, Object> payload = new HashMap<>();
        payload.put("question", "What is income tax?");

        // When
        ResponseEntity<Map<String, Object>> result = chatBotController.chatbot(payload);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        Map<String, Object> responseBody = result.getBody();
        assertNotNull(responseBody);
        assertFalse((Boolean) responseBody.get("success"));
        assertEquals("Gemini API key is not configured. Please contact administrator.",
                responseBody.get("message"));

        verify(restTemplate, never()).postForEntity(anyString(), any(HttpEntity.class), eq(String.class));
    }

    @Test
    void testChatbot_NullApiKey() {
        // Given
        ReflectionTestUtils.setField(chatBotController, "geminiApiKey", null);
        Map<String, Object> payload = new HashMap<>();
        payload.put("question", "What is income tax?");

        // When
        ResponseEntity<Map<String, Object>> result = chatBotController.chatbot(payload);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        Map<String, Object> responseBody = result.getBody();
        assertNotNull(responseBody);
        assertFalse((Boolean) responseBody.get("success"));
        assertEquals("Gemini API key is not configured. Please contact administrator.",
                responseBody.get("message"));
    }

    @Test
    void testChatbot_EmptyQuestion() {
        // Given
        Map<String, Object> payload = new HashMap<>();
        payload.put("question", "");

        // When
        ResponseEntity<Map<String, Object>> result = chatBotController.chatbot(payload);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        Map<String, Object> responseBody = result.getBody();
        assertNotNull(responseBody);
        assertFalse((Boolean) responseBody.get("success"));
        assertEquals("Question is required", responseBody.get("message"));

        verify(restTemplate, never()).postForEntity(anyString(), any(HttpEntity.class), eq(String.class));
    }

    @Test
    void testChatbot_NullQuestion() {
        // Given
        Map<String, Object> payload = new HashMap<>();
        payload.put("question", null);

        // When
        ResponseEntity<Map<String, Object>> result = chatBotController.chatbot(payload);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        Map<String, Object> responseBody = result.getBody();
        assertNotNull(responseBody);
        assertFalse((Boolean) responseBody.get("success"));
        assertEquals("Question is required", responseBody.get("message"));
    }

    @Test
    void testChatbot_MissingQuestionKey() {
        // Given
        Map<String, Object> payload = new HashMap<>();
        // No question key in payload

        // When
        ResponseEntity<Map<String, Object>> result = chatBotController.chatbot(payload);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        Map<String, Object> responseBody = result.getBody();
        assertNotNull(responseBody);
        assertFalse((Boolean) responseBody.get("success"));
        assertEquals("Question is required", responseBody.get("message"));
    }

    @Test
    void testChatbot_GeminiApiErrorStatus() {
        // Given
        Map<String, Object> payload = new HashMap<>();
        payload.put("question", "What is income tax?");

        ResponseEntity<String> mockResponseEntity = new ResponseEntity<>("Error", HttpStatus.BAD_REQUEST);

        when(restTemplate.postForEntity(eq(GEMINI_API_URL), any(HttpEntity.class), eq(String.class)))
                .thenReturn(mockResponseEntity);

        // When
        ResponseEntity<Map<String, Object>> result = chatBotController.chatbot(payload);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        Map<String, Object> responseBody = result.getBody();
        assertNotNull(responseBody);
        assertFalse((Boolean) responseBody.get("success"));
        assertEquals("Error from AI service: 400 BAD_REQUEST", responseBody.get("message"));
    }

    @Test
    void testChatbot_RestClientException() {
        // Given
        Map<String, Object> payload = new HashMap<>();
        payload.put("question", "What is income tax?");

        when(restTemplate.postForEntity(eq(GEMINI_API_URL), any(HttpEntity.class), eq(String.class)))
                .thenThrow(new RestClientException("Connection timeout"));

        // When
        ResponseEntity<Map<String, Object>> result = chatBotController.chatbot(payload);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        Map<String, Object> responseBody = result.getBody();
        assertNotNull(responseBody);
        assertFalse((Boolean) responseBody.get("success"));
        assertEquals("Error connecting to AI service: Connection timeout", responseBody.get("message"));
    }

    @Test
    void testChatbot_JsonParsingException() {
        // Given
        Map<String, Object> payload = new HashMap<>();
        payload.put("question", "What is income tax?");

        String invalidJsonResponse = "{ invalid json }";
        ResponseEntity<String> mockResponseEntity = new ResponseEntity<>(invalidJsonResponse, HttpStatus.OK);

        when(restTemplate.postForEntity(eq(GEMINI_API_URL), any(HttpEntity.class), eq(String.class)))
                .thenReturn(mockResponseEntity);

        // When
        ResponseEntity<Map<String, Object>> result = chatBotController.chatbot(payload);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        Map<String, Object> responseBody = result.getBody();
        assertNotNull(responseBody);
        assertFalse((Boolean) responseBody.get("success"));
        assertTrue(((String) responseBody.get("message")).contains("Internal server error"));
    }

    @Test
    void testChatbot_EmptyGeminiResponse() {
        // Given
        Map<String, Object> payload = new HashMap<>();
        payload.put("question", "What is income tax?");

        String mockGeminiResponse = """
            {
                "candidates": []
            }
            """;

        ResponseEntity<String> mockResponseEntity = new ResponseEntity<>(mockGeminiResponse, HttpStatus.OK);

        when(restTemplate.postForEntity(eq(GEMINI_API_URL), any(HttpEntity.class), eq(String.class)))
                .thenReturn(mockResponseEntity);

        // When
        ResponseEntity<Map<String, Object>> result = chatBotController.chatbot(payload);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        Map<String, Object> responseBody = result.getBody();
        assertNotNull(responseBody);
        assertFalse((Boolean) responseBody.get("success"));
        assertEquals("No response received from AI", responseBody.get("message"));
    }

    @Test
    void testChatbot_MalformedGeminiResponse() {
        // Given
        Map<String, Object> payload = new HashMap<>();
        payload.put("question", "What is income tax?");

        String mockGeminiResponse = """
            {
                "candidates": [
                    {
                        "content": {
                            "parts": []
                        }
                    }
                ]
            }
            """;

        ResponseEntity<String> mockResponseEntity = new ResponseEntity<>(mockGeminiResponse, HttpStatus.OK);

        when(restTemplate.postForEntity(eq(GEMINI_API_URL), any(HttpEntity.class), eq(String.class)))
                .thenReturn(mockResponseEntity);

        // When
        ResponseEntity<Map<String, Object>> result = chatBotController.chatbot(payload);

        // Then
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
        Map<String, Object> responseBody = result.getBody();
        assertNotNull(responseBody);
        assertFalse((Boolean) responseBody.get("success"));
        assertEquals("No response received from AI", responseBody.get("message"));
    }

    @Test
    void testChatbot_QuestionEnhancement() {
        // Given
        Map<String, Object> payload = new HashMap<>();
        payload.put("question", "What is VAT?");

        String mockGeminiResponse = """
            {
                "candidates": [
                    {
                        "content": {
                            "parts": [
                                {
                                    "text": "VAT in Bangladesh is a consumption tax."
                                }
                            ]
                        }
                    }
                ]
            }
            """;

        ResponseEntity<String> mockResponseEntity = new ResponseEntity<>(mockGeminiResponse, HttpStatus.OK);

        when(restTemplate.postForEntity(eq(GEMINI_API_URL), any(HttpEntity.class), eq(String.class)))
                .thenReturn(mockResponseEntity);

        // When
        ResponseEntity<Map<String, Object>> result = chatBotController.chatbot(payload);

        // Then
        assertEquals(HttpStatus.OK, result.getStatusCode());

        // Verify that the enhanced question was sent to the API
        verify(restTemplate).postForEntity(eq(GEMINI_API_URL), argThat(entity -> {
            HttpEntity<Map<String, Object>> httpEntity = (HttpEntity<Map<String, Object>>) entity;
            @SuppressWarnings("unchecked")
            Map<String, Object> body = httpEntity.getBody();

            if (body != null && body.containsKey("contents")) {
                @SuppressWarnings("unchecked")
                java.util.List<Map<String, Object>> contents = (java.util.List<Map<String, Object>>) body.get("contents");
                if (!contents.isEmpty() && contents.get(0).containsKey("parts")) {
                    @SuppressWarnings("unchecked")
                    java.util.List<Map<String, Object>> parts = (java.util.List<Map<String, Object>>) contents.get(0).get("parts");
                    if (!parts.isEmpty() && parts.get(0).containsKey("text")) {
                        String text = (String) parts.get(0).get("text");
                        return text.contains("What is VAT?") &&
                                text.contains("reply this question in terms of bangladeshi tax rule. Be brief");
                    }
                }
            }
            return false;
        }), eq(String.class));
    }

    @Test
    void testChatbot_VerifyHttpHeaders() {
        // Given
        Map<String, Object> payload = new HashMap<>();
        payload.put("question", "Test question");

        String mockGeminiResponse = """
            {
                "candidates": [
                    {
                        "content": {
                            "parts": [
                                {
                                    "text": "Test response"
                                }
                            ]
                        }
                    }
                ]
            }
            """;

        ResponseEntity<String> mockResponseEntity = new ResponseEntity<>(mockGeminiResponse, HttpStatus.OK);

        when(restTemplate.postForEntity(eq(GEMINI_API_URL), any(HttpEntity.class), eq(String.class)))
                .thenReturn(mockResponseEntity);

        // When
        chatBotController.chatbot(payload);

        // Then
        verify(restTemplate).postForEntity(eq(GEMINI_API_URL), argThat(entity -> {
            HttpEntity<Map<String, Object>> httpEntity = (HttpEntity<Map<String, Object>>) entity;
            return httpEntity.getHeaders().getContentType().toString().contains("application/json") &&
                    VALID_API_KEY.equals(httpEntity.getHeaders().getFirst("x-goog-api-key"));
        }), eq(String.class));
    }
}
