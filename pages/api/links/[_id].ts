import type { NextApiRequest, NextApiResponse } from 'next';
import { DBClient } from '@utils/server';
import { Link } from '@models';

import { ILink } from '@types';
import { scrapeLinkWebsite } from '@utils/server';

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
        const individualLink: ILink | null = await Link.findById(_id);

        if (!individualLink) {
          return res.status(404).send('No link was found with the id');
        }

        return res.status(200).send(individualLink);
      } catch (error) {
        return res.status(400).send(error);
      }

    case 'PUT' /* Edit a link by its ID */:
      try {
        const { link } = req.body;

        if (!link.url)
          return res.status(404).send('Bad request: url property missing');

        /*if the user hasn't provided a title for the link they are saving,
          we will scrape the page and get it from the title s metadata in the head*/
        if (!link.title) link.title = await scrapeLinkWebsite(link.url);

        const updatedLink: ILink = await Link.findByIdAndUpdate(_id, link, {
          new: true,
        });

        return res.status(200).send(updatedLink);
      } catch (error) {
        return res.status(400).send(error);
      }

    case 'DELETE' /* Delete a link by its ID */:
      try {
        const { deletedCount } = await Link.deleteOne({ _id });
        if (deletedCount)
          return res.status(200).send('Successfully deleted link');

        return res
          .status(400)
          .send(
            `Something went wrong and the link with id ${_id} was not deleted.`
          );
      } catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
      }
  }
}
