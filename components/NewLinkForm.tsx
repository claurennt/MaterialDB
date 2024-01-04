/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Dialog, Transition } from '@headlessui/react';

import ModalInput from './ModalInput';
import type { AddNewFunction, NewTopic, NewLink } from 'types/components';
import { ILink } from 'types/mongoose';
import { categories, topicInputs, linkInputs } from 'utils/client/data';
import Category from './Category';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

type NewLinkFormType = 'topic' | 'link';

type NewLinkFormProps = {
  individualTopicId?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTopicLinks?: React.Dispatch<React.SetStateAction<ILink[]>>;
  type: NewLinkFormType;
  open: boolean;
};

const NewLinkForm: React.FunctionComponent<NewLinkFormProps> = ({
  individualTopicId,
  setOpen,
  type,
  open,
}) => {
  const [newTopic, setNewTopic] = useState<NewTopic>({
    name: '',
    description: '',
  });

  const [newLink, setNewLink] = useState<NewLink>({
    url: '',
    category: '',
    tags: [],
  });

  const [tagValue, setTagValue] = useState<string>('');

  const { data: session } = useSession();

  const router = useRouter();

  const searchParams = useSearchParams();
  const topicName = searchParams.get('name');

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
      if (name === 'category') {
        setNewLink((prev) => ({ ...prev, category: target.value }));
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

  const addNewTopic: AddNewFunction = async (e) => {
    e.preventDefault();

    await axios.post('/api/topics', {
      newTopic,
      creatorId: session.user.id,
    });

    setOpen(false);
    router.replace(router.asPath);
  };

  const addNewLink: AddNewFunction = async (e) => {
    e.preventDefault();

    await axios.put(`/api/topics/${individualTopicId}`, {
      ...newLink,
      _topic: topicName,
    });

    router.replace(router.asPath);
  };

  const inputs = type === 'link' ? linkInputs : topicInputs;

  return (
    <Transition.Root show={open} as={Fragment}>
      <div aria-modal='true' role='dialog'>
        <Dialog
          as='div'
          className='fixed z-10 inset-0 overflow-y-auto'
          onClose={setOpen}
        >
          <div
            className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'
            role='dialog'
          >
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
                            <span
                              key={tag + i}
                              id='tag-dismiss-default'
                              className='px-2 py-1 me-2 mt-1 text-sm font-medium text-tertiary-100 bg-primary-300 rounded'
                            >
                              {tag}
                              <button
                                onClick={() => handleRemoveTag(tag)}
                                type='button'
                                className='inline-flex items-center p-1 ms-2 text-sm text-tertiary-100 bg-transparent rounded-sm hover:bg-blue-200 hover:text-blue-900 dark:hover:bg-blue-800 dark:hover:text-blue-300'
                                data-dismiss-target='#tag-dismiss-default'
                                aria-label='Remove'
                              >
                                <svg
                                  className='w-2 h-2'
                                  aria-hidden='true'
                                  xmlns='http://www.w3.org/2000/svg'
                                  fill='none'
                                  viewBox='0 0 14 14'
                                >
                                  <path
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6'
                                  />
                                </svg>
                                <span className='sr-only'>Remove tag</span>
                              </button>
                            </span>
                          ))}
                      </div>
                      {type === 'link' && (
                        <fieldset>
                          {' '}
                          <legend>Select a category for this resource:</legend>
                          {categories?.map(({ type, color, index }) => (
                            <Category
                              key={color + index}
                              type={type}
                              handleChange={handleChange}
                            />
                          ))}
                        </fieldset>
                      )}
                    </div>
                  </div>
                </div>
                <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                  {session && (
                    <>
                      <button
                        aria-labelledby='add-button'
                        type='button'
                        className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm'
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
  );
};

export default NewLinkForm;
