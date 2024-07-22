/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useRef, useState } from 'react';

import { useSession } from 'next-auth/react';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ModalInput } from '../ModalInput';
import type { NewTopic, NewLink } from 'types/components';
import { topicInputs, linkInputs, addNewResource } from 'utils/client';

type NewLinkFormType = 'topic' | 'link';

type NewLinkFormProps = {
  individualTopicId?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: NewLinkFormType;
  open: boolean;
};

export const NewLinkForm: React.FunctionComponent<NewLinkFormProps> = ({
  individualTopicId,
  setOpen,
  type,
  open,
}) => {
  const toastId = useRef(null);

  const [newTopic, setNewTopic] = useState<NewTopic>({
    name: '',
    description: '',
  });

  const [newLink, setNewLink] = useState<NewLink>({
    url: '',
    tags: [],
  });

  const [tagValue, setTagValue] = useState<string>('');

  const [liveRegionContent, setLiveRegionContent] = useState<
    string | undefined
  >();
  const { data: session } = useSession();

  const {
    user: { access_token },
  } = session;

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string
  ) => {
    const target = e.target as HTMLInputElement;

    //handleChange for newLink modal
    if (type === 'link') {
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

  const addNewTopic = async (e: React.MouseEvent) => {
    e.preventDefault();
    const payload = { ...newTopic, creatorId: session.user.id };
    try {
      await addNewResource(e, access_token, payload);
      setLiveRegionContent('New topic successfully added.');
      closeModalAndNavigate();
    } catch (e) {
      setLiveRegionContent('Something went wrong. Please try again.');
    }
  };

  const addNewLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    const payload = { ...newLink, _topic: individualTopicId };

    try {
      await addNewResource(e, access_token, payload);
      setLiveRegionContent('New link successfully added.');
      closeModalAndNavigate();
    } catch (e) {
      setLiveRegionContent('Something went wrong. Please try again.');
    }
  };

  const inputs = type === 'link' ? linkInputs : topicInputs;

  return (
    <>
      <div aria-live='assertive' role='alert'>
        <p>{liveRegionContent}</p>
      </div>
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
                      <div className=' text-center sm:text-left w-full mt-2 ml-4'>
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
                        {inputs.map(({ name, placeholder }) => (
                          <ModalInput
                            value={name === 'tags' ? tagValue : undefined}
                            name={name}
                            key={name}
                            placeholder={placeholder}
                            handleChange={handleChange}
                            handleKeyDown={handleKeyDown}
                          />
                        ))}
                        <div className='flex flex-wrap'>
                          {type === 'link' &&
                            newLink.tags?.map((tag: string, i: number) => (
                              <button
                                key={tag + i}
                                onClick={() => handleRemoveTag(tag)}
                                type='button'
                                className='inline-flex items-center py-1 m-0 text-sm text-tertiary-100 bg-transparent rounded-sm'
                                data-dismiss-target='#tag-dismiss-default'
                                aria-labelledby={`remove-tag-${tag}${i}`}
                              >
                                {' '}
                                <span
                                  key={tag + i}
                                  id='tag-dismiss-default'
                                  className='px-2 py-1 me-2 mt-1 text-sm font-medium text-tertiary-100 bg-primary-300 rounded hover:bg-secondary-300'
                                >
                                  {tag} x
                                </span>
                                <span
                                  className='sr-only'
                                  id={`remove-tag-${tag}${i}`}
                                >
                                  Remove tag {tag} from list
                                </span>
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                    {session && (
                      <>
                        <button
                          aria-labelledby='add-button'
                          type='button'
                          className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-secondary-200 text-base font-medium text-white hover:bg-secondary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm'
                          onClick={(e) =>
                            type === 'topic' ? addNewTopic(e) : addNewLink(e)
                          }
                        >
                          +
                        </button>
                        <span id='add-button'>Click to create new {type}</span>
                      </>
                    )}
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </div>
      </Transition.Root>
    </>
  );
};
