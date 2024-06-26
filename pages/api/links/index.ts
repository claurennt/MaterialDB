import type { NextApiRequest, NextApiResponse } from 'next';
import { DBClient } from '@utils/server';
import { Topic, Link } from 'models';

import { scrapeLinkWebsite } from '@utils/server';
import { ILink } from '@types';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  await DBClient();

  switch (method) {
    case 'GET' /* Get a model by its ID */:
      try {
        const links: ILink[] | null = await Link.find();

        if (!links) {
          return res.status(404).send('No links found');
        }
        return res.status(200).send(links);
      } catch (error) {
        console.log(error);
        return res.status(400).send(error);
      }

    case 'POST' /* Edit a model by its ID */:
      try {
        const { url, tags } = req.body;
        const { id } = req.query;

        if (!url)
          return res.status(404).send('Bad request: url property missing');

        /*if the user hasn't provided a title for the link they are saving,
          we will scrape the page and get it from the title s metadata in the head*/
        const title = req.body.title || (await scrapeLinkWebsite(url));

        const newLink = await Link.create({
          url,
          title,
          tags: tags,
        });

        const updatedTopic = await Topic.findByIdAndUpdate(
          id,
          {
            $push: {
              links: newLink,
            },
          },
          { new: true }
        ).populate('links');

        return res.status(200).send(updatedTopic);
      } catch (error) {
        console.log(error.stack);
        res.status(400).send(error);
      }
    case 'DELETE' /* Delete all links */:
      try {
        await Link.deleteMany();

        return res.status(200).send('Deleted all the links');
      } catch (error) {
        console.log(error);
        return res.status(400).send(error);
      }
  }
};
export default handler;
