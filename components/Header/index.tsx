import React from 'react';
import { AuthLinks, LogoutButton } from '@components';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

// This component could be put into a Layout component, but this does not reset the tab order on route change
export const Header = () => {
  const router = useRouter();
  const {
    pathname,
    query: { userId },
  } = router;
  const { data: session } = useSession();

  return (
    <header>
      {pathname !== '/' && (
        <Link
          className={`self-center text-primary-300 p-1 text-lg hover:text-secondary-300 ease-linear duration-300 active:scale-75 font-bold px-5 absolute top-3 ${
            session ? 'right-24' : 'left-2'
          }`}
          href={{
            pathname: '/',
            query: `${userId ? `userId=${userId}` : ''}`,
          }}
        >
          Home
        </Link>
      )}
      {!pathname.includes('auth') &&
        (session ? <LogoutButton /> : userId ? <AuthLinks /> : null)}
    </header>
  );
};
