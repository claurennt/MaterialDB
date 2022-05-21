import bcrypt from "bcrypt";
import DBClient from "../../../utils/server/DBClient.js";
import Admin from "../../../models/Admin.js";

import withSession from "../../../utils/server/withSession.js";

export default withSession(async (req, res) => {
  const { method } = req;

  await DBClient();

  try {
    if (method === "POST") {
      const { username, password } = req.body;

      //block request if fields are missing
      if (!username || !password)
        return res.status(400).json({
          message: "Bad request, please provide username and password",
        });
      const adminExists = await Admin.findOne({ username });
      if (adminExists)
        return res
          .status(400)
          .send("An Admin with this username already exists.");

      const newAdmin = new Admin({
        username,
        password: await bcrypt.hash(req.body.password, 10),
      });

      await newAdmin.save();

      req.session.set("MaterialDB", {
        id: newAdmin._id,
        username: newAdmin.username,
      });

      await req.session.save();

      return res.status(201).send("Admin created");
    }
  } catch (error) {
    console.log(error, error.message);
    return res.status(500).json(error.message);
  }
});
