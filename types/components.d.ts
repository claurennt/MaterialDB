import { ITopic, ILink } from './mongoose';

type NewTopic = Pick<ITopic, 'name' | 'description'>;
type NewLink = Pick<ILink, 'url' | 'tags'>;

type AddNewFunction = (
  e:
    | React.MouseEvent<HTMLButtonElement, MouseEvent>
    | React.FormEvent<HTMLFormElement>
) => void;

export type { AddNewFunction, NewLink, NewTopic };
