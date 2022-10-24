import { IndividualTopic } from '@/types/pages';

type Links = {
  _id: string;
  title: string;
  url: string;
  tags: string;
  category: string;
}[];

type NewData = {
  name?: string | string[];
  description?: string;
  url?: string;
  category?: string;
  tags?: any[];
};
type CurrentAdmin = {
  newTopic: NewData;
  creatorId: string;
};

type AppProps = {
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
  setOpen?: (value: boolean) => void;
  addNew?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /** function type syntax that takes an event (VERY COMMON) */

  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export type { AppProps, HomeProps };
