#!/bin/bash

# E2E Test Setup Script for WealthE Application

echo "🚀 Setting up E2E tests for WealthE..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Navigate to e2e directory
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Playwright browsers
echo "🌐 Installing Playwright browsers..."
npx playwright install

# Create test results directory
mkdir -p test-results

echo "✅ E2E test setup completed!"
echo ""
echo "🎯 Next steps:"
echo "1. Start the frontend server: cd ../frontend/wealthe-frontend && npm start"
echo "2. Ensure the backend API is running"
echo "3. Run tests: npm test"
echo ""
echo "📖 Available commands:"
echo "  npm test                 - Run all tests"
echo "  npm run test:headed      - Run tests with browser UI"
echo "  npm run test:ui          - Run tests with Playwright UI"
echo "  npm run test:debug       - Debug tests"
echo "  npm run test:report      - View test report"
echo ""
echo "📝 For more information, see README.md"
