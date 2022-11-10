import bcrypt from 'bcrypt';
import DBClient from '../../../../utils/server/DBClient';
import Admin from '../../../../models/Admin';

import withSession from '../../../../utils/server/withSession';

export default withSession(async (req, res) => {
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

        res.redirect('/api/auth/register?activated=true');
      } catch (error) {
        console.log(error, error.message);
        return res.status(500).json(error.message);
      }
    default:
      res.status(400).send('Bad request');
  }
});
