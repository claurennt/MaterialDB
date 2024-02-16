import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { LogoutButton } from '..';

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  const { data: session } = useSession();
  const { pathname } = useRouter();

  return (
    <>
      {session && pathname.includes('auth') && <LogoutButton />}
      <main>{children}</main>
    </>
  );
};
