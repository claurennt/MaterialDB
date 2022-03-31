import DBClient from "../../../utils/DBClient.js";
import { Topic } from "../../../models/Models.js";
import { loadComponents } from "next/dist/server/load-components";

export default async function handler(req, res) {
  const {
    query: { _id },
    method,
  } = req;

  await DBClient();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const { links } = await Topic.findById(_id).lean();

        if (!links) {
          return res
            .status(404)
            .send("The selected topic does not have any associated links yet.");
        }
        return res.status(200).send(links);
      } catch (error) {
        console.log(error);
        return res.status(400).send(error);
      }

    case "PUT" /* Edit a model by its ID */:
      try {
        const links = await Topic.findById(_id).populate("links");

        if (!links) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: links });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE" /* Delete a model by its ID */:
      try {
        const deletedTopic = await Topic.deleteOne({ _id: id });
        if (!deletedTopic) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
