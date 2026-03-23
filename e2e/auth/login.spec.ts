import { test, expect } from '@playwright/test';
import { BASE_URL } from '../../globals';

test.describe('Login Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
  });
  test('should show validation error when fields are empty', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /sign in/i }).click();

    const authFeedback = page.getByTestId('auth-feedback-group');
    // Verify the auth feedback message gets focused
    await expect(authFeedback).toBeFocused();
    await expect(authFeedback).toContainText(
      'Something went wrong. Username and Password are required',
    );
  });

  test('should show error message on invalid credentials', async ({ page }) => {
    await page.getByLabel(/username/i).fill('wrong_user');
    await page.getByLabel(/password/i).fill('wrong_pass');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Verify the auth feedback message exists and gets focused
    await expect(page.getByTestId('auth-feedback-group')).toBeFocused();
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.getByRole('link', { name: /Don't have an account/i }).click();
    await expect(page).toHaveURL(`${BASE_URL}/auth/register`);
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });
});
