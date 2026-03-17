import React, { forwardRef } from 'react';

type DialogButtonProps = {
  ariaLabel: string;
  text: string;
  onClick?: (value: any) => void | Promise<void>;
};

export const DialogButton = forwardRef<HTMLButtonElement, DialogButtonProps>(
  (props, ref) => {
    const { onClick, ariaLabel, text } = props;
    return (
      <button
        ref={ref}
        type='submit'
        className='w-10 h-10 flex items-center rounded justify-center border-2 border-secondary-200 shadow-sm text-xl hover:bg-secondary-200 focus:outline-primary-neon transition-colors'
        onClick={() => onClick?.(false)}
        aria-label={ariaLabel}
      >
        {text}
      </button>
    );
  },
);

DialogButton.displayName = 'DialogButton';
