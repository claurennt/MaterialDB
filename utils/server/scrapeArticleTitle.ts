import puppeteer from 'puppeteer';
import axios from 'axios';

const scrapeArticleTitle = async (link: string) => {
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
};

export default scrapeArticleTitle;
