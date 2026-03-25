import React from 'react';
import { signOut } from 'next-auth/react';
import styles from '../../styles/index.module.css';
import Link from 'next/link';

export const LogoutButton = () => (
  <Link
    className={`absolute top-4 right-2 text-md ${styles.auth_nav_link}`}
    href='/'
    onClick={(e) => {
      e.preventDefault();

      // redirect without page reload
      signOut({ redirect: true, callbackUrl: '/' });
    }}
  >
    Logout
  </Link>
);
