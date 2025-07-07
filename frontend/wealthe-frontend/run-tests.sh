#!/bin/bash

# WealthE Frontend Test Runner
# This script runs all tests and generates reports

echo "🧪 Starting WealthE Frontend Test Suite"
echo "======================================"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
    fi
}

# Function to print section header
print_section() {
    echo -e "\n${YELLOW}📋 $1${NC}"
    echo "----------------------------------------"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_section "Installing Dependencies"
    npm install
    print_status $? "Dependencies installed"
fi

# Run component tests
print_section "Running Component Tests"
npm run test:component -- --watchAll=false --coverage=false --verbose
COMPONENT_EXIT_CODE=$?
print_status $COMPONENT_EXIT_CODE "Component tests completed"

# Run page tests
print_section "Running Page Tests"
npm run test:pages -- --watchAll=false --coverage=false --verbose
PAGE_EXIT_CODE=$?
print_status $PAGE_EXIT_CODE "Page tests completed"

# Run integration tests
print_section "Running Integration Tests"
npm run test:integration -- --watchAll=false --coverage=false --verbose
INTEGRATION_EXIT_CODE=$?
print_status $INTEGRATION_EXIT_CODE "Integration tests completed"

# Run all tests with coverage
print_section "Running Full Test Suite with Coverage"
npm run test:coverage -- --verbose
COVERAGE_EXIT_CODE=$?
print_status $COVERAGE_EXIT_CODE "Coverage report generated"

# Generate test summary
print_section "Test Summary"
TOTAL_TESTS=$((COMPONENT_EXIT_CODE + PAGE_EXIT_CODE + INTEGRATION_EXIT_CODE + COVERAGE_EXIT_CODE))

if [ $TOTAL_TESTS -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed successfully!${NC}"
    echo "📊 Coverage report available in: coverage/lcov-report/index.html"
else
    echo -e "${RED}❌ Some tests failed. Please check the output above.${NC}"
    
    # Show which test suites failed
    if [ $COMPONENT_EXIT_CODE -ne 0 ]; then
        echo -e "${RED}  - Component tests failed${NC}"
    fi
    
    if [ $PAGE_EXIT_CODE -ne 0 ]; then
        echo -e "${RED}  - Page tests failed${NC}"
    fi
    
    if [ $INTEGRATION_EXIT_CODE -ne 0 ]; then
        echo -e "${RED}  - Integration tests failed${NC}"
    fi
    
    if [ $COVERAGE_EXIT_CODE -ne 0 ]; then
        echo -e "${RED}  - Coverage tests failed${NC}"
    fi
fi

# Additional information
print_section "Additional Information"
echo "📁 Test files location: src/**/*.test.js"
echo "🔧 Test configuration: src/setupTests.js"
echo "📖 Testing guide: TESTING_README.md"
echo "🚀 To run tests in watch mode: npm run test:watch"
echo "🐛 To debug tests: npm run test:debug"

# Exit with appropriate code
exit $TOTAL_TESTS
