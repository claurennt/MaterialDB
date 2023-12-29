import type { NextApiRequest, NextApiResponse } from 'next';
import DBClient from 'utils/server/DBClient';
import Topic from 'models/Topic';
import Link from 'models/Link';

import scrapeArticleTitle from 'utils/server/scrapeArticleTitle';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { _id },
    method,
    body,
  } = req;

  await DBClient();

  switch (method) {
    case 'GET' /* Get one Topic by its ID */:
      try {
        const individualTopic = await Topic.findById(_id).populate('links');

        if (!individualTopic) {
          return res.status(404).send('No topic was found with the id');
        }

        return res.status(200).send(individualTopic);
      } catch (error) {
        console.log(error);
        return res.status(400).send(error);
      }

    case 'PUT' /* Edit a Topic by its ID */:
      try {
        let {
          newLink: { url, tags, category },
        } = body;

        if (!url)
          return res.status(404).send('Bad request: url property missing');

        /*we scrape the page and get the title from the title s metadata in the head*/
        const title = await scrapeArticleTitle(url);

        //creates one Link document
        const newLink = await Link.create({
          url,
          tags,
          title,
          category,
        });

        //find the topic by its ID and add the new Link document to the links array
        const updatedTopic = await Topic.findByIdAndUpdate(
          _id,
          {
            $push: {
              links: newLink,
            },
          },
          { new: true }
        );
        console.log(updatedTopic);
        return res.status(200).send(newLink);
      } catch (error) {
        console.log(error.stack);
        return res.status(400).send(error);
      }

    case 'DELETE' /* Delete a model by its ID */:
      try {
        await Topic.deleteOne({ _id });

        return res.status(200).send('Successfully deleted topic');
      } catch (error) {
        console.log(error.message);
        return res.status(400).json({ success: false, error: error.message });
      }

    default:
      res.status(400).json({ success: false });
      break;
  }
}
