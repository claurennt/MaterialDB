import { Session } from 'next-iron-session';
import { ITopic } from './mongoose';

// type IndividualTopic = {
//   _id?: string;
//   name?: string;
//   description?: string;
//   links?: array<string>;
//   subtopics?: array<string>;
//   creatorId?: string;
// };

type AuthRequestHandler = (
  path?: string | null,
  data?: AuthRequestData
) => Promise<string | number>;

type Admin = {
  _id: string;
  name: string;
  email: string;
  password?: string;
  topics: ITopic[];
};

export type { Admin, AuthRequestHandler };
