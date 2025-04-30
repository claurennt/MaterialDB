import React from 'react';
import { useSession } from 'next-auth/react';

import { useRouter } from 'next/router';

import 'react-toastify/dist/ReactToastify.css';

import { ModalInput } from '../ModalInput';
import {
  linkInputs,
  topicInputs,
  useFormHandler,
  useLiveRegion,
} from '@utils/client';
import { LiveRegion } from '@components';
import { SubmitFormButton } from 'components/SubmitFormButton';
import { NewLinkModalType } from '@types';

import {
  ModalBody,
  ModalContainer,
  ModalFooter,
  ModalHeader,
} from './components/ModalLayout';
import { TagsList } from './components/TagList';

export type NewLinkModalProps = {
  individualTopicId?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: NewLinkModalType;
  open: boolean;
};

export const NewLinkModal: React.FunctionComponent<NewLinkModalProps> = ({
  individualTopicId,
  setOpen,
  type,
  open,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const access_token = session?.user?.access_token;

  const {
    state: formState,
    dispatch,
    handleSubmitForm,
  } = useFormHandler({
    accessToken: access_token,
    session,
    individualTopicId,
  });

  const { isError, isLoading, newLink, newTopic, tagValue } = formState;

  const liveRegionContent = useLiveRegion({
    open,
    type,
    isError,
    isLoading,
  });

  const closeModalAndNavigate = React.useCallback(() => {
    setTimeout(() => {
      setOpen(false);
      router.replace(router.asPath);
    }, 3000);
  }, [router, setOpen]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
      if (isError) dispatch({ type: 'SET_ERROR', payload: false });

      const value = e.currentTarget.value;

      if (type === 'link') {
        if (name === 'tags') {
          dispatch({ type: 'SET_TAG_VALUE', payload: value });
        }
        if (name === 'url') {
          dispatch({
            type: 'SET_NEW_LINK',
            payload: { ...newLink, url: value },
          });
        }
      } else {
        dispatch({
          type: 'SET_NEW_TOPIC',
          payload: { ...newTopic, [name]: value },
        });
      }
    },
    [dispatch, isError, newLink, newTopic, type]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (type === 'link' && e.key === 'Enter') {
        dispatch({
          type: 'SET_NEW_LINK',
          payload: {
            ...newLink,
            tags: [...newLink.tags, tagValue],
          },
        });
        dispatch({ type: 'SET_TAG_VALUE', payload: '' });
      }
    },
    [dispatch, newLink, tagValue, type]
  );

  const handleRemoveTag = React.useCallback(
    (currentTag: string) => {
      dispatch({
        type: 'SET_NEW_LINK',
        payload: {
          ...newLink,
          tags: newLink.tags.filter((tag) => tag !== currentTag),
        },
      });
    },
    [dispatch, newLink]
  );

  const onFormSubmit = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const currentState = type === 'link' ? newLink : newTopic;

    const isSubmissionSuccessful = await handleSubmitForm(e, currentState);
    if (!isSubmissionSuccessful) return;

    closeModalAndNavigate();
  };

  const inputs = type === 'link' ? linkInputs : topicInputs;

  return (
    <ModalContainer open={open} setOpen={setOpen} type={type}>
      <ModalHeader type={type} />
      <ModalBody>
        <div className='flex flex-col gap-4'>
          {inputs.map(({ name }) => (
            <ModalInput
              ref={(el) => {
                if (!el) return;
                if (name === 'url' || name === 'name') {
                  inputRef.current = el;
                }
              }}
              isInputValid={!isError}
              value={name === 'tags' ? tagValue : undefined}
              name={name}
              key={name}
              handleChange={handleChange}
              handleKeyDown={handleKeyDown}
            />
          ))}
        </div>

        {type === 'link' && (
          <TagsList tags={newLink.tags} onRemoveTag={handleRemoveTag} />
        )}
      </ModalBody>

      <ModalFooter isLoading={isLoading}>
        {session && (
          <SubmitFormButton onFormSubmit={onFormSubmit} type={type} />
        )}
        <LiveRegion liveRegionContent={liveRegionContent} />
      </ModalFooter>
    </ModalContainer>
  );
};
