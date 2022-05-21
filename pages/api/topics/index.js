import DBClient from "../../../utils/server/DBClient.js";
import Topic from "../../../models/Topic.js";
import Link from "../../../models/Link.js";
import Admin from "../../../models/Admin.js";

export default async function handler(req, res) {
  const {
    body,
    method,
    query: { userId },
  } = req;

  await DBClient();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const topics = await Topic.find(userId ? { _creator: userId } : {});

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
        const {
          newTopic: { name, description },
          creatorId,
        } = body;

        const newTopic = await Topic.create({
          name,
          description,
          links: [],
          subtopics: [],
          _creator: creatorId,
        });

        if (!newTopic) {
          return res.status(400).send("Something went wrong");
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(
          creatorId,
          {
            $push: {
              topics: newTopic,
            },
          },
          { new: true }
        ).populate("topics");

        return res.status(201).send(updatedAdmin);
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
