import { test, expect } from '@playwright/test';
import { BASE_URL } from '../../globals';

test.describe('Registration Mode', () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/register`);
  });

  test('should validate missing email in register mode', async ({ page }) => {
    await page.getByLabel(/username/i).fill('new_user');
    await page.getByLabel(/password/i).fill('password123');
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(
      page.getByText('Email, Username and Password are required'),
    ).toBeVisible();
  });

  test('should hide form and show success message on successful registration', async ({
    page,
  }) => {
    // Fill out all required fields for register mode
    const uniqueEmail = `test_${Date.now()}@example.com`;
    await page.getByLabel(/email/i).fill(uniqueEmail);
    await page.getByLabel(/username/i).fill(uniqueEmail);
    await page.getByLabel(/password/i).fill('password123');

    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page.getByTestId('auth-feedback-group')).toBeFocused();
    await expect(
      page.getByText(/Success! Account created! Please check your email./i),
    ).toBeVisible();
    await expect(page.locator('form')).not.toBeAttached();
  });

  test('should clear feedback when user types again', async ({ page }) => {
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page.getByTestId('auth-feedback-group')).toBeFocused();
    await expect(
      page.getByText(/Email, Username and Password are required/i),
    ).toBeVisible();

    // Trigger handleChange
    await page.locator('#username').fill('a');
    await expect(
      page.getByText('Email, Username and Password are required'),
    ).not.toBeAttached();
  });
});
