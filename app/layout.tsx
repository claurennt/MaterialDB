import React from 'react';

import { getServerSession } from 'next-auth';
import { Jost } from 'next/font/google';
import { authOptions } from './api/auth/[...nextauth]/authOptions';
import '../styles/global.css';
import { SessionContext } from './SessionProvider';

const jost = Jost({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: { default: 'Homepage - MaterialDB' },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang='en'>
      <body className={`${jost.variable} font-sans`}>
        <SessionContext session={session}>
          <>{children}</>
        </SessionContext>
      </body>
    </html>
  );
}
