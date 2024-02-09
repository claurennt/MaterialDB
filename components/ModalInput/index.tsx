import React from 'react';

type ModalInputsProps = {
  handleKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  name: string;
  placeholder: string;
  value?: string;
};

export const ModalInput: React.FunctionComponent<ModalInputsProps> = ({
  placeholder,
  name,
  handleKeyDown,
  handleChange,
  value,
}) => (
  <>
    {' '}
    <div key={placeholder} className='mt-2 flex rounded-md shadow-sm'>
      <label
        className='inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm'
        aria-hidden
        htmlFor={name}
      >
        {name}
      </label>
      <input
        value={value}
        onKeyDown={name === 'tags' ? handleKeyDown : null}
        onChange={(e) => handleChange(e, name)}
        type='text'
        name={name}
        id={name}
        className=' text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 text-red'
        placeholder={placeholder}
        aria-labelledby={name === 'tags' ? 'tags-explanation' : undefined}
      />
    </div>
    {name === 'tags' ? (
      <span className='text-primary-100 text-sm' id='tags-explanation'>
        Type in your tag and press enter to save
      </span>
    ) : undefined}
  </>
);
