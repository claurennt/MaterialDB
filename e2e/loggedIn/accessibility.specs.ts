import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { BASE_URL } from '../../globals';

// This is the ID from your previous topics test
const TOPICS_PATH = '/topics/6583143df9b1f53a8d01b793';

test.describe('Accessibility (Authenticated)', () => {
  // This project automatically uses the storageState from auth.setup.ts

  test('should not have accessibility issues on protected Home page', async ({
    page,
  }) => {
    await page.goto(BASE_URL);

    // Verify we are actually logged in before scanning
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('should not have accessibility issues on the Topic Detail page', async ({
    page,
  }) => {
    await page.goto(`${BASE_URL}${TOPICS_PATH}`);

    // Verify "Add new link" (an auth-only element) is present
    await expect(
      page.getByRole('button', { name: 'Add new link' }),
    ).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
