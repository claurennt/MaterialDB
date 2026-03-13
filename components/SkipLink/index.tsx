import React from 'react';

export const SkipLink = ({
  anchorId,
  show,
  type,
}: {
  anchorId: string;
  show: boolean;
  type: string;
}) => {
  const text = `Skip to new ${type}`;
  return (
    <a
      // disable link via undefined href
      href={anchorId ? `#${anchorId}` : undefined}
      className={`absolute top-12 w-max text-md decoration-2 underline-offset-2 text-pink-300 decoration-primary-100 underline ${show ? 'focus:opacity-100 opacity-0' : 'opacity-0'}`}
    >
      {anchorId ? text : null}
    </a>
  );
};
