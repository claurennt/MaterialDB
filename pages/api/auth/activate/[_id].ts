import { DBClient, sendRegistrationConfirmationEmail } from '@utils/server';
import { Admin } from '@models';
import { NextAPIHandler } from '@types';

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
        const { name, email } = await Admin.findByIdAndUpdate(_id, {
          activated: true,
        });

        setTimeout(() => sendRegistrationConfirmationEmail(name, email), 10000);

        return res.status(200).redirect('/auth/register?activated=true');
      } catch (error) {
        return res.status(500).json(error.message);
      }
    default:
      return res.status(400).send('Bad request');
  }
};
export default handler;
