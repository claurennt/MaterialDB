import React from 'react';
import Link from 'next/link';

import styles from '/pages/index.module.css';

const AuthButtons = () => {
  const { authLink } = styles;
  return (
    <div className='flex items-center h-5 pt-5 space-x-4'>
      <Link href='/auth/register' className={authLink}>
        Register
      </Link>
      <Link href='/auth/login' className={authLink}>
        Login
      </Link>
    </div>
  );
};

export default AuthButtons;
