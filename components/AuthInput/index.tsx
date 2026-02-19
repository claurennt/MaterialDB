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
                className='font-semibold text-secondary-100 underline underline-offset-2 focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-primary-100 '
              >
                Forgot password?
              </Link>
            </div>
          ) : null}
        </div>

        <div className='mt-2'>
          <input
            onChange={handleChange}
            ref={ref}
            id={type}
            name={type}
            type={type === 'username' ? 'text' : type}
            aria-required
            aria-invalid={isError}
            className={`block w-full rounded-md border-0 py-1.5 focus:outline-none focus:ring-1 focus:ring-black focus:shadow-[0_8px_0_0_#4FC06D] pb-3 text-gray-900 shadow-sm ring-1 sm:text-sm sm:leading-6'
            }`}
          />
        </div>
      </div>
    );
  },
);
