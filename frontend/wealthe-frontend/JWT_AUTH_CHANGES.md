# JWT Bearer Token Authentication Implementation

## Summary of Changes

This document outlines the changes made to implement JWT bearer token authentication in the frontend, removing test login credentials and password hashing since the Spring Boot backend handles authentication.

## Files Modified

### 1. `src/utils/auth.js`
- **Removed**: `bcryptjs` import
- **Commented out**: `hashPassword()` and `comparePassword()` functions
- **Reason**: Password hashing is now handled by the Spring Boot backend

### 2. `src/utils/api.js`
- **Commented out**: Test login credentials (`user1@test.com` / `123`)
- **Updated**: `login()` function to use `/login` endpoint with proper request format
- **Updated**: `register()` function to use `/register/submit` endpoint
- **Updated**: `getUserInfo()` function to use `/profile` endpoint with JWT authentication
- **Updated**: `getUserExpense()` function to use JWT authentication
- **Enhanced**: Response handling to transform backend responses to match frontend expectations
- **Note**: The `apiCall()` function already includes Bearer token in Authorization header

### 3. `src/pages/Login.js`
- **Commented out**: Test credentials notice in the UI
- **Removed**: Special validation case for test email
- **Commented out**: Password hashing logic before API call
- **Simplified**: Form validation to use standard email validation

### 4. `src/pages/Register.js`
- **Removed**: `hashPassword` import
- **Updated**: Registration to send plain password (backend will hash it)
- **Commented out**: Frontend password hashing logic

## API Endpoint Mapping

| Frontend Function | Backend Endpoint | Method | Description |
|------------------|------------------|---------|-------------|
| `login()` | `/login` | POST | Authenticates user and returns JWT token |
| `register()` | `/register/submit` | POST | Registers new user and returns JWT token |
| `getUserInfo()` | `/profile` | GET | Gets user profile data (requires JWT) |
| `getUserExpense()` | `/user/expense` | GET | Gets user expense data (requires JWT) |

## Authentication Flow

1. **Login**: 
   - User submits email/password
   - Frontend sends to `/login` with `{id: email, password: password}`
   - Backend returns `{success: true, token: "jwt_token", role: "user"}`
   - Frontend stores token in localStorage and sets user session

2. **Subsequent Requests**:
   - All API calls include `Authorization: Bearer <token>` header
   - Backend validates JWT token for protected endpoints

3. **Registration**:
   - User submits registration data with plain password
   - Backend handles password hashing and returns JWT token
   - Same flow as login for token storage

## JWT Token Storage

- Tokens are stored in `localStorage` using the existing `setAuthToken()` function
- The `apiCall()` utility automatically includes the Bearer token in all requests
- Token removal is handled by the existing `removeAuthToken()` function

## Backward Compatibility

All commented code sections are preserved for potential rollback:
- Test credentials can be uncommented if needed for development
- Mock API responses are kept for reference
- Original validation logic is preserved in comments

## Benefits

1. **Security**: No more hardcoded test credentials
2. **Authentication**: Proper JWT-based authentication with Spring Boot backend
3. **Scalability**: Standard Bearer token authentication pattern
4. **Maintainability**: Cleaner code without frontend password hashing
5. **Integration**: Seamless integration with existing Spring Boot JWT implementation

## Notes

- The backend must be running and configured for JWT authentication
- All protected endpoints now require valid JWT tokens
- Password complexity validation is moved to backend
- User session management remains the same in the frontend
