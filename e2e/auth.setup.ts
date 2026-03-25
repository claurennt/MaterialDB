import { test as setup, expect } from '@playwright/test';
import { BASE_URL, AUTH_FILE } from '../globals';

setup('authenticate', async ({ page }) => {
  await page.goto(`${BASE_URL}/auth/login`);

  await page.getByLabel(/username/i).fill('test_user');
  await page.getByLabel(/password/i).fill('password123');
  await page.getByRole('button', { name: /sign in/i }).click();
  const authFeedback = page.getByTestId('auth-feedback-group');
  await authFeedback.waitFor({ state: 'visible' });

  // Verify the auth feedback message exists and gets focused
  const feedbackText = await authFeedback.textContent();
  expect(feedbackText).toEqual('Success! Login successful! Redirecting...');

  //check redirect after 3 seconds
  await page.waitForURL(BASE_URL, { timeout: 15000 });

  await page.context().storageState({ path: AUTH_FILE });
});
