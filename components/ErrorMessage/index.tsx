import React, { forwardRef } from 'react';

type ErrorMessageProps = {
  error: string | null;
};

// eslint-disable-next-line react/display-name
export const ErrorMessage = forwardRef<HTMLDivElement, ErrorMessageProps>(
  ({ error }, ref) => (
    <div
      className={`w-full mb-4 transition-opacity duration-300  ${
        error ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
      aria-hidden={!error}
    >
      <div className='relative overflow-hidden rounded-lg border border-red-500/50 bg-red-500/10 p-2 backdrop-blur-sm'>
        <div
          className='rounded flex items-center gap-3 focus:outline-secondary-100 focus:outline-2 focus:outline-offset-2 focus:outline'
          ref={ref}
          tabIndex={-1}
          role='group'
          aria-labelledby='error-svg-title error-message'
        >
          <div className='flex-shrink-0'>
            <svg
              className='h-8 w-8 text-red-400'
              fill='currentColor'
              viewBox='0 0 20 20'
              aria-hidden
            >
              <title id='error-svg-title'>Something went wrong.</title>
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div>
            <p className='text-sm leading-relaxed' id='error-message'>
              {error}
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
);
