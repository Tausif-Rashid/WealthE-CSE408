import { expect } from '@playwright/test';

/**
 * Page Object Model for Login page
 */
export class LoginPage {
  constructor(page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.registerLink = page.locator('a[href="/register"]');
    this.errorMessage = page.locator('.error, .alert, [role="alert"]');
  }

  async navigate() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectError() {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
  }

  async expectLoginFormVisible() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }
}

/**
 * Page Object Model for Expenses page
 */
export class ExpensesPage {
  constructor(page) {
    this.page = page;
    this.container = page.locator('.expenses-container');
    this.expenseCards = page.locator('.expense-card');
    this.noExpensesMessage = page.locator('.no-expenses');
    this.addButton = page.locator('.floating-add-btn');
    this.viewAllTab = page.locator('button:has-text("View All")');
    this.categoriesTab = page.locator('button:has-text("Categories")');
    this.categorySelect = page.locator('select');
  }

  async navigate() {
    await this.page.click('a[href="/expenses"]');
    await this.page.waitForURL('/expenses');
    await this.page.waitForLoadState('networkidle');
  }

  async expectPageLoaded() {
    await expect(this.container).toBeVisible();
  }

  async getExpenseCount() {
    return await this.expenseCards.count();
  }

  async clickEditExpense(index = 0) {
    const expenseCard = this.expenseCards.nth(index);
    await expenseCard.locator('.edit-btn').click();
  }

  async clickDeleteExpense(index = 0) {
    const expenseCard = this.expenseCards.nth(index);
    await expenseCard.locator('.delete-btn').click();
  }

  async clickAddExpense() {
    await this.addButton.click();
  }

  async switchToViewAll() {
    await this.viewAllTab.click();
  }

  async switchToCategories() {
    await this.categoriesTab.click();
  }

  async selectCategory(category) {
    await this.categorySelect.selectOption(category);
  }

  async expectHasExpenses() {
    await expect(this.expenseCards.first()).toBeVisible();
  }

  async expectNoExpenses() {
    await expect(this.noExpensesMessage).toBeVisible();
  }

  async getExpenseDetails(index = 0) {
    const expenseCard = this.expenseCards.nth(index);
    const amount = await expenseCard.locator('.expense-amount').textContent();
    const description = await expenseCard.locator('.expense-description').textContent();
    const type = await expenseCard.locator('.type-text').textContent();
    const date = await expenseCard.locator('.expense-date').textContent();
    
    return { amount, description, type, date };
  }
}

/**
 * Page Object Model for Add Expense page
 */
export class AddExpensePage {
  constructor(page) {
    this.page = page;
    this.amountInput = page.locator('input[name="amount"]');
    this.descriptionInput = page.locator('input[name="description"]');
    this.typeSelect = page.locator('select[name="type"]');
    this.dateInput = page.locator('input[name="date"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.cancelButton = page.locator('button:has-text("Cancel")');
  }

  async navigate() {
    await this.page.click('a[href="/add-expense"]');
    await this.page.waitForURL('/add-expense');
    await this.page.waitForLoadState('networkidle');
  }

  async fillExpenseForm(expenseData) {
    if (expenseData.amount) {
      await this.amountInput.fill(expenseData.amount.toString());
    }
    if (expenseData.description) {
      await this.descriptionInput.fill(expenseData.description);
    }
    if (expenseData.type) {
      await this.typeSelect.selectOption(expenseData.type);
    }
    if (expenseData.date) {
      await this.dateInput.fill(expenseData.date);
    }
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async cancelForm() {
    await this.cancelButton.click();
  }
}

/**
 * Page Object Model for Dashboard page
 */
export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.container = page.locator('.dashboard-container');
    this.expensesLink = page.locator('a[href="/expenses"]');
    this.addExpenseLink = page.locator('a[href="/add-expense"]');
  }

  async expectPageLoaded() {
    await expect(this.container).toBeVisible();
  }

  async navigateToExpenses() {
    await this.expensesLink.click();
    await this.page.waitForURL('/expenses');
  }

  async navigateToAddExpense() {
    await this.addExpenseLink.click();
    await this.page.waitForURL('/add-expense');
  }
}

/**
 * Common authentication helpers
 */
export class AuthHelpers {
  constructor(page) {
    this.page = page;
  }

  async loginAsUser(email = 'user1@test.com', password = '123') {
    const loginPage = new LoginPage(this.page);
    await loginPage.navigate();
    await loginPage.login(email, password);
    await this.page.waitForURL('/dashboard');
    return new DashboardPage(this.page);
  }

  async loginAsAdmin(email = 'admin@test.com', password = 'admin123') {
    const loginPage = new LoginPage(this.page);
    await loginPage.navigate();
    await loginPage.login(email, password);
    await this.page.waitForURL('/admin/dashboard');
  }

  async logout() {
    // Click logout button if it exists
    const logoutButton = this.page.locator('button:has-text("Logout"), a:has-text("Logout")');
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await this.page.waitForURL('/');
    }
  }
}

/**
 * Common test data
 */
export const testData = {
  users: {
    regular: {
      email: 'user1@test.com',
      password: '123'
    },
    admin: {
      email: 'admin@test.com',
      password: 'admin123'
    }
  },
  expenses: {
    sample: {
      amount: 25.50,
      description: 'Test expense for E2E',
      type: 'food',
      date: '2024-01-01'
    },
    food: {
      amount: 15.75,
      description: 'Lunch at restaurant',
      type: 'food',
      date: '2024-01-02'
    },
    transport: {
      amount: 5.00,
      description: 'Bus fare',
      type: 'transport',
      date: '2024-01-03'
    }
  }
};
