'use client';
import React, { forwardRef } from 'react';

type RemovableTagProps = {
  tag: string;
  onRemoveTag: () => void;
  id: string;
};

export const RemovableTag = forwardRef<HTMLButtonElement, RemovableTagProps>(
  ({ tag, onRemoveTag, id }, ref) => {
    return (
      <li className='list-none'>
        <div
          className='
            group relative inline-flex items-center gap-2 p-1 rounded 
            border border-indigo-700 bg-indigo-600 text-[10px] font-bold text-white shadow-sm 
            transition-colors hover:bg-secondary-100 hover:text-background
            focus-within:bg-secondary-100 focus-within:text-background
          '
        >
          <span className='pl-1 uppercase tracking-tight'>{tag}</span>

          <button
            ref={ref}
            type='button'
            onClick={onRemoveTag}
            aria-label={tag}
            aria-describedby={id}
            className='
              flex h-4 w-4 shrink-0 items-center justify-center rounded-full 
              bg-white text-[10px] font-black text-indigo-700 border border-transparent
              hover:bg-red-700 hover:text-white 
              focus:bg-red-700 focus:text-white
              /* The Magic Hitbox: expands the button click area to the whole div */
              after:absolute after:inset-0 after:rounded-inherit 
              focus-visible:outline-none transition-all
            '
          >
            ✕
          </button>
        </div>

        {/* Screen reader helper */}
        <span className='sr-only' id={id}>
          Remove tag
        </span>
      </li>
    );
  },
);

RemovableTag.displayName = 'RemovableTag';
