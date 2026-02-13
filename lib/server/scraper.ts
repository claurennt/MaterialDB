type Page = import('playwright').Page | import('playwright-core').Page;

const scrapeTitle = async (page: Page) => {
  return await page.textContent('head > title');
};

export const scrapeLinkWebsite = async (link: string) => {
  try {
    const isDevEnvironment = process.env.NODE_ENV === 'development';
    let browser;

    if (isDevEnvironment) {
      const { chromium } = await import('playwright');
      browser = await chromium.launch({ headless: true });
    } else {
      const chromiumAws = (await import('@sparticuz/chromium')).default;
      const { chromium } = await import('playwright-core');

      browser = await chromium.launch({
        args: chromiumAws.args,
        executablePath: await chromiumAws.executablePath(),
        headless: chromiumAws.headless,
      });
    }

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(link);
    const scrapedContent = await scrapeTitle(page);

    await browser.close();
    return scrapedContent;
  } catch (error) {
    console.error(error);
    return `scraping error: ${String(error)}`;
  }
};
