import bcrypt from 'bcrypt';

import { Admin } from '@models';
import { NextAPIHandler, IAdmin } from '@types';
import { DBClient, sendActivationEmail } from '@utils/server';

export const handler: NextAPIHandler = async (req, res) => {
  const { method } = req;

  await DBClient();

  try {
    if (method === 'POST') {
      const { name, password, email } = req.body;
      //block request if fields are missing
      if (!name || !password || !email)
        return res.status(400).json({
          message: 'Bad request, please provide username, email and password',
        });

      //when a user tries to register see if the email or username are already taken
      const adminExists = await Admin.find({
        $or: [{ name }, { email }],
      }).countDocuments();

      if (adminExists)
        return res.status(400).send('Email or username already in use');

      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdmin = new Admin({
        email,
        name,
        password: hashedPassword,
      });

      await newAdmin.save();

      const { _id } = newAdmin;

      //send confirmation email to user
      sendActivationEmail(name, email, _id);

      return res.status(201).send('Admin created');
    }
  } catch (error) {
    console.log(error, error.message);
    return res.status(500).send(error.message);
  }
};

export default handler;
