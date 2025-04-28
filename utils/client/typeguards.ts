import { NewLink, NewTopic } from '@types';

export const isTopic = (state: NewTopic | NewLink): state is NewTopic => {
  return 'name' in state;
};

export const isNewLink = (
  payload: any
): payload is NewLink & { _topic: string } => 'url' in payload;
