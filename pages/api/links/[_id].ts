import type { NextApiRequest, NextApiResponse } from 'next';
import DBClient from '../../../utils/server/DBClient.js';
import Topic from '../../../models/Topic.js';
import Link from '../../../models/Link.js';

import scrapeArticleTitle from '../../../utils/server/scrapeArticleTitle.js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { _id },
    method,
  } = req;

  await DBClient();

  switch (method) {
    case 'GET' /* Get a link by its ID */:
      try {
        const individualLink = await Link.findById(_id);

        if (!individualLink) {
          return res.status(404).send('No link was found with the id');
        }
        return res.status(200).send(individualLink);
      } catch (error) {
        console.log(error);
        return res.status(400).send(error);
      }

    case 'PUT' /* Edit a link by its ID */:
      try {
        const { link } = req.body;

        if (!link.url)
          return res.status(404).send('Bad request: url property missing');

        /*if the user hasn't provided a title for the link they are saving,
          we will scrape the page and get it from the title s metadata in the head*/
        if (!link.title) link.title = await scrapeArticleTitle(link.url);

        const updatedLink = await Link.findByIdAndUpdate(_id, ...link);

        return res.status(200).send(updatedLink);
      } catch (error) {
        console.log(error.stack);
        res.status(400).send(error);
      }
      break;

    case 'DELETE' /* Delete a link by its ID */:
      try {
        const x = await Link.deleteOne({ _id });

        return res.status(200).send(`Suucessfully deleted link`);
      } catch (error) {
        console.log('error', error.message);
        return res.status(400).send(error.message);
      }
  }
}
