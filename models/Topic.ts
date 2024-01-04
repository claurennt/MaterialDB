import mongoose, { Model } from 'mongoose';
import { ITopic } from 'types/mongoose';

import Admin from './Admin';

const Schema = mongoose.Schema;

const topicSchema = new Schema<ITopic>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  subtopics: { type: [String], default: [] },
  links: [{ type: Schema.Types.ObjectId, ref: 'Link', default: [] }],
  _creator: { type: Schema.Types.ObjectId, ref: 'Admin' },
});

/* before a deleteone request for a link document is sent, delete its own reference inside the Admin document,
if no reference was found cancel the operation and send an error*/
topicSchema.pre('deleteOne', async function (this: ITopic, next) {
  const { _id } = this;

  const result = await Admin.findOneAndUpdate(
    { topics: { $eq: _id } },
    { $pull: { topics: _id } }
  );

  if (!result)
    return next(
      new Error(
        `404 Not Found: No reference to a document with id ${_id} was found in the selected admin. Operation canceled. `
      )
    );
  next();
});
const Topic: Model<ITopic> =
  mongoose.models?.Topic ||
  mongoose.model<ITopic>('Topic', topicSchema, 'topics');

export default Topic;
