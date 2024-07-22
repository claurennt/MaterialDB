import { test, expect } from '@playwright/test';
import { testWithSession } from './fixtures';
import { TESTUSER_ID } from './helpers';

test.describe('Individual topic page without Session', () => {
  test('should show the title of the topic with that id in the page and the auth links', async ({
    page,
  }) => {
    await page.goto(`./topics/65e1deb0805c280a250f143f?userId=${TESTUSER_ID}`);

    const authLinksContainer = page
      .getByRole('link', { name: 'Register' })
      .locator('..');

    // assert that the auth links are visible on the top right corner
    await expect(authLinksContainer).toHaveCSS('position', 'absolute');
  });
});

testWithSession.describe('Individual topic page with Session', () => {
  testWithSession(
    'should show the `Add new link` and `Logout` button',
    async ({ pageWithSession: page }) => {
      await page.goto('./topics/65defa05f1ad49aac2eb9c47');

      const logoutButton = page.getByRole('button', { name: 'Logout' });

      await expect(logoutButton).toBeAttached();
    }
  );
});
