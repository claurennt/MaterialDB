import DBClient from "../../../utils/DBClient.js";
import { Topic, Link } from "../../../models/Models.js";
import { loadComponents } from "next/dist/server/load-components";
import puppeteer from "puppeteer";
import scrapeArticleTitle from "../../../utils/helpers/scrapeArticleTitle.js";
export default async function handler(req, res) {
  const {
    query: { _id },
    method,
  } = req;

  await DBClient();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const individualTopic = await Topic.findById(_id).populate("links");

        if (!individualTopic) {
          return res.status(404).send("No topic was found with the id");
        }
        return res.status(200).send(individualTopic);
      } catch (error) {
        console.log(error);
        return res.status(400).send(error);
      }

    case "PUT" /* Edit a model by its ID */:
      try {
        const { link } = req.body;

        if (!link.url)
          return res.status(404).send("Bad request: url property missing");

        /*if the user hasn't provided a title for the link they are saving,
          we will scrape the page and get it from the title s metadata in the head*/
        if (!link.title) link.title = await scrapeArticleTitle(link.url);

        const newLink = await Link.create({
          ...link,
        });

        const updatedTopic = await Topic.findByIdAndUpdate(_id, {
          $push: {
            links: { ...newLink },
          },
        });

        return res.status(200).send(updatedTopic);
      } catch (error) {
        console.log(error.stack);
        res.status(400).send(error);
      }
      break;

    case "DELETE" /* Delete a model by its ID */:
      try {
        const deletedLink = await Link.deleteOne({ _id });
        if (!deletedLink) {
          return res.status(400).send("Something went wrong");
        }

        return res.status(200).json({ success: true, data: {} });
      } catch (error) {
        console.log(error.message);
        return res.status(400).json({ success: false });
      }

    default:
      res.status(400).json({ success: false });
      break;
  }
}
