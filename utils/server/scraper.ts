import chromium from '@sparticuz/chromium';
import { chromium as playwright, Page } from 'playwright-core';
const scrapeTitle = async (page: Page) => {
  // Interact with the DOM to retrieve the desired content
  const title = await page.textContent('head > title');

  return title;
};

export const scrapeLinkWebsite = async (link: string) => {
  try {
    const browser = await playwright.launch({
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
