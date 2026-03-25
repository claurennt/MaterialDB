import * as cheerio from 'cheerio';

export const scrapeLinkWebsite = async (link: string) => {
  try {
    const response = await fetch(link, { signal: AbortSignal.timeout(5000) });
    const html = await response.text();
    const $ = cheerio.load(html);
    return (
      $('title').text() ||
      $('meta[property="og:title"]').attr('content') ||
      'Untitled'
    );
  } catch (e) {
    return 'New Link';
  }
};
