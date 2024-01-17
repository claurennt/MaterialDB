import mongoose, { Model } from 'mongoose';

import { IAdmin } from 'types/mongoose';
const Schema = mongoose.Schema;

// the schema is the blueprint of our  model
const adminSchema = new Schema<IAdmin>({
  name: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  email: { type: String, unique: true, required: true },
  image: { type: String, default: null },
  activated: { type: Boolean, default: false },
  topics: [{ type: Schema.Types.ObjectId, ref: 'Topic', default: [] }],
});

const Admin: Model<IAdmin> =
  mongoose.models?.Admin || mongoose.model<IAdmin>('Admin', adminSchema);

export default Admin;
