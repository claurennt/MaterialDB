import React from 'react';

import { Modal } from '@components/Modal';

type DeletionPopupProps = {
  open: boolean;
  title: string;
  handleOpenModal: (open: boolean) => void;
  handleDelete: () => void;
};

export const DeletionModal = ({
  open,
  title,
  handleOpenModal,
  handleDelete,
}: DeletionPopupProps) => (
  <Modal open={open} handleOpenModal={handleOpenModal} title={title}>
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
        onClick={handleDelete}
        className='w-20 rounded shadow-sm px-4 py-2 border-2 border-secondary-200 bg-secondary-200 font-medium text-xl hover:bg-transparent focus:outline-primary-neon'
      >
        Yes
      </button>
    </div>
  </Modal>
);
