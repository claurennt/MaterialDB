import mongoose, { Model } from 'mongoose';
import jwt from 'jsonwebtoken';

import { IAdmin } from '../../types';
const { NEXTAUTH_SECRET } = process.env;
const Schema = mongoose.Schema;

// the schema is the blueprint of our  model
const adminSchema = new Schema<IAdmin>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  email: { type: String, unique: true, required: true },
  image: { type: String, default: null },
  activated: { type: Boolean, default: false },
  activationToken: { type: String, select: false },
  activationTokenExpires: { type: Date, select: false },
});

adminSchema.methods.generateToken = async function () {
  if (!NEXTAUTH_SECRET)
    throw new Error('NEXTAUTH_SECRET is not defined in environment variables.');

  const payload: Pick<IAdmin, 'username' | '_id' | 'email'> = {
    _id: this._id,
    username: this.username,
    email: this.email,
  };

  // Create a new JWT and sign it
  const token = jwt.sign(payload, NEXTAUTH_SECRET);

  return token;
};

export const Admin: Model<IAdmin> =
  mongoose.models?.Admin || mongoose.model<IAdmin>('Admin', adminSchema);
