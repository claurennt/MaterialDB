import withSession from '../../../utils/server/withSession';
import session from './session';

export default withSession(async (req, res) => {
  const { method } = req;

  switch (method) {
    case 'POST':
      req.session.destroy();

      return res.status(200).send('Successfully logged out');

    default:
      return res.status(400).send('Bad request');
  }
});
