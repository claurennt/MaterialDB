import { test, expect } from '@playwright/test';
import { TESTUSER_ID } from '../../utils/tests-e2e/helpers';
import { BASE_URL } from '../../globals';

const TOPICS_PATH = '/topics/6583143df9b1f53a8d01b793';

test.describe('Individual topic page without Session', () => {
  test('should show the title of the topic with that id in the page and the auth links', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}${TOPICS_PATH}?userId=${TESTUSER_ID}`);

    const authLinksContainer = page
      .getByRole('link', { name: 'Register' })
      .locator('..');

    // assert that the auth links are visible on the top right corner
    await expect(authLinksContainer).toHaveCSS('position', 'absolute');
  });
});
