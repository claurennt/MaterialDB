import { ITopic, ILink } from './mongoose';

type NewTopic = Pick<ITopic, 'name' | 'description'>;
type NewLink = Pick<ILink, 'url' | 'tags'>;

type AddNewFunction = (
  e:
    | React.MouseEvent<HTMLButtonElement, MouseEvent>
    | React.FormEvent<HTMLFormElement>
) => void;

export type { AddNewFunction, NewLink, NewTopic };

export type NewLinkModalType = 'topic' | 'link';

export type FormState = {
  newTopic: NewTopic;
  newLink: NewLink;
  tagValue: string;
  isError: boolean;
  isLoading: boolean;
};

export type FormAction =
  | { type: 'SET_NEW_TOPIC'; payload: NewTopic }
  | { type: 'SET_NEW_LINK'; payload: NewLink }
  | { type: 'SET_TAG_VALUE'; payload: string }
  | { type: 'SET_ERROR'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean };
