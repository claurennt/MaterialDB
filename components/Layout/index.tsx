import React from 'react';
import { useSession } from 'next-auth/react';
import { LogoutButton } from '..';
type LayoutProps = {
  children: React.ReactNode;
};

export const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
  const { data: session } = useSession();

  return (
    <>
      {session && <LogoutButton />}
      <main>{children}</main>
    </>
  );
};
