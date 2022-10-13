import { Types } from 'mongoose';

interface IAdmin {
  username: string;
  password: string;
  role?: string;
  /** for array of referenced documents: https://mongoosejs.com/docs/typescript/schemas.html#arrays*/
  topics?: Types.DocumentArray<ITopics>;
}

interface ILink {
  category: string;
  title?: string;
  /** for "primitive" arrays: https://mongoosejs.com/docs/typescript/schemas.html#arrays*/
  tags: Types.Array;
  url: string;
}

interface ITopic {
  name: string;
  description: string;
  subtopics: Types.Array;
  links: Types.DocumentArray<ILink>;
  _creator: Types.DocumentArray<IAdmin>;
}

export { IAdmin, ILink, ITopic };
