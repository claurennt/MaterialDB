import bcrypt from "bcrypt";
import DBClient from "../../../../utils/server/DBClient.js";
import Admin from "../../../../models/Admin.js";

import withSession from "../../../../utils/server/withSession.js";

export default withSession(async (req, res) => {
  const { method } = req;

  await DBClient();

  try {
    if (method === "GET") {
      const { _id } = req.query;

      //block request if fields are missing
      if (!id)
        return res.status(401).json({
          message: "Something went wrong. Cannot validate user",
        });

      await Admin.findByIdAndUpdate(id, {
        activated: true,
      });

      return res.redirect("/api/auth/register?activated=true");
    }
  } catch (error) {
    console.log(error, error.message);
    return res.status(500).json(error.message);
  }
});
