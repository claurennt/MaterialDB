import React from 'react';

import { EventTarget } from 'types/components';

import { signOut } from 'next-auth/react';

const LogoutButton = () => (
  <button
    className='bg-blue-500 hover:bg-blue-700 text-white font-bold  px-4 rounded-full m-5 absolute right-0 top-0'
    onClick={(e: EventTarget) => {
      e.preventDefault();
      // the redirect:false option deletes the session without reloading the page
      signOut({ redirect: false });
    }}
  >
    Logout
  </button>
);

export default LogoutButton;
