import bcrypt from 'bcrypt';
import Admin from '@/models/Admin';
import { IAdmin } from '@/types/mongoose';
import { NextAPIHandler } from '@/types/next-auth';
import DBClient from '@/utils/server/DBClient';

export const handler: NextAPIHandler = async (req, res) => {
  const { method } = req;

  await DBClient();

  try {
    if (method === 'POST') {
      // console.log(req.body);
      const { username, password, email } = req.body;
      //block request if fields are missing
      if (!username || !password || !email)
        return res.status(400).json({
          message: 'Bad request, please provide username, mail and password',
        });

      //when a user tries to register see if the email or username are already taken
      const adminExists = await Admin.find({
        username,
      }).countDocuments();

      if (adminExists)
        return res
          .status(404)
          .send('An Admin with this username or email already exists.');

      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = new Admin<IAdmin>({
        email,
        username,
        password: hashedPassword,
      });

      await newAdmin.save();

      //   TODO: send confirmation mail for registration

      return res.status(201).send('Admin created');
    }

    if (method === 'GET') {
      const { activated } = req.query;
      if (activated) res.redirect('/?activated=true');
    }
  } catch (error) {
    console.log(error, error.message);
    return res.status(500).json(error.message);
  }
};

export default handler;
