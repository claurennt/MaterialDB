import React, { Fragment, useRef } from 'react';

import { useSession } from 'next-auth/react';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import ClipLoader from 'react-spinners/ClipLoader';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ModalInput } from '../ModalInput';
import {
  topicInputs,
  linkInputs,
  useFormHandler,
  useLiveRegion,
} from '@utils/client';
import { LiveRegion, Tag } from '@components';
import { SubmitFormButton } from 'components/SubmitFormButton';
import { NewLinkModalType } from '@types';

export type NewLinkModalProps = {
  individualTopicId?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: NewLinkModalType;
  open: boolean;
};

export const NewLinkModal: React.FC<NewLinkModalProps> = ({
  individualTopicId,
  setOpen,
  type,
  open,
}) => {
  const toastId = useRef(null);

  const router = useRouter();
  const { data: session } = useSession();
  const {
    user: { access_token },
  } = session;

  const { state, dispatch, handleSubmitForm, isValidInput, inputRef } =
    useFormHandler({ accessToken: access_token, session, individualTopicId });

  const { isError, isLoading, newLink, newTopic, tagValue } = state;

  const liveRegionContent = useLiveRegion({ open, type, isError, isLoading });

  const closeModalAndNavigate = () => {
    setTimeout(() => {
      setOpen(false);
      router.replace(router.asPath);
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    if (isError) dispatch({ type: 'SET_ERROR', payload: false });
    const value = e.currentTarget.value;

    if (type === 'link') {
      if (name === 'tags') dispatch({ type: 'SET_TAG_VALUE', payload: value });
      if (name === 'url')
        dispatch({
          type: 'SET_NEW_LINK',
          payload: { ...newLink, url: value },
        });
    } else {
      dispatch({
        type: 'SET_NEW_TOPIC',
        payload: { ...newTopic, [name]: value },
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
    dispatch({ type: 'SET_TAG_VALUE', payload: '' });
  };

  const handleRemoveTag = (currentTag: string) => {
    dispatch({
      type: 'SET_NEW_LINK',
      payload: {
        ...newLink,
        tags: newLink.tags.filter((tag) => tag !== currentTag),
      },
    });
  };

  const onFormSubmit = async (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const state = type === 'link' ? newLink : newTopic;

    // Validate and submit the form
    const isSubmissionSuccessful = await handleSubmitForm(e, state);

    if (!isSubmissionSuccessful) {
      return;
    }
    closeModalAndNavigate();
  };

  const isInputValid = isValidInput.current && !isError;
  const inputs = type === 'link' ? linkInputs : topicInputs;
  const dialogTitle =
    type === 'topic' ? 'Insert a new topic' : 'Add new article/resource';

  return (
    <Transition.Root show={open} as={'div'}>
      <div
        aria-modal='true'
        role='dialog'
        aria-labelledby={`${type}-dialog-title`}
      >
        <Dialog
          as='div'
          className='fixed z-10 inset-0 overflow-y-auto'
          onClose={setOpen}
          open={open}
        >
          <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
            <ToastContainer
              role='alert'
              ref={toastId}
              position='top-center'
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
            />
            <Transition.Child
              as={'div'}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
            </Transition.Child>
            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className='hidden sm:inline-block sm:align-middle sm:h-screen'
              aria-hidden='true'
            >
              &#8203;
            </span>
            <Transition.Child
              as={'div'}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <div className='relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
                <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                  <div className='flex'>
                    <div className='flex flex-col text-center sm:text-left w-full mt-2 ml-4'>
                      <div className='flex mb-4'>
                        <div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-secondary-200 sm:mx-0 sm:h-10 sm:w-10'></div>
                        <Dialog.Title
                          id={`${type}-dialog-title`}
                          as='h1'
                          className='text-lg leading-6 font-medium text-gray-900 ms-4 self-center'
                        >
                          {dialogTitle}
                        </Dialog.Title>
                      </div>
                      <div className='flex flex-col gap-4'>
                        {inputs.map(({ name }) => (
                          <ModalInput
                            ref={(el) => {
                              if (!el) return;

                              if (name === 'url' || name === 'name')
                                inputRef.current = el;
                            }}
                            isInputValid={isInputValid}
                            value={name === 'tags' ? tagValue : undefined}
                            name={name}
                            key={name}
                            handleChange={handleChange}
                            handleKeyDown={handleKeyDown}
                          />
                        ))}
                      </div>
                      <ul className='flex flex-wrap list-none'>
                        {type === 'link' &&
                          newLink.tags?.map((tag: string, i: number) => (
                            <Tag
                              tag={tag}
                              key={tag + i}
                              onClick={handleRemoveTag}
                              id={`remove-tag-${tag}`}
                              index={i}
                            />
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse flex justify-between'>
                  {session && (
                    <>
                      <SubmitFormButton
                        onFormSubmit={onFormSubmit}
                        type={type}
                      />
                    </>
                  )}

                  <div className='sm:flex sm:flex-row-reverse flex justify-center'>
                    <ClipLoader loading={isLoading} />
                    <LiveRegion liveRegionContent={liveRegionContent} />
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </div>
    </Transition.Root>
  );
};
