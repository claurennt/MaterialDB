import DBClient from "../../../utils/server/DBClient.js";
import Topic from "../../../models/Topic.js";
import Admin from "../../../models/Admin.js";
import Link from "../../../models/Link.js";
import scrapeArticleTitle from "../../../utils/server/scrapeArticleTitle.js";

export default async function handler(req, res) {
  const { method } = req;

  await DBClient();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const links = await Link.find();

        if (!links) {
          return res.status(404).send("No links found");
        }
        return res.status(200).send(links);
      } catch (error) {
        console.log(error);
        return res.status(400).send(error);
      }

    case "POST" /* Edit a model by its ID */:
      try {
        const { url, tags } = req.body;

        if (!url)
          return res.status(404).send("Bad request: url property missing");

        /*if the user hasn't provided a title for the link they are saving,
          we will scrape the page and get it from the title s metadata in the head*/
        if (!req.body.title) title = await scrapeArticleTitle(url);

        await Link.create({
          url,
          body,
          tags: tags,
        });

        const updatedAdmin = await Admin.findByIdAndUpdate(
          creatorId,
          {
            $push: {
              topics: newTopic,
            },
          },
          { new: true }
        ).populate("topics");
        return res.status(200).send("Successfully added link");
      } catch (error) {
        console.log(error.stack);
        res.status(400).send(error);
      }
  }
}
