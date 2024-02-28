import puppeteer from 'puppeteer';

export const scrapeArticleTitle = async (link: string) => {
  try {
    // Launch the browser
    const browser = await puppeteer.launch();

    // Open a new tab
    const page = await browser.newPage();

    // Visit the page and wait until network connections are completed
    await page.goto(link, { waitUntil: 'networkidle2' });

    // Interact with the DOM to retrieve the titles
    const title = await page.$eval('head > title', (el) => el.textContent);

    // Don't forget to close the browser instance to clean up the memory
    await browser.close();

    return title;
  } catch (error) {
    return 'scraping!' + error;
  }
};
