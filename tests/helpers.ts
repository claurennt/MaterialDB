import { Browser, chromium, expect } from '@playwright/test';

import { BASE_URL } from './globals';

export const withSession = async (browser: Browser) => {
  let storageFile = 'session.json';

  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to login page and perform login
  await page.goto(`${BASE_URL}/auth/login`);

  const emailInput = page.getByLabel('email');
  const passwordInput = page.getByLabel('password');

  await emailInput.fill('test_user@test.com');
  await passwordInput.fill('test_user');

  expect(emailInput).toHaveValue('test_user@test.com');
  expect(passwordInput).toHaveValue('test_user');

  const submitButton = page.getByRole('button');

  await submitButton.click();

  await page.waitForTimeout(2200);

  // Wait for logout button to ensure login success
  const logoutButton = page.getByRole('button', { name: 'Logout' });
  await expect(logoutButton).toBeVisible();

  await page.context().storageState({ path: storageFile });

  await page.goto(BASE_URL);

  return { page, context };
};
