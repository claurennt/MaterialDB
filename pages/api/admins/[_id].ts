import type { NextApiRequest, NextApiResponse } from 'next';
import { DBClient } from '@utils/server';
import { Admin } from '@models';
import { IAdmin } from '@types';
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
    case 'GET' /* Get an admin by its ID */:
      try {
        const admin: IAdmin | null = await Admin.findById(_id);

        if (!admin) {
          return res
            .status(404)
            .send(`No admin was found with the id '${_id}'`);
        }
        return res.status(200).send(admin);
      } catch (error) {
        console.log(error);
        return res.status(400).send(error);
      }

    case 'PUT' /* Edit an admin by its ID */:
      try {
        const { link } = req.body;

        if (!link.url)
          return res.status(404).send('Bad request: url property missing');

        /*if the user hasn't provided a title for the link they are saving,
          we will scrape the page and get it from the title s metadata in the head*/
        if (!link.title) link.title = await scrapeLinkWebsite(link.url);

        const adminWithUpdatedLink: IAdmin = await Admin.findByIdAndUpdate(
          _id,
          link,
          {
            new: true,
          }
        );

        return res.status(200).send(adminWithUpdatedLink);
      } catch (error) {
        return res.status(400).send(error);
      }

    case 'DELETE' /* Delete an admin by its ID */:
      try {
        await Admin.deleteOne({ _id });

        return res.status(200).send('Successfully deleted admin');
      } catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
      }
  }
}
