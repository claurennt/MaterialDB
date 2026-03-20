import React, { forwardRef } from 'react';

type ErrorMessageProps = {
  message: string;
  isError: boolean;
};

// eslint-disable-next-line react/display-name
export const AuthFeedback = forwardRef<HTMLDivElement, ErrorMessageProps>(
  ({ isError, message }, ref) => (
    // using visibility + opacity for spacing and aria-hidden hidden when there's no message so screen readers do not announce an empty div
    <div
      className={`w-full mb-4 transition-opacity duration-300  ${
        message ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
      aria-hidden={!!message}
    >
      <div className='relative overflow-hidden rounded-lg border border-red-500/50 bg-red-500/10 p-2 backdrop-blur-sm'>
        <div
          data-testid='auth-feedback-group'
          className='rounded flex items-center gap-3'
          ref={ref}
          tabIndex={-1}
          role='group'
          aria-labelledby={`auth-svg-title-${isError ? 'error' : 'success'} auth-message`}
        >
          <div className='flex-shrink-0'>
            {isError ? (
              <svg
                className='h-8 w-8 text-red-400'
                fill='currentColor'
                viewBox='0 0 20 20'
                aria-hidden
              >
                <title id='auth-svg-title-error'>Something went wrong. </title>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z'
                  clipRule='evenodd'
                />
              </svg>
            ) : (
              <svg
                className='h-8 w-8 text-green-500'
                fill='currentColor'
                viewBox='0 0 20 20'
                aria-hidden
              >
                <title id='auth-svg-title-success'>Success! </title>
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4.126-5.68z'
                  clipRule='evenodd'
                />
              </svg>
            )}
          </div>
          <div>
            <p className='text-sm leading-relaxed' id='auth-message'>
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
);
