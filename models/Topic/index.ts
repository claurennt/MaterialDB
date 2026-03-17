import mongoose, { Model } from 'mongoose';
import { ITopic } from '../../types/mongoose';

const Schema = mongoose.Schema;

const topicSchema = new Schema<ITopic>({
  name: { type: String, required: true },
  description: { type: String },
  subtopics: { type: [String], default: [] },
  _creator: { type: Schema.Types.ObjectId, ref: 'Admin' },
});

export const Topic: Model<ITopic> =
  mongoose.models?.Topic ||
  mongoose.model<ITopic>('Topic', topicSchema, 'topics');
