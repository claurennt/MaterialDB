import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import styles from '../../styles/index.module.css';

type InvokerProps = {
  commandfor: string;
  command: 'show-modal' | 'close';
  children: React.ReactNode;
  ariaLabel?: string;
  className: string;

  onClick?: (e: React.SyntheticEvent<HTMLButtonElement>) => Promise<void>;
  onBlur?: (e: React.FocusEvent<HTMLButtonElement>) => void;
};

export const InvokerButton = forwardRef<HTMLButtonElement, InvokerProps>(
  (
    { commandfor, command, ariaLabel, children, onClick, onBlur, className },
    ref,
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    // useImperativeHandle(ref, () => internalRef.current!);
    // console.log('alllll', ariaLabel, command, commandfor);
    const handleFallback = () => {
      const supportsInvokers =
        'commandForElement' in HTMLButtonElement.prototype;

      if (!supportsInvokers) {
        console.log('here');
        // onClick?.(false);
      }
    };

    // console.log('Invoker----', command, commandfor, ariaLabel);
    // : undefined;
    return (
      <button
        className={className}
        ref={internalRef}
        aria-label={ariaLabel}
        command={command}
        commandfor={commandfor}
        onClick={onClick}
        onBlur={onBlur}
      >
        {children}
      </button>
    );
  },
);

InvokerButton.displayName = 'InvokerButton';
