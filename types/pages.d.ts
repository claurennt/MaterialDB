import { ITopic } from './mongoose';

type Admin = {
  _id: string;
  name: string;
  email: string;
  password?: string;
  topics: ITopic[];
};

export type { Admin };
