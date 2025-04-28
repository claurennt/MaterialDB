import React from 'react';

type AddNewButtonProps = {
  text: string;
  setOpen: (open: boolean) => void;
};

export const AddNewButton: React.FunctionComponent<AddNewButtonProps> = ({
  text,
  setOpen,
}) => {
  const srOnlyText = 'Opens modal';
  return (
    <>
      <button
        aria-describedby={`new-${text}`}
        className={`h-10  hover:bg-secondary-100 p-1 text-xl bg-primary-neon text-white focus:outline-secondary-100 focus:outline-2 ease-linear duration-300 active:scale-75 hover:text-primary-neon font-bold px-4 rounded-tl rounded-br ${
          text === 'link' ? 'w-3/5 md:w-2/5 md:self-end' : ''
        }`}
        onClick={() => setTimeout(() => setOpen(true), 500)}
      >
        Add new {text}
      </button>
      <span className='sr-only' id={`new-${text}`}>
        {srOnlyText}
      </span>
    </>
  );
};
