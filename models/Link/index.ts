import mongoose, { Model } from 'mongoose';
import { Topic } from '@models';
import { ILink } from '@types';

const Schema = mongoose.Schema;

const linkSchema = new Schema<ILink>({
  title: { type: String },
  tags: { type: [String], required: true },
  url: { type: String, required: true },
  _topic: { type: Schema.Types.ObjectId, ref: 'Topic' },
});

/* after a deleteone request for a link document is sent, delete its own reference inside the Topic document,
if no reference was found cancel the operation and send an error*/
linkSchema.pre(
  'deleteOne',
  { document: false, query: true },
  async function (next) {
    const _id = this.getFilter()['_id'];

    try {
      await Topic.findOneAndUpdate(
        { links: { $eq: _id } },
        { $pull: { links: _id } }
      );
      next();
    } catch (e) {
      console.log(e);
      throw new Error(
        `Somenthing went wrong. Link reference with ${_id} was not deleted from topic.`
      );
    }
  }
);

export const Link: Model<ILink> =
  mongoose.models?.Link || mongoose.model('Link', linkSchema);
