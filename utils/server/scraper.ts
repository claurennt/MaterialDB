import { Page } from 'puppeteer';

// Puppeteer extra is a wrapper around puppeteer,
import puppeteer from 'puppeteer-extra';

// Stealth plugin to make puppeteer look like a real browser
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

// Use the plugin
puppeteer.use(StealthPlugin());

const scrapeTitle = async (page: Page) => {
  const title = await page.$eval('head > title', (el) => el.textContent);
  return title;
};

export const scrapeLinkWebsite = async (
  link: string,
  target: string = 'title'
) => {
  try {
    // Launch the browser
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--window-size=1920,1080',
      ],
      headless: true,
    });

    // Open a new tab
    const page = await browser.newPage();

    // Visit the page and wait until network connections are completed
    await page.goto(link, { waitUntil: 'networkidle2' });

    // Interact with the DOM to retrieve the desired content
    const scrapedContent = await scrapeTitle(page);

    // Close the browser instance to clean up the memory
    browser.close();
    return scrapedContent;
  } catch (error) {
    return 'scraping!' + error;
  }
};
