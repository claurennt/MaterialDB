import { Session } from 'next-iron-session';

type IndividualTopic = {
  _id?: string;
  name?: string;
  description?: string;
  links?: array<string>;
  subtopics?: array<string>;
  creatorId?: string;
};

type AuthRequestHandler = (
  path?: string | null,
  data?: AuthRequestData
) => Promise<string | number>;

type Admin = {
  _id: string;
  username: string;
  email: string;
  password?: string;
  role: string;
  topics: IndividualTopic[];
};

export type { IndividualTopic, Admin, AuthRequestHandler };
