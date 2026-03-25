import mongoose, { Model } from 'mongoose';
import { Topic } from '@models';
import { ILink } from '../../types';

const Schema = mongoose.Schema;

const linkSchema = new Schema<ILink>({
  title: { type: String },
  tags: { type: [String], required: true },
  url: { type: String, required: true },
  _topic: { type: Schema.Types.ObjectId, ref: 'Topic', required: true },
  _creator: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
});

export const Link: Model<ILink> =
  mongoose.models?.Link || mongoose.model('Link', linkSchema);
