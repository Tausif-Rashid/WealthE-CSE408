import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost/login');
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('admin0@example.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('1234');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('button', { name: '📋 Rules Management ▼' }).click();
  await page.getByRole('link', { name: 'Rebate Rules' }).dblclick();
  await page.getByRole('link', { name: 'Investment Rules' }).click();
  await page.getByRole('button', { name: 'Edit' }).first().click();
  await page.locator('input[name="minimum"]').click();
  await page.locator('input[name="rate_rebate"]').click();
  await page.locator('input[name="rate_rebate"]').fill('13');
  await page.getByRole('button', { name: 'Update Category' }).click();
  await page.getByRole('button', { name: '🚪 Logout' }).click();
});