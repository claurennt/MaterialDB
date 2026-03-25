import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { BASE_URL } from '../../globals';

test.describe('Accessibility', () => {
  // This runs in the 'chromium-guest' project (clean state)

  test('should not have any automatically detectable accessibility issues', async ({
    page,
  }) => {
    // 1. Check the default landing page
    await page.goto(BASE_URL);

    const accessibilityScanResults = await new AxeBuilder({
      page,
    }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    // 2. Check the landing page with a specific userId view
    await page.goto(`${BASE_URL}?userId=658311ccf9b1f53a8d01b78c`);

    const accessibilityScanResults2 = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults2.violations).toEqual([]);
  });
});
