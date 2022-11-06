import type { NextApiRequest, NextApiResponse } from 'next';

import DBClient from '../../utils/server/DBClient';
import Topic from '../../models/Topic';
import Link from '../../models/Link';
import Admin from '../../models/Admin';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { body, method, query } = req;

  await DBClient();

  switch (method) {
    case 'GET' /* Get a model by its ID */:
      try {
        const { userId } = query;
        const topics = await Topic.find(query && { _creator: userId });

        if (!topics) {
          return res.status(404).send('No topics found');
        }
        return res.status(200).send(topics);
      } catch (error) {
        console.log('get', error);
        return res.status(400).send(error);
      }
  }
}
