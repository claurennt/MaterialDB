import { NewLinkModalType } from '@types';

import React from 'react';

type SubmitFormButtonProps = {
  onFormSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type: NewLinkModalType;
};

export const SubmitFormButton: React.FC<SubmitFormButtonProps> = ({
  onFormSubmit,
  type,
}) => {
  const buttonLabel = `Click to create new ${type}`;

  return (
    <div className='flex flex-col items-center'>
      <button
        aria-labelledby='add-button'
        type='button'
        className='w-full inline-flex rounded-md border border-transparent shadow-sm px-4 py-2 bg-secondary-200 text-base font-medium text-white hover:bg-secondary-100 hover:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-100 sm:ml-3 sm:w-auto sm:text-sm'
        onClick={(e) => onFormSubmit(e)}
      >
        +
      </button>
      <span id='add-button' className='sr-only'>
        {buttonLabel}
      </span>
    </div>
  );
};
