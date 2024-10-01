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

const preparePayload = (
  state: NewLink | NewTopic,
  session?: Session,
  individualTopicId?: string
) => {
  return isTopic(state)
    ? { ...state, creatorId: session.user.id }
    : { ...state, _topic: individualTopicId };
};

const validateRequiredFields = (state: NewLink | NewTopic) =>
  isTopic(state) ? Boolean(state.name) : Boolean(state.url);

export const useFormHandler = (
  accessToken: string,
  session: Session,
  individualTopicId?: string
) => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const inputRef = useRef<HTMLInputElement>(null);
  const isValidInput = useRef<boolean | null>(true);

  // Refactored validateInput with useCallback to memoize
  const validateInput = useCallback(
    (state: NewLink | NewTopic): boolean => {
      if (!inputRef.current) return false;

      const areRequiredFieldsValid = validateRequiredFields(state);
      if (!areRequiredFieldsValid) return false;

      const isUrlValid = isTopic(state) || validateUrl(state.url);

      return Boolean(isValidInput.current) && isUrlValid;
    },
    [isValidInput]
  );

  const handleSubmitForm = async (
    e: React.SyntheticEvent<HTMLButtonElement>,
    state: NewLink | NewTopic
  ): Promise<boolean> => {
    e.preventDefault();

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

  return { isValidInput, inputRef, state, dispatch, handleSubmitForm };
};
