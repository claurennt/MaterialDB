import { NextApiRequest, NextApiResponse } from 'next';
import { DBClient } from '@utils/server';
import { Topic, Admin } from '@models';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    body,
    method,
    query: { userId },
  } = req;

  await DBClient();

  switch (method) {
    case 'GET' /* Get a model by its ID */:
      try {
        const topics = await Topic.find(userId ? { _creator: userId } : {});

        if (!topics) {
          return res.status(404).send('No topics found');
        }
        return res.status(200).send(topics);
      } catch (error) {
        console.log('get', error);
        return res.status(400).send(error);
      }

    case 'POST' /* Edit a model by its ID */:
      try {
        const { name, description, creatorId } = body;

        const newTopic = await Topic.create({
          name,
          description,
          _creator: creatorId,
        });

        if (!newTopic) {
          return res
            .status(400)
            .send('Something went wrong, no topic wwas created');
        }

        await Admin.findByIdAndUpdate(
          creatorId,
          {
            $push: {
              topics: newTopic,
            },
          },
          { new: true }
        );

        return res.status(201).send(newTopic);
      } catch (error) {
        console.log(error);
        return res.status(400).send(error);
      }

    case 'DELETE' /* Delete a model by its ID */:
      try {
        const { deletedCount } = await Topic.deleteMany();

        if (!deletedCount) {
          return res.status(400).json('No topic deleted');
        }
        return res
          .status(204)
          .send(`Deleted ${deletedCount} topics from the DB`);
      } catch (error) {
        return res.status(400).send(error);
      }

    default:
      res.status(400).json({ success: false });
      break;
  }
};

export default handler;
