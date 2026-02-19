import React from 'react';

type AddNewButtonProps = {
  text: string;
  setOpen: (open: boolean) => void;
};

export const AddNewButton: React.FunctionComponent<AddNewButtonProps> = ({
  text,
  setOpen,
}) => {
  const buttonText = `Add new ${text}`;
  const handleClick = () => setTimeout(() => setOpen(true), 500);
  const uniqueId = `new-${text}`;
  return (
    <>
      <button
        aria-describedby={uniqueId}
        className={`h-10  hover:bg-secondary-100 p-1 text-xl bg-primary-neon text-white focus:outline focus:outline-2 focus:outline-secondary-100 focus:outline-offset-4 ease-linear duration-300 active:scale-75 hover:text-primary-neon font-bold px-4 rounded-tl rounded-br ${
          text === 'link' ? 'w-3/5 md:w-2/5 md:self-end' : ''
        }`}
        onClick={handleClick}
      >
        {buttonText}
      </button>
      <span className='sr-only' id={uniqueId}>
        Opens modal
      </span>
    </>
  );
};
