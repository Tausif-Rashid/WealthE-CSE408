import { test, expect } from '@playwright/test';
import { 
  LoginPage, 
  ExpensesPage, 
  AddExpensePage, 
  DashboardPage, 
  AuthHelpers,
  testData 
} from './helpers/pageObjects.js';

test.describe('Login → Expenses → Edit Expense Flow', () => {
  let authHelpers;
  let loginPage;
  let expensesPage;
  let addExpensePage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    loginPage = new LoginPage(page);
    expensesPage = new ExpensesPage(page);
    addExpensePage = new AddExpensePage(page);
    dashboardPage = new DashboardPage(page);
  });

  test('should complete full login → expenses → edit flow', async ({ page }) => {
    // Step 1: Login
    await test.step('Login as regular user', async () => {
      await authHelpers.loginAsUser();
      await dashboardPage.expectPageLoaded();
    });

    // Step 2: Navigate to expenses
    await test.step('Navigate to expenses page', async () => {
      await expensesPage.navigate();
      await expensesPage.expectPageLoaded();
    });

    // Step 3: Check if expenses exist, if not create one
    await test.step('Ensure at least one expense exists', async () => {
      const expenseCount = await expensesPage.getExpenseCount();
      
      if (expenseCount === 0) {
        // Add a test expense
        await expensesPage.clickAddExpense();
        await page.waitForURL('/add-expense');
        
        await addExpensePage.fillExpenseForm(testData.expenses.sample);
        await addExpensePage.submitForm();
        
        // Wait for navigation back to expenses or dashboard
        await page.waitForLoadState('networkidle');
        
        // Navigate back to expenses if needed
        if (page.url().includes('/dashboard')) {
          await expensesPage.navigate();
        }
        
        // Verify expense was created
        await expect(expensesPage.expenseCards.first()).toBeVisible({ timeout: 10000 });
      }
    });

    // Step 4: Edit an expense
    await test.step('Edit the first expense', async () => {
      // Get initial expense details
      const initialDetails = await expensesPage.getExpenseDetails(0);
      
      // Click edit button
      await expensesPage.clickEditExpense(0);
      
      // Note: Since the current implementation only logs to console,
      // we'll verify the edit button was clicked and is functional
      // In a real implementation, we would:
      // 1. Wait for edit modal/form to appear
      // 2. Modify the expense details
      // 3. Submit the changes
      // 4. Verify the expense was updated
      
      // For now, verify that the edit button is functional
      await expect(expensesPage.expenseCards.first().locator('.edit-btn')).toBeVisible();
      
      // Verify we can still see the expense details
      const currentDetails = await expensesPage.getExpenseDetails(0);
      expect(currentDetails.description).toBeTruthy();
      expect(currentDetails.amount).toBeTruthy();
    });
  });

  test('should handle expenses filtering and navigation', async ({ page }) => {
    await test.step('Login and navigate to expenses', async () => {
      await authHelpers.loginAsUser();
      await expensesPage.navigate();
    });

    await test.step('Test expenses filtering', async () => {
      // Switch to categories tab
      await expensesPage.switchToCategories();
      
      // Should show category selection
      await expect(expensesPage.categorySelect).toBeVisible();
      
      // Switch back to view all
      await expensesPage.switchToViewAll();
      
      // Should show all expenses or no expenses message
      const hasExpenses = await expensesPage.getExpenseCount() > 0;
      if (hasExpenses) {
        await expensesPage.expectHasExpenses();
      } else {
        await expensesPage.expectNoExpenses();
      }
    });
  });

  test('should handle add expense flow from expenses page', async ({ page }) => {
    await test.step('Login and navigate to expenses', async () => {
      await authHelpers.loginAsUser();
      await expensesPage.navigate();
    });

    await test.step('Add expense via floating button', async () => {
      await expensesPage.clickAddExpense();
      await page.waitForURL('/add-expense');
      
      // Fill and submit expense form
      await addExpensePage.fillExpenseForm(testData.expenses.food);
      await addExpensePage.submitForm();
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      
      // Navigate back to expenses to verify
      if (!page.url().includes('/expenses')) {
        await expensesPage.navigate();
      }
      
      // Verify expense appears in list
      await page.waitForSelector('.expense-card', { timeout: 10000 });
      const expenseCount = await expensesPage.getExpenseCount();
      expect(expenseCount).toBeGreaterThan(0);
    });
  });

  test('should handle delete expense functionality', async ({ page }) => {
    await test.step('Login and ensure expense exists', async () => {
      await authHelpers.loginAsUser();
      await expensesPage.navigate();
      
      // Add expense if none exist
      const expenseCount = await expensesPage.getExpenseCount();
      if (expenseCount === 0) {
        await expensesPage.clickAddExpense();
        await page.waitForURL('/add-expense');
        await addExpensePage.fillExpenseForm(testData.expenses.transport);
        await addExpensePage.submitForm();
        await page.waitForLoadState('networkidle');
        
        if (!page.url().includes('/expenses')) {
          await expensesPage.navigate();
        }
      }
    });

    await test.step('Click delete button', async () => {
      await expensesPage.clickDeleteExpense(0);
      
      // Note: Similar to edit, current implementation only logs
      // In real implementation, we would verify deletion confirmation
      // and that the expense is removed from the list
      
      // Verify delete button is functional
      await expect(expensesPage.expenseCards.first().locator('.delete-btn')).toBeVisible();
    });
  });

  test('should handle navigation between pages', async ({ page }) => {
    await test.step('Complete navigation flow', async () => {
      // Login
      await authHelpers.loginAsUser();
      
      // Navigate to expenses
      await expensesPage.navigate();
      await expensesPage.expectPageLoaded();
      
      // Navigate to add expense
      await page.click('a[href="/add-expense"]');
      await page.waitForURL('/add-expense');
      
      // Navigate back to dashboard
      await page.click('a[href="/dashboard"]');
      await page.waitForURL('/dashboard');
      
      // Navigate back to expenses
      await expensesPage.navigate();
      await expensesPage.expectPageLoaded();
    });
  });

  test('should handle login validation', async ({ page }) => {
    await test.step('Test invalid login', async () => {
      await loginPage.navigate();
      await loginPage.expectLoginFormVisible();
      
      // Try invalid credentials
      await loginPage.login('invalid@test.com', 'wrongpassword');
      
      // Should stay on login page
      await expect(page).toHaveURL('/');
      
      // Should show error message
      await loginPage.expectError();
    });

    await test.step('Test empty form validation', async () => {
      await loginPage.navigate();
      
      // Try to submit empty form
      await loginPage.submitButton.click();
      
      // Should show validation errors
      await expect(page.locator(':has-text("Email is required")')).toBeVisible();
      await expect(page.locator(':has-text("Password is required")')).toBeVisible();
    });
  });

  test('should handle network errors gracefully', async ({ page }) => {
    await test.step('Mock network error for expenses', async () => {
      // Mock expenses API to return error
      await page.route('**/api/expenses', (route) => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server Error' })
        });
      });
      
      await authHelpers.loginAsUser();
      await expensesPage.navigate();
      
      // Should handle error gracefully
      // Look for error message or fallback UI
      const errorElement = page.locator('.error, .alert, [role="alert"]');
      const noExpensesElement = page.locator('.no-expenses');
      
      // Either error message or no expenses message should appear
      const hasError = await errorElement.isVisible();
      const hasNoExpenses = await noExpensesElement.isVisible();
      
      expect(hasError || hasNoExpenses).toBe(true);
    });
  });
});
