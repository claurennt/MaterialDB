import React from 'react';

type FormTag = {
  tag: string;
  index: number;
  onClick: (tag: string) => void;
};

export const FormTag: React.FunctionComponent<FormTag> = ({
  tag,
  index,
  onClick,
}) => {
  const key = tag + index;
  return (
    <button
      key={key}
      onClick={() => onClick(tag)}
      type='button'
      className='items-center my-2 text-sm text-tertiary-100 bg-transparent rounded-sm  focus-visible:ring-2 ring-offset-2 ring-primary-300'
      data-dismiss-target='#tag-dismiss-default'
      aria-labelledby={`remove-tag-${key}`}
    >
      {' '}
      <span
        id='tag-dismiss-default'
        className='px-2 py-1 text-sm font-medium text-tertiary-100 bg-primary-300 rounded hover:bg-secondary-300 focus-visible:outline-none focus:outline-none'
      >
        {tag} x
      </span>
      <span className='sr-only' id={`remove-tag-${key}`}>
        Remove tag {tag} from list
      </span>
    </button>
  );
};
