import DBClient from '@/utils/server/DBClient';
import Admin from '@/models/Admin';
import { NextAPIHandler } from '@/types/next-auth';

const handler: NextAPIHandler = async (req, res) => {
  const { method } = req;

  await DBClient();

  switch (method) {
    case 'GET':
      const { _id } = req.query;

      //block request if fields are missing
      if (!_id)
        return res.status(401).json({
          message: 'Something went wrong. Cannot validate user',
        });
      try {
        await Admin.findByIdAndUpdate(_id, {
          activated: true,
        });

        return res.redirect('/api/auth/register?activated=true');
      } catch (error) {
        return res.status(500).json(error.message);
      }
    default:
      return res.status(400).send('Bad request');
  }
};
export default handler;
