import React from 'react';

import { EventTarget } from 'types/components';

import { signOut } from 'next-auth/react';

const LogoutButton = () => (
  <button
    className='bg-primary-100  text-sm hover:bg-blue-700 text-white hover:bg-primary-neon focus:bg-primary-neon font-bold py-1 px-2 rounded-full m-5 absolute right-0 top-0'
    onClick={async (e: EventTarget) => {
      e.preventDefault();
      // the redirect:false option deletes the session without reloading the page
      await signOut({ redirect: false });
    }}
  >
    Logout
  </button>
);

export default LogoutButton;
