import { test, expect } from '@playwright/test';
import { BASE_URL } from '../../globals';
import { TESTUSER_ID } from '../../utils/e2e/helpers';

test.describe('Home without Session', () => {
  test('should show the auth links and not show `Add New Topic`button and `Logout` link when session is null', async ({
    page,
  }) => {
    await page.goto(BASE_URL);

    const logoutLink = page.getByRole('link', { name: 'Logout' });
    const registerLink = page.getByRole('link', { name: 'Register' });
    const loginLink = page.getByRole('link', { name: 'Login' });
    const addNewTopicButton = page.getByRole('button', {
      name: 'Add new topic',
    });

    await expect(registerLink).toBeVisible();
    await expect(loginLink).toBeVisible();
    await expect(addNewTopicButton).not.toBeAttached();
    await expect(logoutLink).not.toBeAttached();
  });

  test('should show the auth button on the top right corner', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}/?userId=${TESTUSER_ID}`);

    const authLinksContainer = page
      .getByRole('link', { name: 'Register' })
      .locator('..');

    await expect(authLinksContainer).toHaveCSS('position', 'absolute');
  });
});
