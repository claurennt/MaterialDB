import bcrypt from "bcrypt";
import DBClient from "../../../utils/server/DBClient.js";
import Admin from "../../../models/Admin.js";

import withSession from "../../../utils/server/withSession.js";

export default withSession(async (req, res) => {
  // get user from database then:

  const { method } = req;

  await DBClient();

  switch (method) {
    case "POST":
      /*handle authentication*/
      const { username, password } = req.body;

      if (!username || !password)
        return res.status(400).send("Missing username or password");

      try {
        const admin = await Admin.findOne({ username }).select("+password");

        if (!admin) {
          return res
            .status(404)
            .send("An admin with this username does not exist");
        }

        const isPasswordSame = await bcrypt.compare(password, admin.password);

        if (!isPasswordSame) return res.status(401).send("Invalid credentials");

        req.session.set("MaterialDB", {
          id: admin._id,
          username: admin.username,
        });

        await req.session.save();

        return res.status(200).send("Login successfull");
      } catch (error) {
        return res.status(400).send(error.message);
      }
  }
});
