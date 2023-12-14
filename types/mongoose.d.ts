import { Types, Document } from 'mongoose';

interface IAdmin {
  name: string;
  password: string;
  email: string;
  image?: string | null;
  activated?: boolean;

  /** for array of referenced documents: https://mongoosejs.com/docs/typescript/schemas.html#arrays*/
  topics?: Types.DocumentArray<ITopics>;
  _conditions?: { _id: string };
}

interface ILink {
  category: string;
  title?: string;
  /** for "primitive" arrays: https://mongoosejs.com/docs/typescript/schemas.html#arrays*/
  tags: Types.Array;
  url: string;

  _conditions?: { _id: string };
}

interface ITopic {
  _id: string;
  name: string;
  description: string;
  subtopics: Types.Array;
  links: Types.DocumentArray<ILink>;
  _creator: Types.ObjectId;
  _conditions?: { _id: string };
}

export { IAdmin, ILink, ITopic };
