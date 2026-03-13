import Link from 'next/link';
import React, { forwardRef } from 'react';

type AuthInputProps = {
  type: 'email' | 'password' | 'username';
  handleChange: () => void;
  isError: boolean;
};

// eslint-disable-next-line react/display-name
export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ type, handleChange, isError }, ref) => {
    const isPassword = type.toLowerCase() === 'password';

    return (
      <div className='mb-4'>
        <div className='flex items-center justify-between'>
          <label
            htmlFor={type}
            className='block font-medium leading-6 capitalize'
          >
            {type}
          </label>
          {isPassword ? (
            <div className='text-sm'>
              <Link
                href='#'
                className='text-secondary-100 decoration-primary-200 underline underline-offset-2 hover:decoration-secondary-100 hover:text-pink-300 '
              >
                Forgot password?
              </Link>
            </div>
          ) : null}
        </div>

        <div className='mt-2'>
          <input
            autoComplete={type !== 'password' ? type : undefined}
            onChange={handleChange}
            ref={ref}
            id={type}
            name={type}
            type={type === 'username' ? 'text' : type}
            // using aria-required to avoid default browser validation
            aria-required
            aria-invalid={isError}
            className='border-b-4 border-primary-200 flex-1 block w-full text-background rounded-none rounded-r-md sm:text-sm focus:border-b-4 focus:shadow-[0_4px_0_0_var(--tertiary-color)] focus:ring-0 focus:border-primary-200'
          />
        </div>
      </div>
    );
  },
);
