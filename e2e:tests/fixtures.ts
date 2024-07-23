import { Page, test as base } from '@playwright/test';

import { withSession } from './helpers';

export type Fixture = {
  pageWithSession: Page;
};

export const testWithSession = base.extend<Fixture>({
  pageWithSession: async ({ browser }, use) => {
    const { page: authorizedPage, context: authorizedContext } =
      await withSession(browser);
    await use(authorizedPage);
    await authorizedContext.close();
  },
});
