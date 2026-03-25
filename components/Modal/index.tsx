'use client';
import { DialogButton } from '@components/DialogButton';
import React, { useEffect, useRef } from 'react';

type ModalProps = {
  open: boolean;
  handleOpenModal: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
};

export const Modal = ({
  open,
  handleOpenModal,
  title,
  children,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className='w-[92vw]           /* Mobile: almost full width with a small gutter */
                sm:w-[80vw]         /* Tablet: slightly narrower */
                md:w-full           /* Desktop: full until it hits max-width */
                max-w-lg'
      onCancel={(e) => {
        e.preventDefault();
        handleOpenModal(false);
      }}
    >
      <div className='flex flex-col'>
        {/* Header */}
        <div className='px-6 py-4 border-b border-slate-200 flex justify-between items-center'>
          <h1 className='text-xl font-semibold'>{title}</h1>

          <DialogButton
            onClick={handleOpenModal}
            ariaLabel='Close dialog'
            text='x'
          />
        </div>

        {/* Body */}
        <div className='p-6 overflow-y-auto'>{children}</div>
      </div>
    </dialog>
  );
};
