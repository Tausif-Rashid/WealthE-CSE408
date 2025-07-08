@echo off

REM E2E Test Setup Script for WealthE Application (Windows)

echo 🚀 Setting up E2E tests for WealthE...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Navigate to e2e directory
cd /d "%~dp0"

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Install Playwright browsers
echo 🌐 Installing Playwright browsers...
npx playwright install

REM Create test results directory
if not exist "test-results" mkdir test-results

echo ✅ E2E test setup completed!
echo.
echo 🎯 Next steps:
echo 1. Start the frontend server: cd ../frontend/wealthe-frontend && npm start
echo 2. Ensure the backend API is running
echo 3. Run tests: npm test
echo.
echo 📖 Available commands:
echo   npm test                 - Run all tests
echo   npm run test:headed      - Run tests with browser UI
echo   npm run test:ui          - Run tests with Playwright UI
echo   npm run test:debug       - Debug tests
echo   npm run test:report      - View test report
echo.
echo 📝 For more information, see README.md

pause
