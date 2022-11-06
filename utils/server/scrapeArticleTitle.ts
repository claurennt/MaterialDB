import cheerio from "cheerio";
import axios from "axios";

const scrapeArticleTitle = async (link) => {
  const { data } = await axios.get(link);

  // Load HTML we fetched in the previous line
  const $ = cheerio.load(data);

  // scrape title from the title s metadata in the head*/
  const title = $("head > title").text();

  return title;
};

export default scrapeArticleTitle;
