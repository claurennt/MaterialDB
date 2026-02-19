import Head from 'next/head';
import { useSearchParams, usePathname } from 'next/navigation';

import React from 'react';

export const Layout = ({ children }) => {
  const searchParams = useSearchParams();
  const name = searchParams.get('name');

  const path = usePathname().split('/');
  const pathTitle = path[path.length - 1];

  const title = `${name || pathTitle || 'Homepage'} - MaterialDB`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel='icon' href='/logo.ico' />
      </Head>
      <>{children}</>
    </>
  );
};
