import React, { forwardRef } from 'react';

type ModalInputsProps = {
  handleKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
  name: string;
  value?: string;
  isInputValid: boolean;
};

// eslint-disable-next-line react/display-name
export const ModalInput = forwardRef<HTMLInputElement, ModalInputsProps>(
  (props, ref) => {
    const { name, handleKeyDown, handleChange, value, isInputValid } = props;

    const isRequired = name === 'url' || name === 'name';
    const ariaDescribedBy =
      name === 'tags'
        ? 'tags-explanation'
        : isRequired && !isInputValid
        ? 'form-validation-error'
        : undefined;
    const onKeyDown = name === 'tags' ? handleKeyDown : null;

    return (
      <>
        <div className='mt-2 flex flex-wrap rounded-md'>
          <label
            className='w-1/4.5 inline-flex items-center px-3 rounded-l-md border border-primary-neon text-primary-neon bg-secondary-100 text-sm'
            htmlFor={name}
          >
            {name}
            {isRequired && <span aria-hidden='true'>*</span>}
          </label>
          <input
            ref={ref}
            required={isRequired}
            value={value}
            onKeyDown={onKeyDown}
            onChange={(e) => handleChange(e, name)}
            type='text'
            name={name}
            id={name}
            className='text-gray-900 focus:border-primary-neon focus:border flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 border-s-secondary-100'
            aria-describedby={ariaDescribedBy}
            aria-invalid={!isInputValid}
          />
        </div>
        {name === 'tags' ? (
          <span
            className='text-primary-100 text-sm -translate-y-4 xs:-translate-x-4 sm:translate-x-0'
            id='tags-explanation'
          >
            Type in a tag and press enter to save
          </span>
        ) : undefined}
      </>
    );
  }
);
