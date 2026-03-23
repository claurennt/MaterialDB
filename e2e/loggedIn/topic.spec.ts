import { test, expect } from '@playwright/test';
import { BASE_URL } from '../../globals';

const TOPICS_PATH = '/topics/6583143df9b1f53a8d01b793';

test.describe('Individual topic page with Session', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}${TOPICS_PATH}`);
  });

  test('should show the `Add new link` and `Logout` button', async ({
    page,
  }) => {
    await expect(page).not.toHaveURL(/.*api\/auth\/error/);

    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Add new link' }),
    ).toBeVisible();
  });

  test('should successfully add new link', async ({ page }) => {
    const addNewLinkButton = page.getByRole('button', { name: 'Add new link' });

    await expect(addNewLinkButton).toBeAttached();
    // open modal
    await addNewLinkButton.click();
    const modal = page.getByRole('dialog');

    await expect(modal).toBeAttached();
    const urlInput = page.locator('#url');
    const tagsInput = page.locator('#tags');

    // fill inputs
    await urlInput.fill('https://www.w3.org/TR/WCAG22/');
    await tagsInput.fill('Tag1');
    await page.keyboard.press('Enter');
    await tagsInput.fill('Tag2');
    await page.keyboard.press('Enter');

    // submit request
    const submit = page.getByRole('button', { name: 'Add link' });
    await submit.click();

    const newlyAddedLink = page
      .getByRole('link', {
        name: 'Web Content Accessibility Guidelines (WCAG) 2.2',
      })
      .first();
    const tag1 = page
      .getByRole('button', {
        name: 'Tag1',
      })
      .first();
    expect(tag1).toBeVisible();
    await expect(newlyAddedLink).toBeVisible();
  });
});
