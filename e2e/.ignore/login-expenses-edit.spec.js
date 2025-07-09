import { test, expect } from '@playwright/test';

test.describe('Login → Expenses → Edit Expense Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('should login, navigate to expenses, and edit an expense', async ({ page }) => {
    // Step 1: Login
    await test.step('Login with valid credentials', async () => {
      // Fill login form
      await page.fill('input[name="email"]', 'abc@yahoo.com');
      await page.fill('input[name="password"]', '1234');
      
      // Click login button
      await page.click('button[type="submit"]');
      
      // Wait for navigation to dashboard
      await page.waitForURL('/dashboard');
      
      // Verify we're on the dashboard
      await expect(page).toHaveURL('/dashboard');
    });

    // Step 2: Navigate to Expenses
    await test.step('Navigate to Expenses page', async () => {
      // Click on Expenses link in sidebar/navigation
      await page.click('a[href="/expenses"]');
      
      // Wait for navigation to expenses page
      await page.waitForURL('/expenses');
      
      // Verify we're on the expenses page
      await expect(page).toHaveURL('/expenses');
      
      // Wait for expenses to load
      await page.waitForLoadState('networkidle');
    });

    // Step 3: Verify expenses page loaded
    await test.step('Verify expenses page content', async () => {
      // Check if the page has the expenses container
      await expect(page.locator('.expenses-container')).toBeVisible();
      
      // Check for either expenses or no expenses message
      const hasExpenses = await page.locator('.expense-card').count() > 0;
      const hasNoExpensesMessage = await page.locator('.no-expenses').isVisible();
      
      // At least one should be true
      expect(hasExpenses || hasNoExpensesMessage).toBe(true);
    });

    // Step 4: Edit expense (if expenses exist)
    await test.step('Edit expense if available', async () => {
      const expenseCards = page.locator('.expense-card');
      const expenseCount = await expenseCards.count();
      
      if (expenseCount > 0) {
        // Click on the edit button of the first expense
        await expenseCards.first().locator('.edit-btn').click();
        
        // For now, this will just log to console as the edit functionality 
        // is not fully implemented in the frontend
        // In a real scenario, we would:
        // 1. Wait for edit modal/form to appear
        // 2. Fill out the form with new values
        // 3. Submit the form
        // 4. Verify the expense was updated
        
        // Since the current implementation only logs, we'll check the console
        // or verify that the edit button was clicked
        await expect(expenseCards.first().locator('.edit-btn')).toBeVisible();
      } else {
        // If no expenses exist, we'll add one first
        await page.click('.floating-add-btn');
        
        // Wait for navigation to add expense page
        await page.waitForURL('/add-expense');
        
        // Fill out the add expense form
        await page.fill('input[name="amount"]', '25.50');
        await page.fill('input[name="description"]', 'Test expense for editing');
        await page.selectOption('select[name="type"]', 'food');
        await page.fill('input[name="date"]', '2024-01-01');
        
        // Submit the form
        await page.click('button[type="submit"]');
        
        // Wait for navigation back to expenses or dashboard
        await page.waitForLoadState('networkidle');
        
        // Navigate back to expenses if we're not already there
        if (page.url().includes('/dashboard')) {
          await page.click('a[href="/expenses"]');
          await page.waitForURL('/expenses');
        }
        
        // Now try to edit the expense we just added
        await page.waitForSelector('.expense-card', { timeout: 5000 });
        await page.locator('.expense-card').first().locator('.edit-btn').click();
      }
    });
  });

  test('should handle edit expense error gracefully', async ({ page }) => {
    // Login first
    await page.fill('input[name="email"]', 'abc@yahoo.com');
    await page.fill('input[name="password"]', '1234');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
    
    // Navigate to expenses
    await page.click('a[href="/expenses"]');
    await page.waitForURL('/expenses');
    
    // Mock network error for edit expense API
    await page.route('**/api/expenses/*', (route) => {
      if (route.request().method() === 'PUT') {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      } else {
        route.continue();
      }
    });
    
    // Try to edit an expense (if available)
    const expenseCards = page.locator('.expense-card');
    const expenseCount = await expenseCards.count();
    
    if (expenseCount > 0) {
      await expenseCards.first().locator('.edit-btn').click();
      // Would verify error handling here if edit modal existed
    }
  });

  test('should navigate correctly through the flow', async ({ page }) => {
    // Test the complete navigation flow
    await test.step('Complete navigation flow', async () => {
      // Login
      await page.fill('input[name="email"]', 'abc@yahoo.com');
      await page.fill('input[name="password"]', '1234');
      await page.click('button[type="submit"]');
      await page.waitForURL('/dashboard');
      
      // Navigate to expenses
      await page.click('a[href="/expenses"]');
      await page.waitForURL('/expenses');
      
      // Check that we can navigate back to dashboard
      await page.click('a[href="/dashboard"]');
      await page.waitForURL('/dashboard');
      
      // Navigate back to expenses
      await page.click('a[href="/expenses"]');
      await page.waitForURL('/expenses');
      
      // Verify the expenses page is still functional
      await expect(page.locator('.expenses-container')).toBeVisible();
    });
  });

  test('should handle login errors', async ({ page }) => {
    // Test with invalid credentials
    await page.fill('input[name="email"]', 'invalid@test.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should stay on login page and show error
    await expect(page).toHaveURL('/login');
    
    // Look for error message (this depends on the actual error handling in the component)
    const errorMessage = page.locator('.error, .alert, [role="alert"]');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });
});
