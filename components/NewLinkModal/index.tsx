/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useRef, useState } from 'react';

import { useSession } from 'next-auth/react';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ModalInput } from '../ModalInput';
import type { NewTopic, NewLink } from '@types';
import {
  topicInputs,
  linkInputs,
  addNewResource,
  validateUrl,
} from '@utils/client';
import { FormTag } from '@components';

type NewLinkModalType = 'topic' | 'link';

export type NewLinkModalProps = {
  individualTopicId?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: NewLinkModalType;
  open: boolean;
};

const isTopic = (state: NewTopic | NewLink): state is NewTopic => {
  return 'name' in state;
};

export const NewLinkModal: React.FunctionComponent<NewLinkModalProps> = ({
  individualTopicId,
  setOpen,
  type,
  open,
}) => {
  const toastId = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isValidInput = useRef<boolean>(true);
  const announceLiveRegion = useRef<boolean>(false);

  const [newTopic, setNewTopic] = useState<NewTopic>({
    name: '',
    description: '',
  });
  const [newLink, setNewLink] = useState<NewLink>({
    url: '',
    tags: [],
  });
  const [tagValue, setTagValue] = useState<string>('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();
  const {
    user: { access_token },
  } = session;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    // make the error disappear when user starts correcting invalid input
    if (isError) {
      setIsError(false);
    }
    const target = e.currentTarget;

    if (type === 'link') {
      //handleChange for newLink modal
      if (name === 'tags') {
        setTagValue(target.value);
      }
      if (name === 'url') {
        setNewLink((prev) => ({ ...prev, url: target.value }));
      }
    }
    //handleChange for newTopic modal
    else setNewTopic((prev) => ({ ...prev, [target.name]: target.value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === 'link' && e.key === 'Enter') {
      setNewLink((prev) => ({ ...prev, tags: [...prev.tags, tagValue] }));

      setTagValue('');
    }
  };

  const handleRemoveTag = (currentTag: string) => {
    setNewLink((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag: string) => tag !== currentTag),
    }));
  };
  // Handles closing the modal and navigating
  const closeModalAndNavigate = () => {
    setOpen(false);
    setTimeout(() => router.replace(router.asPath), 3000);
  };

  const handleSubmitForm = async (
    e: React.SyntheticEvent<HTMLButtonElement>,
    state: NewTopic | NewLink
  ) => {
    e.preventDefault();
    if (!inputRef.current) return;

    const isTopicState = isTopic(state);
    const payload = isTopicState
      ? { ...state, creatorId: session.user.id }
      : { ...state, _topic: individualTopicId };

    //checks if required fields are missing  on submit
    isValidInput.current = isTopicState
      ? Boolean(state.name)
      : Boolean(state.url);

    // check if url is malformatted
    const isUrlFormatValid = !isTopicState && validateUrl(state.url);

    const isValidInputValue =
      (isValidInput.current && isUrlFormatValid) || isValidInput.current;

    if (!isValidInputValue) {
      setIsError(true);
      inputRef.current.focus(); //it's good practice to auto-focus invalid input after validation
      return;
    }

    try {
      setIsLoading(true);
      await addNewResource(e, access_token, payload);
      announceLiveRegion.current = true;
      closeModalAndNavigate();
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    }
  };

  const inputs = type === 'link' ? linkInputs : topicInputs;

  const isInputValid = isValidInput.current && !isError;

  return (
    <Transition.Root show={open} as={Fragment}>
      <div
        aria-modal='true'
        role='dialog'
        aria-labelledby={`${type}-dialog-title`}
      >
        <Dialog
          as='div'
          className='fixed z-10 inset-0 overflow-y-auto'
          onClose={setOpen}
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
              as={Fragment}
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
              as={Fragment}
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
                          as='h3'
                          className='text-lg leading-6 font-medium text-gray-900 ms-4 self-center'
                        >
                          {type === 'topic'
                            ? 'Insert a new topic'
                            : 'Add new article/resource'}
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
                      <div className='flex flex-wrap'>
                        {type === 'link' &&
                          newLink.tags?.map((tag: string, i: number) => (
                            <FormTag
                              tag={tag}
                              key={tag + i}
                              onClick={handleRemoveTag}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse flex justify-between'>
                  {session && (
                    <>
                      <button
                        aria-labelledby='add-button'
                        type='button'
                        className='w-full inline-flex rounded-md border border-transparent shadow-sm px-4 py-2 bg-secondary-200 text-base font-medium text-white hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm'
                        onClick={(e) =>
                          type === 'topic'
                            ? handleSubmitForm(e, newTopic)
                            : handleSubmitForm(e, newLink)
                        }
                      >
                        +
                      </button>
                      <span id='add-button' className='sr-only'>
                        Click to create new {type}
                      </span>
                    </>
                  )}
                  {isLoading && (
                    <span className='flex h-5 w-5 self-center'>
                      <span className='relative motion-safe:animate-spin h-5 w-5 bg-sky-500 '></span>
                      <div aria-live='assertive' role='alert'>
                        <p>Submitting form...</p>
                      </div>
                    </span>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </div>
    </Transition.Root>
  );
};
