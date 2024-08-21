import React from 'react';

export const LiveRegion = ({ liveRegionContent }) => {
  return (
    <span aria-live='polite' role='alert' className='sr-only'>
      {liveRegionContent}
    </span>
  );
};
