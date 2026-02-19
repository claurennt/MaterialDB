import React from 'react';
import { signOut } from 'next-auth/react';

export const LogoutButton = () => (
  <button
    className='self-center bg-primary-neon p-1 text-sm hover:bg-secondary-100 ease-linear duration-300 active:scale-75 text-white font-bold px-4 rounded-tl rounded-br absolute right-2 top-4  hover:text-primary-neon focus:outline-secondary-100 focus:outline-2 hover-focus:outline-primary-neon'
    onClick={(e) => {
      e.preventDefault();

      // redirect without page reload
      signOut({ redirect: true, callbackUrl: '/' });
    }}
  >
    Logout
  </button>
);
