import Head from 'next/head';
import { useSearchParams } from 'next/navigation';

import React from 'react';

export const Layout = ({ children }) => {
  const name = useSearchParams().get('name');
  const title = `${name ? name + ' | ' : ''}MaterialDB`;
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
