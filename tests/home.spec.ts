import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => await page.goto('http://localhost:3000'));

test.describe('Home', () => {
  test('should show the auth links when session is null', async ({ page }) => {
    const registerLink = page.getByRole('link', { name: 'Register' });
    const loginLink = page.getByRole('link', { name: 'Login' });

    // assert that auth links are visible
    await expect(registerLink).toBeVisible();
    await expect(loginLink).toBeVisible();
  });
  test('should only show the Logout button after successful login', async ({
    page,
  }) => {
    const loginLink = page.getByRole('link', { name: 'Login' });

    // navigate to login page on Login link click
    await loginLink.click();
    await page.waitForURL('**/login');

    // retrieve inputs
    const emailInput = page.getByLabel('email');
    const passwordInput = page.getByLabel('password');

    // fill inputs
    await emailInput.fill('test_user@test.com');
    await passwordInput.fill('test_user');

    // assert that inputs contain correct content
    await expect(emailInput).toHaveValue('test_user@test.com');
    await expect(passwordInput).toHaveValue('test_user');

    //submit form and navigate to baseurl
    const submitButton = page.getByRole('button');
    await submitButton.click();
    await page.waitForTimeout(2200);

    // assert navigation to / url
    await expect(page).toHaveURL('http://localhost:3000/');

    const logoutButton = page.getByRole('button', { name: 'Logout' });

    // assert that logout button is present now that user is logged in
    await expect(logoutButton).toBeVisible();

    const registerLink = page.getByRole('link', { name: 'Register' });

    // assert that auth links are not visible now that user is logged in
    await expect(registerLink).not.toBeVisible();
    await expect(loginLink).not.toBeVisible();
  });
});
