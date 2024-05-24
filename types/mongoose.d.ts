import { Types, Document } from 'mongoose';

interface IAdmin extends Document {
  generateToken?: () => string;
  name: string;
  password: string;
  email: string;
  image?: string | null;
  activated?: boolean;
  /** for array of referenced documents: https://mongoosejs.com/docs/typescript/schemas.html#arrays*/
  topics?: Types.DocumentArray<ITopic>;
  _conditions?: { _id: string };
}

interface ILink {
  title: string;
  /** for "primitive" arrays: https://mongoosejs.com/docs/typescript/schemas.html#arrays*/
  tags: string[];
  url: string;
  _id: string;
  _topic: Document<ITopic>;
}

interface ITopic {
  _id: string;
  name: string;
  description: string;
  subtopics: string[];
  links: ILink[];
  _creator: Types.ObjectId;
  _conditions?: { _id: string };
}

export { IAdmin, ILink, ITopic };
