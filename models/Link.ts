import mongoose, { HydratedDocument, Model } from 'mongoose';
import Topic from './Topic';
import { ILink, ITopic } from 'types/mongoose';

const Schema = mongoose.Schema;

const linkSchema = new Schema<ILink>({
  category: { type: String, required: true },
  title: { type: String },
  tags: { type: Array, required: true },
  url: { type: String, required: true },
});
/* before a deleteone request for a link document is sent, delete its own reference inside the Topic document,
if no reference was found cancel the operation and send an error*/
linkSchema.pre('deleteOne', async function (this: ILink, next) {
  const {
    _conditions: { _id },
  } = this;

  const result: ITopic = await Topic.findOneAndUpdate(
    { links: { $eq: _id } },
    { $pull: { links: _id } }
  );

  if (!result)
    return next(
      new Error(
        `404 Not Found: No reference to a document with id ${_id} was found in the selected topic. Operation canceled. `
      )
    );
  next();
});

const Link: Model<ILink> =
  mongoose.models?.Link || mongoose.model('Link', linkSchema);

export default Link;
