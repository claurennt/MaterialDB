import bcrypt from "bcrypt";
import DBClient from "../../../utils/server/DBClient.js";
import Admin from "../../../models/Admin.js";
import { loadComponents } from "next/dist/server/load-components";
import withSession from "../../../utils/server/withSession.js";
import cookies from "next-cookies";
import { cookieParser } from "cookie-parser";
export default withSession(async (req, res) => {
  const { body: username, password, method, session } = req;

  await DBClient();

  switch (method) {
    case "GET":
      /*handle current admin context request*/
      try {
        // const me = session.get("MaterialDB");

        const me = req.session.get("MaterialDB");

        const currentAdmin = await Admin.findById(me.id).populate("topics");

        return res.status(200).send(currentAdmin);
      } catch (e) {
        console.log(e);
      }

    //     /*handle authentication*/

    //     if (!username || !password)
    //       return res.status(400).send("Missing username or password");

    //     try {
    //       const admin = await Admin.findOne({ username }).select("+password");

    //       if (!admin) {
    //         return res
    //           .status(404)
    //           .send("An admin with this username does not exist");
    //       }

    //       const isPasswordSame = await bcrypt.compare(password, admin.password);

    //       if (!isPasswordSame) return res.status(401).send("Invalid credentials");

    //       const token = user.createToken();

    //       return res
    //         .cookie("admin-token", token, { httpOnly: true })
    //         .send("Login was successfull");
    //     } catch (error) {
    //       return res.status(400).send(error);
    //     }
    // }
  }
});
