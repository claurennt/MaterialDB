import { ITopic, ILink } from './mongoose';

type NewTopic = Pick<ITopic, 'name' | 'description'>;
type NewLink = Pick<ILink, 'url' | 'category' | 'tags'>;

type HighlightSearchTerm = (value: string) => { __html: string };
type AddNewFunction = (
  e:
    | React.MouseEvent<HTMLButtonElement, MouseEvent>
    | React.FormEvent<HTMLFormElement>
) => void;

export type { HighlightSearchTerm, AddNewFunction, NewLink, NewTopic };
