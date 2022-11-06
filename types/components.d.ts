import { IndividualTopic } from '@/types/pages';
import { HandleUserAuthRequest } from '@/types/components';

type EventTarget = typeof e.target & {
  name?: string;
  value?: string;
};

type NewLink = {
  url: string;
  category: string;
  tags: string[];
};

type TopicLink = {
  _id: string;
  title: string;
  url: string;
  tags: string[];
  category: string;
};

type NewData = {
  name?: string | string[];
  description?: string;
  url?: string;
  category?: string;
  tags?: string[];
};

type CurrentAdmin = {
  newTopic: NewData;
  creatorId: string;
};

type HighlightSearchTerm = (value: string) => { __html: string };
type AddNewFunction = (
  e:
    | React.MouseEvent<HTMLButtonElement, MouseEvent>
    | React.FormEvent<HTMLFormElement>
) => void;

type HandleUserAuth = (
  e:
    | React.MouseEvent<HTMLButtonElement, MouseEvent>
    | React.FormEvent<HTMLFormElement>
) => void;

type AppProps = {
  link?: TopicLink;
  search?: string;
  currentTopics?: {}[];
  /** array of objects! (common) */
  categories?: {
    type: string;
    color: string;
  }[];
  inputs?: {
    name: string;
    placeholder: string;
  }[];
  /** an object with any number of properties (PREFERRED) */
  newData?: NewData;

  individualTopic?: IndividualTopic;

  name?: string;
  open?: boolean;
  currentAdmin?: CurrentAdmin | string | string[];
  setCurrentAdmin?: React.Dispatch<
    React.SetStateAction<undefined | CurrentAdmin>
  >;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  addNew?: AddNewFunction;
  setTopicLinks?: React.Dispatch<React.SetStateAction<TopicLink[]>>;
  /** function type syntax that takes an event (VERY COMMON) */

  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export type {
  AppProps,
  HomeProps,
  TopicLink,
  NewLink,
  HighlightSearchTerm,
  AddNewFunction,
  HandleUserAuth,
  SetAuthState,
  EventTarget,
};
