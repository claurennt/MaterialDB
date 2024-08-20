import Head from 'next/head';
import { useSearchParams } from 'next/navigation';

import React from 'react';

export const Layout = ({ children }) => {
  const name = useSearchParams().get('name');

  return (
    <>
      <Head>
        <title>{name ? name : null} | MaterialDB</title>
        <link rel='icon' href='/logo.ico' />
      </Head>
      <>{children}</>
    </>
  );
};
