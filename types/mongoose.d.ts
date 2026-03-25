import { Types, Document } from 'mongoose';

interface IAdmin extends Document {
  _id: Types.ObjectId;
  generateToken: () => string;
  username: string;
  password: string;
  email: string;
  image?: string;
  activated?: boolean;
  _conditions?: { _id: string };
  activationToken?: string;
  activationTokenExpires?: Date;
}

interface ILink {
  _id: Types.ObjectId;
  title: string;
  /** for "primitive" arrays: https://mongoosejs.com/docs/typescript/schemas.html#arrays*/
  tags: string[];
  url: string;
  _topic?: Document<ITopic>;
  _creator: Document<IAdmin>;
}

interface ITopic {
  _id: Types.ObjectId;
  name: string;
  description: string;
  subtopics: string[];
  links: ILink[];
  _creator: Types.ObjectId;
  _conditions?: { _id: string };
}

export { IAdmin, ILink, ITopic };
