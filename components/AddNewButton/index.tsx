import React from 'react';

type AddNewButtonProps = {
  text: string;
  handleOpenModal: (open: boolean) => void;
};

export const AddNewButton = ({
  text,
  handleOpenModal,
}: AddNewButtonProps): JSX.Element => {
  const buttonText = `Add new ${text}`;

  return (
    <button
      className={`hover:border-secondary-100 p-1 text-l border border-fuchsia-300 hover:text-fuchsia-300 rounded-md px-2 ${
        text === 'link' ? 'w-3/5 md:w-2/5 md:self-end' : ''
      }`}
      onClick={() => handleOpenModal(true)}
    >
      {buttonText}
    </button>
  );
};
