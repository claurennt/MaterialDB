import { Page, test as base } from '@playwright/test';

import { withSession } from './helpers';

type MyFixtures = {
  pageWithAuth: Page;
};

export const testWithSession = base.extend<MyFixtures>({
  pageWithAuth: async ({ browser }, use) => {
    const { page: authorizedPage, context: authorizedContext } =
      await withSession(browser);
    await use(authorizedPage);
    await authorizedContext.close();
  },
});
