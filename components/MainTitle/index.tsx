import React from 'react';
import { useSession } from 'next-auth/react';

export const MainTitle = () => {
  const { data: session } = useSession();

  return (
    <h1 className='font-sans text-5xl'>
      Welcome {session?.user ? 'back to your' : 'to'}
      <span className='text-primary-100 m-0 p-0'> MaterialDB</span>
      {session?.user ? `, ${session?.user.name}` : ''}!
    </h1>
  );
};
