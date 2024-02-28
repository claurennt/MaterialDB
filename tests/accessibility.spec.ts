import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://material-db.vercel.app';
test.describe('Accessibility', () => {
  test('should not have any automatically detectable accessibility issues', async ({
    page,
  }) => {
    await page.goto(BASE_URL);

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    await page.goto(`${BASE_URL}?userId=658311ccf9b1f53a8d01b78c`);

    const accessibilityScanResults2 = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults2.violations).toEqual([]);
  });
});
