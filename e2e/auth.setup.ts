import { test as setup } from '@playwright/test';
import { BASE_URL } from '../globals';
import path from 'path';
import { DBClient } from '@lib/server/DBClient';

export const AUTH_FILE = path.join(__dirname, '/utils/user.json');

setup('authenticate', async ({ page }) => {
  await DBClient();
  await page.goto(`${BASE_URL}/auth/login`);

  await page.getByLabel(/username/i).fill('test_user');
  await page.getByLabel(/password/i).fill('password123');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.getByTestId('auth-feedback-group').waitFor({ state: 'visible' });
  // Verify the auth feedback message exists and gets focused
  const feedbackText = await page
    .getByTestId('auth-feedback-group')
    .textContent();
  console.log('Auth feedback:', feedbackText);
  //check redirect after 3 seconds
  await page.waitForURL(BASE_URL, { timeout: 15000 });

  await page.context().storageState({ path: AUTH_FILE });
});
