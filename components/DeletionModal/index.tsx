import React from 'react';

import { Modal } from '@components/Modal';

type DeletionPopupProps = {
  open: boolean;
  handleOpenModal: (open: boolean) => void;
  handleDeleteLink: () => void;
};

export const DeletionModal = ({
  open,
  handleOpenModal,
  handleDeleteLink,
}: DeletionPopupProps) => (
  <Modal
    open={open}
    handleOpenModal={handleOpenModal}
    title='Are you sure you want to delete this link?'
  >
    <div className='bg-gray-50 px-4 py-3 flex sm:px-6 justify-center gap-9'>
      <button
        type='button'
        onClick={() => handleOpenModal(false)}
        className='w-20 rounded shadow-sm px-4 py-2 border-2 border-secondary-200 font-medium text-xl hover:bg-secondary-200 focus:outline-primary-neon'
      >
        No
      </button>
      <button
        type='button'
        onClick={handleDeleteLink}
        className='w-20 rounded shadow-sm px-4 py-2 border-2 border-secondary-200 bg-secondary-200 font-medium text-xl hover:bg-transparent focus:outline-primary-neon'
      >
        Yes
      </button>
    </div>
  </Modal>
);
