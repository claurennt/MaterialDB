import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-iron-session';

type NextIronRequest = NextApiRequest & { session: Session };

type NextIronHandler = (
  req: NextIronRequest,
  res: NextApiResponse
) => void | Promise<void>;

export type { NextIronHandler };
