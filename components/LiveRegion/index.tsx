import React from 'react';

// NOTE: live regions should never be conditionally rendered, the content should
export const LiveRegion = ({ liveRegionContent }) => {
  return (
    <span aria-live='polite' className='sr-only'>
      {liveRegionContent}
    </span>
  );
};
