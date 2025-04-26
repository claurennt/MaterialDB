// useFormHandler.ts
import { FormState, NewLink, NewTopic } from '@types';
import { useReducer, useRef, useCallback } from 'react';
import { addNewResource, formReducer, isTopic, validateUrl } from '.';

import { Session } from 'next-auth';

const initialState: FormState = {
  newTopic: { name: '', description: '' },
  newLink: { url: '', tags: [] },
  tagValue: '',
  isError: false,
  isLoading: false,
};

const hasRequiredFields = (state: NewLink | NewTopic): boolean => {
  if (isTopic(state)) {
    return Boolean(state.name.trim());
  }
  return Boolean(state.url.trim());
};

const isValidResource = (state: NewLink | NewTopic): boolean => {
  if (isTopic(state)) {
    return true; // Topics don't need URL validation
  }
  return validateUrl(state.url);
};

const preparePayload = (
  state: NewLink | NewTopic,
  session?: Session,
  individualTopicId?: string
) => {
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error('Session user ID is missing');
  }

  return isTopic(state)
    ? { ...state, creatorId: userId }
    : { ...state, _topic: individualTopicId };
};

type UseFormHandler = {
  accessToken: string;
  session: Session;
  individualTopicId?: string;
};

export const useFormHandler = ({
  accessToken,
  session,
  individualTopicId,
}: UseFormHandler) => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const validateInput = (state: NewLink | NewTopic): boolean => {
    if (!inputRef.current) return false;

    return hasRequiredFields(state) && isValidResource(state);
  };

  const handleSubmitForm = async (
    e: React.SyntheticEvent<HTMLButtonElement>,
    state: NewLink | NewTopic
  ): Promise<boolean> => {
    e.preventDefault();
    if (!inputRef.current) return false;

    const payload = preparePayload(state, session, individualTopicId);

    const canSubmit = validateInput(state);

    if (!canSubmit) {
      dispatch({ type: 'SET_ERROR', payload: true });

      inputRef.current.focus();
      return false;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await addNewResource(e, accessToken, payload);
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: true });
      return false;
    }
  };

  return { inputRef, state, dispatch, handleSubmitForm };
};
