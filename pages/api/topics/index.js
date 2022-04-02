import DBClient from "../../../utils/DBClient.js";
import { Topic } from "../../../models/Models.js";
import { loadComponents } from "next/dist/server/load-components";

export default async function handler(req, res) {
  const { body, method } = req;

  await DBClient();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const topics = await Topic.find({});

        if (!topics) {
          return res.status(404).send("No topics found");
        }
        return res.status(200).send(topics);
      } catch (error) {
        console.log("get", error);
        return res.status(400).send(error);
      }

    case "POST" /* Edit a model by its ID */:
      try {
        const topic = await Topic.create({ ...body });
        console.log("topic", topic);
        if (!topic) {
          return res.status(400).send("Something went wrong");
        }
        return res.status(201).send(topic);
      } catch (error) {
        console.log(error);
        res.status(400).send(error);
      }

    case "DELETE" /* Delete a model by its ID */:
      try {
        const { deletedCount } = await Topic.deleteMany();

        if (!deletedCount) {
          return res.status(400).json("No topic deleted");
        }
        res.status(204).send(`Deleted ${deletedCount} topics from the DB`);
      } catch (error) {
        res.status(400).json({ success: false });
      }

    default:
      res.status(400).json({ success: false });
      break;
  }
}
