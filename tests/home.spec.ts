import { test, expect } from '@playwright/test';
import { testWithSession } from './fixtures';
import { BASE_URL } from './globals';

test.describe('Home without Session', () => {
  test('should show the auth links when session is null', async ({ page }) => {
    await page.goto(BASE_URL);
    const registerLink = page.getByRole('link', { name: 'Register' });
    const loginLink = page.getByRole('link', { name: 'Login' });

    // assert that auth links are visible
    await expect(registerLink).toBeVisible();
    await expect(loginLink).toBeVisible();
  });
});

testWithSession.describe('Home with Session', () => {
  testWithSession(
    'should only show the Logout button after successful login',
    async ({ pageWithAuth: page }) => {
      await page.goto(BASE_URL);
      const loginLink = page.getByRole('link', { name: 'Login' });

      const logoutButton = page.getByRole('button', { name: 'Logout' });

      // assert that logout button is present now that user is logged in
      await expect(logoutButton).toBeVisible();

      const registerLink = page.getByRole('link', { name: 'Register' });

      // assert that auth links are not visible now that user is logged in
      await expect(registerLink).not.toBeVisible();
      await expect(loginLink).not.toBeVisible();
    }
  );
});
testWithSession(
  'should successfully add new topic',
  async ({ pageWithAuth: page }) => {
    await page.goto(BASE_URL);

    const addNewTopicButton = page.getByRole('button', {
      name: 'Add new topic',
    });

    // open modal
    await addNewTopicButton.click();

    //  retrieve inputs
    const nameInput = page.getByLabel('name');
    const descriptionInput = page.getByLabel('description');

    // fill inputs
    await nameInput.fill('test-topic');
    await descriptionInput.fill('test-description');

    // submit request
    const submit = page.getByText('+');
    await submit.click();

    await page.waitForSelector('text="test-topic"');
  }
);
