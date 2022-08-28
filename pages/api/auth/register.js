import bcrypt from "bcrypt";
import DBClient from "../../../utils/server/DBClient.js";
import Admin from "../../../models/Admin.js";

import withSession from "../../../utils/server/withSession.js";
import { sendConfirmationEmail } from "../../../utils/server/mailer";
export default withSession(async (req, res) => {
  const { method } = req;

  await DBClient();

  try {
    if (method === "POST") {
      // console.log(req.body);
      const { username, password, email } = req.body;
      //block request if fields are missing
      if (!username || !password || !email)
        return res.status(400).json({
          message: "Bad request, please provide username, mail and password",
        });

      //when a user tries to register see if the email or username are already taken
      const adminExists = await Admin.find({
        $or: [{ email }, { username }],
      }).countDocuments();

      if (adminExists)
        return res
          .status(404)
          .send("An Admin with this username or email already exists.");

      const newAdmin = new Admin({
        username,
        password: await bcrypt.hash(req.body.password, 10),
        email,
      });
      await newAdmin.save();

      sendConfirmationEmail(newAdmin);

      return res.status(201).send("Admin created");
    }

    if (method === "GET") {
      const { activated } = req.query;
      if (activated)
        return res
          .status(200)
          .send(
            "You have successfully activated your account. <a href='/?activated=true'>Login</a>"
          );
    }
  } catch (error) {
    console.log(error, error.message);
    return res.status(500).json(error.message);
  }
});
