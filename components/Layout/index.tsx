import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { AuthLinks, LogoutButton } from '..';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  const { data: session } = useSession();
  const {
    pathname,
    query: { userId },
  } = useRouter();

  return (
    <>
      <header>
        {!pathname.includes('auth') &&
          (session ? <LogoutButton /> : userId ? <AuthLinks /> : null)}
      </header>
      <>{children}</>
    </>
  );
};
