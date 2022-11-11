import React, { useCallback } from 'react';

import { EventTarget } from '@/types/components';

import { signOut } from 'next-auth/react';

const LogoutButton = () => {
  return (
    <button
      className='bg-blue-500 hover:bg-blue-700 text-white font-bold  px-4 rounded-full m-5'
      onClick={(e: EventTarget) => {
        e.preventDefault();
        signOut();
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
