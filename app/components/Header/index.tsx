import '../../../styles/global.css';

import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { LogoutButton, AuthLinks } from '@components';

export const Header = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // Get userId from search params
  const userId = searchParams.get('userId');

  return (
    <header>
      {pathname !== '/' && (
        <Link
          className={`self-center text-primary-300 p-1 text-lg hover:text-secondary-300 ease-linear duration-300 active:scale-75 font-bold px-5 absolute top-3 ${
            session ? 'right-24' : 'left-2'
          }`}
          href={{
            pathname: '/route?[userId]',
            query: { userId },
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
