import React from 'react';
import Link from 'next/link';

import { useSearchParams } from 'next/navigation';

export const AuthLinks = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  return (
    <div
      className={`${
        userId
          ? 'absolute top-5 right-10 space-x-5'
          : 'flex items-center h-5 p-5 space-x-10 text-2xl'
      }`}
    >
      <Link
        href='/auth/register'
        className='text-secondary-100 underline underline-offset-2 focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-primary-100'
      >
        Register
      </Link>
      <Link
        href='/auth/login'
        className='text-secondary-100 underline underline-offset-2 focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-primary-100'
      >
        Login
      </Link>
    </div>
  );
};
