@echo off
:: WealthE Frontend Test Runner for Windows
:: This script runs all tests and generates reports

echo 🧪 Starting WealthE Frontend Test Suite
echo ======================================

:: Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    exit /b 1
)

:: Install dependencies if needed
if not exist "node_modules" (
    echo 📋 Installing Dependencies
    echo ----------------------------------------
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        exit /b 1
    )
    echo ✓ Dependencies installed
)

:: Run component tests
echo.
echo 📋 Running Component Tests
echo ----------------------------------------
call npm run test:component -- --watchAll=false --coverage=false --verbose
set COMPONENT_EXIT_CODE=%errorlevel%
if %COMPONENT_EXIT_CODE% equ 0 (
    echo ✓ Component tests completed
) else (
    echo ❌ Component tests failed
)

:: Run page tests
echo.
echo 📋 Running Page Tests
echo ----------------------------------------
call npm run test:pages -- --watchAll=false --coverage=false --verbose
set PAGE_EXIT_CODE=%errorlevel%
if %PAGE_EXIT_CODE% equ 0 (
    echo ✓ Page tests completed
) else (
    echo ❌ Page tests failed
)

:: Run integration tests
echo.
echo 📋 Running Integration Tests
echo ----------------------------------------
call npm run test:integration -- --watchAll=false --coverage=false --verbose
set INTEGRATION_EXIT_CODE=%errorlevel%
if %INTEGRATION_EXIT_CODE% equ 0 (
    echo ✓ Integration tests completed
) else (
    echo ❌ Integration tests failed
)

:: Run all tests with coverage
echo.
echo 📋 Running Full Test Suite with Coverage
echo ----------------------------------------
call npm run test:coverage -- --verbose
set COVERAGE_EXIT_CODE=%errorlevel%
if %COVERAGE_EXIT_CODE% equ 0 (
    echo ✓ Coverage report generated
) else (
    echo ❌ Coverage tests failed
)

:: Generate test summary
echo.
echo 📋 Test Summary
echo ----------------------------------------
set /a TOTAL_FAILURES=%COMPONENT_EXIT_CODE% + %PAGE_EXIT_CODE% + %INTEGRATION_EXIT_CODE% + %COVERAGE_EXIT_CODE%

if %TOTAL_FAILURES% equ 0 (
    echo 🎉 All tests passed successfully!
    echo 📊 Coverage report available in: coverage/lcov-report/index.html
) else (
    echo ❌ Some tests failed. Please check the output above.
    
    if %COMPONENT_EXIT_CODE% neq 0 (
        echo   - Component tests failed
    )
    
    if %PAGE_EXIT_CODE% neq 0 (
        echo   - Page tests failed
    )
    
    if %INTEGRATION_EXIT_CODE% neq 0 (
        echo   - Integration tests failed
    )
    
    if %COVERAGE_EXIT_CODE% neq 0 (
        echo   - Coverage tests failed
    )
)

:: Additional information
echo.
echo 📋 Additional Information
echo ----------------------------------------
echo 📁 Test files location: src/**/*.test.js
echo 🔧 Test configuration: src/setupTests.js
echo 📖 Testing guide: TESTING_README.md
echo 🚀 To run tests in watch mode: npm run test:watch
echo 🐛 To debug tests: npm run test:debug

:: Exit with appropriate code
exit /b %TOTAL_FAILURES%
