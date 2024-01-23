import React from 'react';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const LogoutButton = () => {
  const router = useRouter();

  return (
    <button
      className='bg-primary-100  text-sm hover:bg-blue-700 text-white hover:bg-primary-neon focus:bg-primary-neon font-bold py-1 px-2 rounded-full m-5 absolute right-0 top-0'
      onClick={async (e) => {
        e.preventDefault();

        // redirect without page reload
        const { url } = await signOut({ redirect: false, callbackUrl: '/' });
        router.push(url);
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
