import { NewLink, NewTopic } from '@types';

export const isTopic = (state: NewTopic | NewLink): state is NewTopic => {
  return 'name' in state;
};
