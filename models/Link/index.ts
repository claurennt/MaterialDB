import mongoose, { Model } from 'mongoose';
import { Topic } from '..';
import { ILink } from '@types';

const Schema = mongoose.Schema;

const linkSchema = new Schema<ILink>({
  category: { type: String, required: true },
  title: { type: String },
  tags: { type: [String], required: true },
  url: { type: String, required: true },
  _topic: { type: Schema.Types.ObjectId, ref: 'Topic' },
});

// after a findAndDeleteOne request for a link document is sent, delete its own reference inside the Topic document
linkSchema.post('findOneAndDelete', async function (this: ILink, next) {
  const { _id } = this;
  try {
    await Topic.findOneAndUpdate(
      { links: { $eq: _id } },
      { $pull: { links: _id } }
    );
  } catch (e) {
    console.log(e);
    throw new Error(
      `Somenthing went wrong. Link reference with ${_id} was not deleted from topic.`
    );
  }
});

export const Link: Model<ILink> =
  mongoose.models?.Link || mongoose.model('Link', linkSchema);
