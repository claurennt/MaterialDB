import { FormState, NewLink, NewTopic } from '@types';
import { useReducer, useRef } from 'react';
import { addNewResource, formReducer, isTopic, validateUrl } from '.';
import { Session } from 'next-auth';

const initialState: FormState = {
  newTopic: { name: '', description: '' },
  newLink: { url: '', tags: [] },
  tagValue: '',
  isError: false,
  isLoading: false,
};

export const useFormHandler = (
  accessToken: string,
  session: Session,
  individualTopicId?: string
) => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const inputRef = useRef<HTMLInputElement>(null);
  const isValidInput = useRef<boolean | null>(true);

  const preparePayload = (state: NewLink | NewTopic) => {
    return isTopic(state)
      ? { ...state, creatorId: session.user.id }
      : { ...state, _topic: individualTopicId };
  };

  const validateRequiredFields = (state: NewLink | NewTopic) =>
    isTopic(state) ? Boolean(state.name) : Boolean(state.url);

  const validateInput = (state: NewLink | NewTopic) => {
    // Ensure the input reference is valid
    if (!inputRef) return false;

    // Validate required fields
    const areRequiredFieldsValid = validateRequiredFields(state);
    if (!areRequiredFieldsValid) return false;
    //Validate URL format for link submissions
    const isUrlValid = !isTopic(state) && validateUrl(state.url);

    const canSubmit = isTopic(state)
      ? isValidInput
      : isValidInput && isUrlValid;

    return canSubmit;
  };

  const handleSubmitForm = async (
    e: React.SyntheticEvent<HTMLButtonElement>,
    state: NewLink | NewTopic
  ): Promise<boolean> => {
    e.preventDefault();
    if (!inputRef) return;

    const payload = preparePayload(state);

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
