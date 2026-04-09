import React from 'react';

import { Modal } from '@components/Modal';
import { InvokerButton } from '@components/InvokerButton';
import styles from '../../styles/index.module.css';

type DeletionPopupProps = {
  open: boolean;
  title: string;
  uniqueDialogId: string;
  handleOpenModal: (open: boolean) => void;
  handleDelete: () => void;
};

export const DeletionModal = ({
  title,
  handleDelete,
  uniqueDialogId,
}: DeletionPopupProps) => (
  <Modal title={title} uniqueDialogId={uniqueDialogId}>
    <div className='bg-gray-50 px-4 py-3 flex sm:px-6 justify-center gap-9'>
      <InvokerButton
        command='close'
        commandfor={uniqueDialogId}
        className={styles.invoker_button_cancel_deletion}
      >
        No
      </InvokerButton>
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
