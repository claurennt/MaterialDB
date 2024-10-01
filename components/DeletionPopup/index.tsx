import React, { Fragment } from 'react';

import { Dialog, Transition } from '@headlessui/react';

type DeletionPopupProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteLink: () => void;
};

export const DeletionPopup = ({
  open,
  setOpen,
  deleteLink,
}: DeletionPopupProps) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <div aria-modal='true' role='dialog' aria-label='confirm link deletion'>
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
                  <div className='flex'>
                    <div className='flex flex-col text-center sm:text-left w-full mt-2 ml-4'>
                      <div className='flex mb-4'>
                        <div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-secondary-200 sm:mx-0 sm:h-10 sm:w-10'></div>
                        <Dialog.Title
                          as='h1'
                          className='text-lg leading-6 font-medium text-gray-900 ms-4 self-center'
                        >
                          Are you sure you want to delete this link?
                        </Dialog.Title>
                      </div>
                      <div className='bg-gray-50 px-4 py-3 flex sm:px-6 justify-center gap-9'>
                        <button
                          type='button'
                          onClick={() => {
                            setOpen(false);
                            deleteLink();
                          }}
                          className='inline-flex w-full justify-center rounded-md bg-tertiary-100 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto'
                        >
                          Yes
                        </button>
                        <button
                          type='button'
                          data-autofocus
                          onClick={() => setOpen(false)}
                          className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto'
                        >
                          No
                        </button>
                      </div>
                    </div>
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
