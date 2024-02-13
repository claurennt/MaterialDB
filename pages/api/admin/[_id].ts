import type { NextApiRequest, NextApiResponse } from 'next';
import { DBClient } from '@utils/server';
import { Admin } from '@models';
import { getToken } from 'next-auth/jwt';
import { IAdmin } from '@types';
import { scrapeArticleTitle } from '@utils/server';
import { cookies } from 'next/headers';
const secret = process.env.NEXTAUTH_SECRET;
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
        const token = await getToken({ req, secret });

        const individualLink: IAdmin | null = await Admin.findById(_id);

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

        const updatedLink: IAdmin = await Admin.findByIdAndUpdate(_id, link, {
          new: true,
        });

        return res.status(200).send(updatedLink);
      } catch (error) {
        return res.status(400).send(error);
      }

    case 'DELETE' /* Delete a link by its ID */:
      try {
        const admin = await Admin.deleteOne({ _id });

        return res.status(200).send('Successfully deleted admin');
      } catch (error) {
        console.log(error);
        return res.status(400).send(error.message);
      }
  }
}
