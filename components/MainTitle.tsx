import React from 'react';
import { useSession } from 'next-auth/react';

const MainTitle = () => {
  const { data: session } = useSession();

  return (
    <>
      {session?.user ? (
        <h1 className='font-sans text-5xl'>
          Welcome back to your{' '}
          <span className='text-primary-100 m-0 p-0'>MaterialDB</span>{' '}
          {session.user.name}!
        </h1>
      ) : (
        <h1 className='font-sans text-5xl'>
          Welcome to <span className='text-primary-100'>MaterialDB!</span>
        </h1>
      )}
    </>
  );
};

export default MainTitle;
