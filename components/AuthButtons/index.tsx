import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from 'pages/index.module.css';

export const AuthButtons = () => {
  const { authLink } = styles;

  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  return (
    <div
      className={`${
        userId
          ? 'absolute top-5 right-10 space-x-5'
          : 'flex items-center h-5 pt-5 space-x-4'
      }`}
    >
      <Link href='/auth/register' className={authLink}>
        Register
      </Link>
      <Link href='/auth/login' className={authLink}>
        Login
      </Link>
    </div>
  );
};
