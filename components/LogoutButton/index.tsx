import React from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export const LogoutButton = () => {
  const router = useRouter();

  return (
    <button
      className='self-center bg-primary-neon p-1 text-sm hover:bg-secondary-100 ease-linear duration-300 active:scale-75 text-white font-bold px-4 rounded-tl rounded-br absolute right-2 top-4'
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
