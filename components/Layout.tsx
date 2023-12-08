import React from 'react';
import LogoutButton from './LogoutButton';
import { useSession } from 'next-auth/react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  const { data: session } = useSession();
  return (
    <>
      {session && <LogoutButton />}
      <main>{children}</main>
    </>
  );
};
