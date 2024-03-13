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
          : 'flex items-center h-5 p-5 space-x-4'
      }`}
    >
      <Link
        href='/auth/register'
        className={'text-secondary-100 underline underline-offset-2'}
      >
        Register
      </Link>
      <Link
        href='/auth/login'
        className={'text-secondary-100 underline underline-offset-2'}
      >
        Login
      </Link>
    </div>
  );
};
