import DBClient from '../../../utils/server/DBClient';
import Admin from '../../../models/Admin';
import withSession from '../../../utils/server/withSession';

export default withSession(async (req, res) => {
  const { method } = req;

  await DBClient();

  switch (method) {
    case 'GET':
      /*handle current admin context request*/
      try {
        const me = await req.session.get('MaterialDB');

        if (!me) return res.send(404);

        const currentAdmin = await Admin.findById(me.id).populate('topics');

        return res.status(200).send(currentAdmin);
      } catch (e) {
        console.log(e);
        return res.status(500).send('Session problem');
      }
  }
});
