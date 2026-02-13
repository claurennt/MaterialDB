'use client';

import React, { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Session } from 'next-auth';

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider session={session} basePath='/api/auth'>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </SessionProvider>
  );
}
