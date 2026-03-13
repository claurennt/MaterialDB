import { useSearchParams } from 'next/navigation';
import React from 'react';

type SubtitleProps = {
  totalCount: number;
  isOwner: boolean;
  isAuthenticated: boolean;
};

export const Subtitle = ({
  totalCount,
  isOwner,
  isAuthenticated,
}: SubtitleProps) => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  //  Public Landing Page (No Auth, No specific Profile being viewed)
  if (!isAuthenticated && !userId) {
    return (
      <div className='space-y-2'>
        <h2 className='text-3xl'>
          MaterialDB helps you become a better{' '}
          <span className='text-primary-100'>developer/instructor</span>
        </h2>
        <h3 className='text-2xl'>
          Register or login to create your own topics and share them with your
          students or the world!
        </h3>
      </div>
    );
  }

  const hasTopics = totalCount > 0;

  // If authenticated and looking at own profile
  if (isAuthenticated && isOwner) {
    if (!hasTopics) {
      return (
        <h2 className='text-2xl'>
          You do not have any topics yet! Start adding{' '}
          <span className='text-primary-100'>topics</span>
        </h2>
      );
    }
    return null;
  }

  // If viewing someone else's profile (or viewing own while logged out)
  if (userId && !isOwner) {
    return hasTopics ? (
      <p>
        Pick a <span className='text-primary-100'>topic</span> below!
      </p>
    ) : (
      <p>The user does not have any topics yet.</p>
    );
  }

  return null;
};
