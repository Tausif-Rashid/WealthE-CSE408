# <div align="center">WealthE 💰</div>

<div align="center">
  <strong>Personal Finance Management System</strong>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Spring%20Boot-3.5-green?style=flat-square&logo=spring" alt="Spring Boot">
  <img src="https://img.shields.io/badge/PostgreSQL-17-blue?style=flat-square&logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-Enabled-blue?style=flat-square&logo=docker" alt="Docker">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License">
</div>

### <div align="center"> Group 7 (A2) - CSE 408 Software Engineering Sessional </div>

<div align="center">
  <table>
    <tr>
      <td align="center">🎓 <strong>2005050</strong><br>Nabila Tabassum</td>
      <td align="center">🎓 <strong>2005052</strong><br>Tausif Rashid</td>
      <td align="center">🎓 <strong>2005056</strong><br>Azmal Karim</td>
    </tr>
  </table>
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Prerequisites](#-prerequisites)
- [Installation & Setup](#-installation--setup)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Docker Deployment](#-docker-deployment)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

**WealthE** is a comprehensive personal finance management system designed to help users track their income, expenses, investments, assets, and liabilities. The application provides intelligent financial analytics, tax estimation, and planning tools to enable better financial decision-making.

### Key Objectives
- 📊 **Financial Tracking**: Monitor income, expenses, and investments
- 🏠 **Asset Management**: Track real estate, vehicles, jewelry, and bank accounts
- 💳 **Liability Management**: Manage loans and debts
- 📈 **Investment Insights**: Analyze investment performance and trends
- 🧾 **Tax Planning**: Calculate tax obligations and generate tax forms
- 📱 **Responsive Design**: Cross-platform compatibility

## ✨ Features

### 🔐 User Management
- **Secure Authentication**: JWT-based login/registration system
- **Role-based Access**: User and Admin roles with different permissions
- **Profile Management**: Update personal information and change passwords

### 💰 Financial Management
- **Income Tracking**: Record and categorize various income sources
- **Expense Management**: Track daily expenses with categorization
- **Investment Portfolio**: Monitor stocks, bonds, mutual funds, and other investments
- **Asset Management**: Manage real estate, vehicles, jewelry, and bank accounts
- **Liability Tracking**: Track loans, debts, and financial obligations

### 📊 Analytics & Reporting
- **Interactive Dashboard**: Real-time financial overview with charts and graphs
- **Monthly Reports**: Track income vs. expenses over time
- **Investment Analytics**: Portfolio performance and trends
- **Financial Insights**: Data-driven recommendations and insights

### 🧾 Tax Management
- **Tax Estimation**: Calculate estimated tax obligations
- **Tax Form Generation**: Generate and export tax forms
- **Tax Planning**: Plan for upcoming tax obligations

### 👨‍💼 Admin Features
- **Rule Management**: Configure income, investment, and rebate rules
- **Tax Zone Configuration**: Manage tax zones and circles
- **User Management**: Oversee user accounts and activities

### 🤖 Additional Features
- **AI Chatbot**: Get financial advice and answers to common questions
- **Data Visualization**: Interactive charts using Chart.js
- **Export Functionality**: Export financial data and reports
- **Responsive Design**: Mobile-friendly interface

## 🏗️ Architecture

WealthE follows a modern **three-tier architecture**:

1. **Frontend**: React.js SPA with responsive design
2. **Backend**: Spring Boot REST API with comprehensive business logic
3. **Database**: PostgreSQL for reliable data persistence

### System Architecture Diagram
Detailed system architecture is available in `Software_architecture.pdf`

## 🛠️ Technology Stack

### Frontend
- **React 19.1**: Modern UI library
- **React Router 7.6**: Client-side routing
- **Chart.js 4.5**: Data visualization
- **CSS3**: Modern styling with Flexbox/Grid

### Backend
- **Spring Boot 3.5**: Java-based backend framework
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Database interaction
- **Maven**: Dependency management
- **Java 17**: Programming language

### Database
- **PostgreSQL 17**: Primary database
- **Flyway**: Database migration (if applicable)

### DevOps & Tools
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Jest**: Frontend testing
- **Playwright**: End-to-end testing
- **Git**: Version control

## 🔧 Prerequisites

Before setting up WealthE, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Java** (v17 or higher)
- **Maven** (v3.6 or higher)
- **PostgreSQL** (v12 or higher) *OR* **Docker**
- **Git**

## 🚀 Installation & Setup

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/WealthE-CSE408.git
   cd WealthE-CSE408
   ```

2. **Start the application with Docker**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:5454

### Option 2: Local Development Setup

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend/wealthe
   ```

2. **Configure database connection**
   ```bash
   # Update src/main/resources/application.properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/wealthe_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Install dependencies and run**
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend/wealthe-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

#### Database Setup

1. **Create PostgreSQL database**
   ```sql
   CREATE DATABASE wealthe_db;
   ```

2. **Restore database backup** (optional)
   ```bash
   pg_restore -h localhost -p 5432 -U your_username -d wealthe_db backupV30.dump
   ```

## 📖 Usage

### Getting Started

1. **Register a new account** at http://localhost:3000/register
2. **Login** with your credentials
3. **Complete your profile** with tax zone and circle information
4. **Start adding financial data**:
   - Add income sources
   - Track daily expenses
   - Record investments
   - Manage assets and liabilities

### Dashboard Overview

The main dashboard provides:
- 📊 **Financial Summary**: Total income, expenses, and net worth
- 📈 **Charts**: Visual representation of your financial data
- 🎯 **Quick Actions**: Shortcuts to add new entries
- 📅 **Recent Activity**: Latest financial transactions

### Advanced Features

- **Tax Form**: Generate and manage tax-related information
- **Investment Analytics**: Track portfolio performance
- **Financial Planning**: Set and monitor financial goals
- **Reports**: Generate detailed financial reports

## 📚 API Documentation

Comprehensive API documentation is available in `API_Documentation.md`. The API provides endpoints for:

- 🔐 Authentication and user management
- 💰 Income and expense operations
- 📈 Investment management
- 🏠 Asset and liability tracking
- 🧾 Tax calculations and forms
- 📊 Analytics and reporting

### Sample API Endpoints

```
POST /api/auth/login          # User authentication
GET  /api/user/profile        # Get user profile
POST /api/income              # Add new income
GET  /api/expenses/monthly    # Get monthly expenses
POST /api/investments         # Add investment
GET  /api/dashboard/summary   # Get dashboard data
```

## 🧪 Testing

### Frontend Testing

```bash
cd frontend/wealthe-frontend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suites
npm run test:component
npm run test:pages
```

### End-to-End Testing

```bash
cd e2e

# Install dependencies
npm install

# Run Playwright tests
npm test
```

### Backend Testing

```bash
cd backend/wealthe

# Run unit tests
./mvnw test

```

## 🐳 Docker Deployment

### Production Deployment

1. **Build production images**
   ```bash
   docker-compose -f docker-compose.yml build
   ```

2. **Deploy to production**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

### Environment Variables

Create a `.env` file in the project root:

```env
# Database Configuration
DB_NAME=wealthe_db
DB_USER=postgres
DB_PASSWORD=wealthe_password
DB_PORT=5454

# Application Configuration
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=your_jwt_secret_key
```

## 📁 Project Structure

```
WealthE-CSE408/
├── 📁 backend/
│   └── 📁 wealthe/                # Spring Boot application
│       ├── 📁 src/main/java/      # Java source code
│       ├── 📁 src/main/resources/ # Configuration files
│       └── 📄 pom.xml             # Maven dependencies
├── 📁 frontend/
│   └── 📁 wealthe-frontend/       # React application
│       ├── 📁 src/                # React source code
│       ├── 📁 public/             # Static assets
│       └── 📄 package.json        # NPM dependencies
├── 📁 e2e/                       # End-to-end tests
├── 📁 db/                        # Database backups
├── 📁 misc/                      # Miscellaneous files
├── 📄 docker-compose.yml          # Docker configuration
├── 📄 API_Documentation.md        # Detailed API docs
├── 📄 Software_architecture.pdf   # System architecture
└── 📄 README.md                   # This file
```

## 🤝 Contributing

We welcome contributions to WealthE! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Write comprehensive tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PRs

- 📖 Documentation: `API_Documentation.md`

---

<div align="center">
  <strong>Built with ❤️ by Group 7 (A2)</strong><br>
  <em>CSE 408 Software Engineering Sessional</em>
</div>
