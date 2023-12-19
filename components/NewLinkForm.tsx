/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { Dialog, Transition } from '@headlessui/react';

import FormInputs from './FormInputs';
import type { AddNewFunction, NewLink, NewTopic } from 'types/components';
import { ILink, ITopic } from 'types/mongoose';

type NewLinkFormProps = {
  individualTopicId?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTopicLinks?: React.Dispatch<React.SetStateAction<ILink[]>>;
  type: string;
  open: boolean;
  newData?: ITopic[];
};

const NewLinkForm: React.FunctionComponent<NewLinkFormProps> = ({
  individualTopicId,
  setOpen,
  setTopicLinks,
  type,
  open,
  newData,
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

  const { data: session, update } = useSession();

  const handleChangeNewTopic = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewTopic((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleChangeNewLink = (e: React.ChangeEvent<HTMLInputElement>) =>
    setNewLink((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const addNewTopic: AddNewFunction = async (e) => {
    e.preventDefault();

    await axios.post('/api/topics', {
      newTopic,
      creatorId: session.user.id,
    });

    setOpen(false);
    /* triggers a session update in the nextauth callback,
     this session change will then trigger a state update in the useEffect in the Home component */
    update();
  };

  const addNewLink: AddNewFunction = async (e) => {
    e.preventDefault();

    const { data } = await axios.put(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/api/topics/${individualTopicId}`,
      { newLink }
    );

    // close the modal and refresh the page to get updated server side props and display new added link
    setTimeout(() => setOpen(false), 500);
    setTopicLinks((prev) => [...prev, data]);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='fixed z-10 inset-0 overflow-y-auto'
        onClose={setOpen}
      >
        <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
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
                <div className='sm:flex sm:items-start'>
                  <div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'></div>
                  <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                    <Dialog.Title
                      as='h3'
                      className='text-lg leading-6 font-medium text-gray-900'
                    >
                      {type === 'topic' ? (
                        <p>Add new article/resource </p>
                      ) : (
                        <p>Insert a new topic </p>
                      )}
                    </Dialog.Title>
                    <div className='col-span-3 sm:col-span-2'>
                      <FormInputs
                        type={type}
                        handleChange={
                          type === 'topic'
                            ? handleChangeNewTopic
                            : handleChangeNewLink
                        }
                        newData={newData}
                      />
                    </div>
                    {/* {categories?.map((category, index) => (
                      <FormSelect
                        {...category}
                        handleChange={
                          type === 'topic'
                            ? handleChangeNewTopic
                            : handleChangeNewLink
                        }
                        key={index}
                      />
                    ))} */}
                  </div>
                </div>
              </div>
              <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
                {session && (
                  <button
                    type='button'
                    className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm'
                    onClick={(e) =>
                      type === 'topic' ? addNewTopic(e) : addNewLink(e)
                    }
                  >
                    +
                  </button>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
export default NewLinkForm;
