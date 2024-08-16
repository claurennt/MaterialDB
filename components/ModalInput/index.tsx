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
    const ariaLabelledBy =
      name === 'tags'
        ? 'tags-explanation'
        : isRequired
        ? 'form-validation-error'
        : null;
    const onKeyDown = name === 'tags' ? handleKeyDown : null;

    return (
      <>
        {' '}
        <div className='mt-2 flex flex-wrap rounded-md'>
          <label
            className='w-1/4.5 inline-flex items-center px-3 rounded-l-md border border-r-0 border-secondary-100 bg-gray-50 text-secondary-100 text-sm'
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
            className='text-gray-900 focus:border-primary-neon focus:border-1 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300 border-s-secondary-100'
            aria-labelledby={ariaLabelledBy}
            aria-invalid={!isInputValid}
          />

          {!isInputValid && isRequired && (
            <span
              className='w-full text-rose-600 text-sm mt-1 '
              id='form-validation-error'
            >
              {name === 'name'
                ? 'A name for the topic must be provided'
                : 'Please provide a valid url'}
              !
            </span>
          )}
        </div>
        {name === 'tags' ? (
          <span className='text-primary-100 text-sm' id='tags-explanation'>
            Type in a tag and press enter to save
          </span>
        ) : undefined}
      </>
    );
  }
);
