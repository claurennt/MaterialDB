import React, { useCallback } from 'react';

import { EventTarget } from 'types/components';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const LogoutButton = () => {
  //const router = useRouter();
  return (
    <button
      className='bg-blue-500 hover:bg-blue-700 text-white font-bold  px-4 rounded-full m-5'
      onClick={(e: EventTarget) => {
        e.preventDefault();
        // the redirect:false option deletes the session without reloading the page
        signOut({ redirect: false });
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
