import mongoose, { Model } from 'mongoose';
import { ITopic } from 'types/mongoose';

import { Admin } from '@models';

const Schema = mongoose.Schema;

const topicSchema = new Schema<ITopic>({
  name: { type: String, required: true },
  description: { type: String },
  subtopics: { type: [String], default: [] },
  links: [{ type: Schema.Types.ObjectId, ref: 'Link', default: [] }],
  _creator: { type: Schema.Types.ObjectId, ref: 'Admin' },
});

/* before a deleteone request for a link document is sent, delete its own reference inside the Admin document,
if no reference was found cancel the operation and send an error*/
topicSchema.pre(
  'deleteOne',
  { document: false, query: true },
  async function (next) {
    const _id = this.getFilter()['_id'];

    try {
      await Admin.findOneAndUpdate(
        { links: { $eq: _id } },
        { $pull: { links: _id } }
      );
      next();
    } catch (e) {
      console.log(e);
      throw new Error(
        `Somenthing went wrong. Topic reference with id ${_id} was not deleted from admin.`
      );
    }
  }
);
export const Topic: Model<ITopic> =
  mongoose.models?.Topic ||
  mongoose.model<ITopic>('Topic', topicSchema, 'topics');
