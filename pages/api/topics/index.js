import DBClient from "../../../utils/server/DBClient.js";
import Topic from "../../../models/Topic.js";
import Link from "../../../models/Link.js";
import Admin from "../../../models/Admin.js";

export default async function handler(req, res) {
  const {
    body,
    method,
    query: { currentUser },
  } = req;

  await DBClient();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const topics = await Topic.find({ _creator: currentUser.id });
        console.log(topics);
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
        const newTopic = await Topic.create({
          ...body.newTopic,
          links: [],
          subtopics: [],
          _creator: body._id,
        });

        if (!newTopic) {
          return res.status(400).send("Something went wrong");
        }

        await Admin.findByIdAndUpdate(
          body._id,
          {
            $push: {
              topics: newTopic,
            },
          },
          { new: true }
        );

        return res.status(201).send("Everything went well");
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
