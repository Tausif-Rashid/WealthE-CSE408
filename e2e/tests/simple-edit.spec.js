import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('abc@yahoo.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('1234');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: '💸 Expenses' }).click();
  await page.getByRole('button', { name: 'Edit' }).first().click();
  await page.getByRole('spinbutton', { name: 'Amount (৳) *' }).click();
  await page.getByRole('spinbutton', { name: 'Amount (৳) *' }).fill('1000');
  await page.getByRole('textbox', { name: 'Description' }).click();
  await page.getByRole('textbox', { name: 'Description' }).fill('Sample expense #2 for user 24');
  await page.getByRole('button', { name: 'Update Expense' }).click();
  await page.getByRole('button', { name: 'Logout' }).click();
});