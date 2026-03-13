'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

export const SessionContext = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) => <SessionProvider session={session}>{children}</SessionProvider>;
