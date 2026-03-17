import { test, expect } from '@playwright/test';
import { testWithSession } from '../utils/tests:e2e/fixtures';
import { TESTUSER_ID } from '../utils/tests:e2e/helpers';

const TOPICS_PATH = './topics/6583143df9b1f53a8d01b793';
test.describe('Individual topic page without Session', () => {
  test('should show the title of the topic with that id in the page and the auth links', async ({
    page,
  }) => {
    await page.goto(`${TOPICS_PATH}?name=NodeJS&userId=${TESTUSER_ID}`);

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
    async ({ page }) => {
      await page.goto(`${TOPICS_PATH}&name=NodeJS`);

      const logoutButton = page.getByRole('link', { name: 'Logout' });

      await expect(logoutButton).toBeAttached();
    },
  );
  testWithSession('should successfully add new link', async ({ page }) => {
    await page.goto(TOPICS_PATH);
    const addNewLinkButton = page.getByRole('button', { name: 'Add new link' });

    await expect(addNewLinkButton).toBeAttached();
    // open modal
    await addNewLinkButton.click();
    const modal = page.getByRole('dialog');

    await expect(modal).toBeAttached();
    const urlInput = page.locator('#url');
    const tagsInput = page.locator('#tags');

    // fill inputs
    await urlInput.fill('https://www.w3.org/TR/WCAG21/');
    await tagsInput.fill('Tag1');
    await page.keyboard.press('Enter');
    await tagsInput.fill('Tag2');
    await page.keyboard.press('Enter');

    // submit request
    const submit = page.getByText('+');
    await submit.click();

    const newlyAddedLink = page.getByRole('link', {
      name: 'Web Content Accessibility Guidelines (WCAG) 2.1',
    });
    const tag1 = page.getByRole('button', {
      name: 'Tag1',
    });
    expect(tag1).toBeVisible();
    await expect(newlyAddedLink).toBeVisible();
  });
});
