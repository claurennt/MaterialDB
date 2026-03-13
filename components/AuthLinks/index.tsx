import React from 'react';
import Link from 'next/link';

import { useSearchParams } from 'next/navigation';
import styles from '../../styles/index.module.css';
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
      <Link href='/auth/register' className={`text-md ${styles.auth_nav_link}`}>
        Register
      </Link>
      <Link href='/auth/login' className={`text-md ${styles.auth_nav_link}`}>
        Login
      </Link>
    </div>
  );
};
