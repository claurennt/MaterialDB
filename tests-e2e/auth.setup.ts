import { test as setup, expect } from '@playwright/test';
import { BASE_URL } from '../globals';
import path from 'path';

const authFile = path.join(__dirname, 'utils/tests-e2e/user.json');

setup('authenticate', async ({ page }) => {
  await page.goto(`${BASE_URL}/auth/login`);

  await page.getByLabel(/username/i).fill('test_user');
  await page.getByLabel(/password/i).fill('password123');
  await page.getByRole('button', { name: /sign in/i }).click();

  // Verify the auth feedback message exists and gets focused
  await expect(page.getByTestId('auth-feedback-group')).toBeFocused();

  //check redirect after 3 seconds
  await page.waitForURL(BASE_URL, { timeout: 5000 });

  await page.context().storageState({ path: authFile });
});
