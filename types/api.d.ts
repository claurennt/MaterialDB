import 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';

interface NextApiRequestWithSession extends NextApiRequest {
  session: any;
}

export { NextApiRequestWithSession };
