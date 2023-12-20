import { Admin } from 'types/pages';
import { Session } from 'next-auth';
import { ITopic } from './mongoose';

type EventTarget = typeof e.target & {
  name?: string;
  value?: string;
};

type NewLink = {
  url: string;
  category: string;
  tags: string[];
};

type NewTopic = {
  name: string;
  description: string;
};

// type CurrentAdmin = {
//   _id?: number;
//   username: string;
//   newTopic: NewData;
//   creatorId: string;
// };

type HighlightSearchTerm = (value: string) => { __html: string };
type AddNewFunction = (
  e:
    | React.MouseEvent<HTMLButtonElement, MouseEvent>
    | React.FormEvent<HTMLFormElement>
) => void;

// type AppProps = {
//   type?: string;
//   individualTopicId?: string;
//   setRetrievedTopics?: React.Dispatch<React.SetStateAction<ITopic[]>>;
//   children?: React.ReactNode;
//   session?: Admin;
//   link?: TopicLink;
//   search?: string;
//   currentTopics?: {}[];
//   /** array of objects! (common) */
//   categories?: {
//     type: string;
//     color: string;
//   }[];
//   inputs?: {
//     name: string;
//     placeholder: string;
//   }[];
//   /** an object with any number of properties (PREFERRED) */
//   newData?: NewData;
//   session: Admin;
//   individualTopic?: ITopic;
//   topicsArray?: ITopic[] | {}[];
//   action?: string;
//   name?: string;
//   open?: boolean;

//   setOpen?: React.Dispatch<React.SetStateAction<boolean>>;

//   addNew?: AddNewFunction;

//   /** function type syntax that takes an event (VERY COMMON) */

//   handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
// };

export type {
  NewLink,
  NewTopic,
  HighlightSearchTerm,
  AddNewFunction,
  EventTarget,
};
