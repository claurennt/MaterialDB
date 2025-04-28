import { test, expect } from '@playwright/test';
import { testWithSession } from '../utils/tests:e2e/fixtures';
import { TESTUSER_ID } from '../utils/tests:e2e/helpers';

const TOPICS_PATH = './topics/65e1deb0805c280a250f143f';
test.describe('Individual topic page without Session', () => {
  test('should show the title of the topic with that id in the page and the auth links', async ({
    page,
  }) => {
    await page.goto(`${TOPICS_PATH}?userId=${TESTUSER_ID}`);

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
      await page.goto(TOPICS_PATH);

      const logoutButton = page.getByRole('button', { name: 'Logout' });

      await expect(logoutButton).toBeAttached();
    }
  );
});
