import React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { LogoutButton, AuthLinks } from '@components';
import styles from '../../styles/index.module.css';
export const Header = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const userId = searchParams.get('userId');

  return (
    <header>
      {pathname !== '/' && (
        <Link
          className={`${styles.auth_nav_link} text-md absolute top-4 ${session ? 'right-20' : 'left-2'}`}
          href={{
            pathname: '/',
            query: userId ? { userId } : '',
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
