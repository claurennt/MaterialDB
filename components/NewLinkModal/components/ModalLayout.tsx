import { Dialog, Transition } from '@headlessui/react';
import { NewLinkModalType } from '@types';
import { useRef } from 'react';
import { ClipLoader } from 'react-spinners';
import { ToastContainer } from 'react-toastify';

export const ModalHeader: React.FunctionComponent<{
  type: NewLinkModalType;
}> = ({ type }) => {
  const title =
    type === 'topic' ? 'Insert a new topic' : 'Add new article/resource';

  return (
    <div className='flex mb-4'>
      <div
        role='presentation'
        className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-secondary-200 sm:mx-0 sm:h-10 sm:w-10'
      ></div>
      <Dialog.Title
        id={`${type}-dialog-title`}
        as='h1'
        className='text-lg leading-6 font-medium text-gray-900 ms-4 self-center'
      >
        {title}
      </Dialog.Title>
    </div>
  );
};

type ModalContainerProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  children: React.ReactNode;
  type: NewLinkModalType;
};

export const ModalContainer: React.FunctionComponent<ModalContainerProps> = ({
  open,
  setOpen,
  children,
  type,
}) => {
  const toastId = useRef(null);
  return (
    <Transition.Root show={open} as={'div'}>
      <div
        aria-modal='true'
        role='dialog'
        aria-labelledby={`${type}-dialog-title`}
      >
        <Dialog
          as='div'
          className='fixed z-10 inset-0 overflow-y-auto '
          onClose={setOpen}
          open={open}
        >
          {' '}
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
              <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-4/5 md:w-3/5 lg:w-2/5'>
                <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                  <div className='flex'>
                    <div className='flex flex-col text-center sm:text-left w-full mt-2 ml-4'>
                      {children}
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

export const ModalBody: React.FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => (
  <div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
    <div className='flex'>
      <div className='flex flex-col text-center sm:text-left w-full mt-2 ml-4'>
        {children}
      </div>
    </div>
  </div>
);

type ModalFooterProps = {
  children: React.ReactNode;
  isLoading: boolean;
};

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  isLoading,
}) => (
  <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse flex justify-between'>
    {children}
    {isLoading && (
      <div className='sm:flex sm:flex-row-reverse flex justify-center'>
        <ClipLoader loading={true} />
      </div>
    )}
  </div>
);
