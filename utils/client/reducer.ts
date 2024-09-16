import { FormState, FormAction } from '@types';

export const formReducer = (
  state: FormState,
  action: FormAction
): FormState => {
  switch (action.type) {
    case 'SET_NEW_TOPIC':
      return { ...state, newTopic: action.payload };
    case 'SET_NEW_LINK':
      return { ...state, newLink: action.payload };
    case 'SET_TAG_VALUE':
      return { ...state, tagValue: action.payload };
    case 'SET_ERROR':
      return { ...state, isError: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};
