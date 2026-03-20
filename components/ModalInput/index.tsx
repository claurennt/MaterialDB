import React, { useEffect, useRef } from 'react';

type ModalInputsProps = {
  handleKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
  name: string;
  errorMessage: string | null;
};

export const ModalInput = (props: ModalInputsProps) => {
  const { name, handleKeyDown, errorMessage } = props;
  const requiredInputRef = useRef<HTMLInputElement>(null);
  const isError = !!errorMessage;

  const isRequired = name === 'url' || name === 'name';
  const ariaDescribedBy =
    isError && isRequired
      ? 'form-validation-error'
      : name === 'tags'
        ? 'tags-explanation'
        : undefined;
  const ref = isRequired ? requiredInputRef : null;

  const onKeyDown = name === 'tags' ? handleKeyDown : undefined;

  useEffect(() => {
    if (!isError) return;

    requiredInputRef.current?.focus();
  }, [isError]);

  return (
    <>
      <div className='mt-2 flex flex-col rounded-md text-background'>
        <label
          className='w-1/4.5 inline-flex items-center mb-1 rounded-l-md  text-sm'
          htmlFor={name}
        >
          {name}
          {isRequired && <span aria-hidden='true'>*</span>}
        </label>
        <input
          ref={ref}
          aria-required={isRequired}
          onKeyDown={onKeyDown}
          type='text'
          name={name}
          id={name}
          className='focus:border-primary-neon focus:border-b-4 border-b-4 border-l-indigo-800 focus:border flex-1 block w-full rounded-none rounded-r-md sm:text-sm '
          aria-describedby={ariaDescribedBy}
          aria-invalid={isError}
        />
      </div>
      <div className='relative'>
        <span
          id='form-validation-error'
          className='text-sm absolute -top-2 left-0 text-red-600'
        >
          {isRequired && isError ? (
            <>
              <span aria-hidden>🛑 {''}</span>
              {errorMessage}
            </>
          ) : null}
        </span>
      </div>
      {name === 'tags' ? (
        <span
          className='text-primary-neon text-sm -translate-y-7 xs:-translate-x-4 sm:translate-x-0'
          id='tags-explanation'
        >
          Type in a tag and press enter to save
        </span>
      ) : undefined}
    </>
  );
};
