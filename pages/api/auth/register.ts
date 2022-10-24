import bcrypt from 'bcrypt';
import DBClient from '../../../utils/server/DBClient';
import Admin from '../../../models/Admin';

import withSession from '../../../utils/server/withSession';

export default withSession(async (req, res) => {
  const { method } = req;

  await DBClient();

  try {
    if (method === 'POST') {
      const { username, password } = req.body;

      //block request if fields are missing
      if (!username || !password)
        return res
          .status(400)
          .send('Bad request, please provide username and password');

      const adminExists = await Admin.findOne({ username });

      //block is admin already exists
      if (adminExists)
        return res
          .status(400)
          .send('An Admin with this username already exists.');

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({
        username,
        password: hashedPassword,
      });

      await newAdmin.save();

      req.session.set('MaterialDB', {
        id: newAdmin._id,
        username: newAdmin.username,
      });

      await req.session.save();

      return res.status(201).send('Admin created');
    }
  } catch (error) {
    console.log(error, error.message);
    return res.status(500).json(error.message);
  }
});
