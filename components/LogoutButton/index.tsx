import React from 'react';
import { signOut } from 'next-auth/react';
import styles from '../../styles/index.module.css';
export const LogoutButton = () => (
  <a
    tabIndex={0}
    className={`absolute top-4 right-2 text-md ${styles.auth_nav_link}`}
    onClick={(e) => {
      e.preventDefault();

      // redirect without page reload
      signOut({ redirect: true, callbackUrl: '/' });
    }}
  >
    Logout
  </a>
);
