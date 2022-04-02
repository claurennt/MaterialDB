import cheerio from "cheerio";
import axios from "axios";

const scrapeArticleTitle = async (link) => {
  const { data } = await axios.get(link);

  // Load HTML we fetched in the previous line
  const $ = cheerio.load(data);

  const title = $("head > title").text();

  return title;
};

export default scrapeArticleTitle;
