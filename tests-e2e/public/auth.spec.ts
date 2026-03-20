import { test, expect } from '@playwright/test';
import { BASE_URL } from '../../globals';

test.describe('Authentication Flows', () => {
  test.describe('Login Mode', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${BASE_URL}/auth/login`);
    });

    test('should show validation error when fields are empty', async ({
      page,
    }) => {
      await page.getByRole('button', { name: /sign in/i }).click();

      const authFeedback = page.getByTestId('auth-feedback-group');
      await expect(authFeedback).toBeFocused();
      await expect(authFeedback).toContainText(
        'Something went wrong. Username and Password are required',
      );
    });

    test('should show error message on invalid credentials', async ({
      page,
    }) => {
      await page.getByLabel(/username/i).fill('wrong_user');
      await page.getByLabel(/password/i).fill('wrong_pass');
      await page.getByRole('button', { name: /sign in/i }).click();

      await expect(page.getByTestId('auth-feedback-group')).toBeFocused();
      await expect(page.getByText('Invalid credentials')).toBeVisible();
    });

    test('should navigate to registration page', async ({ page }) => {
      await page.getByRole('link', { name: /Don't have an account/i }).click();
      await expect(page).toHaveURL(`${BASE_URL}/auth/register`);
      await expect(page.getByLabel(/email/i)).toBeVisible();
    });
  });

  test.describe('Registration Mode', () => {
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

      await page.locator('#username').fill('a');
      await expect(
        page.getByText('Email, Username and Password are required'),
      ).not.toBeAttached();
    });
  });
});
