'use client';
import { InvokerButton } from '@components/InvokerButton';
import React, { useEffect, useRef } from 'react';
import styles from '../../styles/index.module.css';

type ModalProps = {
  //open: boolean;
  // needed in case Invoker Commands is not supported
  // handleOpenModal: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  uniqueDialogId: string;
};

export const Modal = ({
  // handleOpenModal,
  title,
  children,
  uniqueDialogId,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // console.log('insid modal', uniqueDialogId);
  return (
    <dialog
      id={uniqueDialogId}
      className='w-[92vw]           /* Mobile: almost full width with a small gutter */
                sm:w-[80vw]         /* Tablet: slightly narrower */
                md:w-full           /* Desktop: full until it hits max-width */
                max-w-lg'
    >
      <div className='flex flex-col'>
        {/* Header */}
        <div className='px-6 py-4 border-b border-slate-200 flex justify-between items-center'>
          <h1 className='text-xl font-semibold'>{title}</h1>

          <InvokerButton
            commandfor={uniqueDialogId}
            command='close'
            ariaLabel='Close dialog'
            className={styles.invoker_button_close}
          >
            x
          </InvokerButton>
        </div>

        {/* Body */}
        <div className='p-6 overflow-y-auto'>{children}</div>
      </div>
    </dialog>
  );
};
