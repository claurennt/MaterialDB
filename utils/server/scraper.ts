import playwright, { Page as DevPage } from 'playwright';
import chromium from '@sparticuz/chromium';
import { chromium as playwrightCore, Page as ProdPage } from 'playwright-core';

type Page = DevPage | ProdPage;

const isDevEnvironment = process.env.NODE_ENV === 'development';
const scrapeTitle = async (page: Page) => {
  // Interact with the DOM to retrieve the desired content
  const title = await page.textContent('head > title');

  return title;
};

export const scrapeLinkWebsite = async (link: string) => {
  try {
    const browser = isDevEnvironment
      ? await playwright.chromium.launch({ headless: true })
      : await playwrightCore.launch({
          args: chromium.args,
          executablePath: await chromium.executablePath(),
          headless: Boolean(chromium.headless),
        });

    const context = await browser.newContext();

    const page = await context.newPage();

    await page.goto(link);

    const scrapedContent = await scrapeTitle(page);

    // Close the browser instance to clean up the memory
    browser.close();
    return scrapedContent;
  } catch (error) {
    return 'scraping!' + error;
  }
};
