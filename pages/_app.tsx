import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { useState } from 'react';

import {
  DehydratedState,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import 'styles/global.css';
import { Layout } from 'components/Layout';

// Wrap the Component prop with ErrorBoundary component
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{
  session: Session;
  dehydratedState: DehydratedState;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider session={session}>
      <Layout>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </Layout>
    </SessionProvider>
  );
}
