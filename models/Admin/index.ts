import mongoose, { Model } from 'mongoose';
import * as jose from 'jose';
import { SECRET } from '../../globals';
import { IAdmin } from '@types';
import { Topic } from '@models';

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

adminSchema.pre(
  'deleteOne',
  { document: false, query: true },
  async function (next) {
    const _id = this.getFilter()['_id'];

    try {
      await Topic.findOneAndDelete({ _creator: _id });

      next();
    } catch (e) {
      console.log(e);
      throw new Error(
        `Somenthing went wrong. Topic reference with id ${_id} was not deleted from admin.`
      );
    }
  }
);
adminSchema.methods.generateToken = async function () {
  const payload = {
    _id: this._id,
    name: this.name,
    email: this.email,
  };

  // Create a new JWT and sign it
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    // .setExpirationTime('2h')
    .sign(SECRET);

  return jwt;
};

export const Admin: Model<IAdmin> =
  mongoose.models?.Admin || mongoose.model<IAdmin>('Admin', adminSchema);
