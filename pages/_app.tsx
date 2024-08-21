import React, { useState } from 'react';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import 'styles/global.css';
import { Layout } from 'components/Layout';

interface IAppProps extends AppProps {
  pageProps: { session: Session };
}
const App: React.FunctionComponent<IAppProps> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Layout>
      <SessionProvider session={session} basePath='/api/auth'>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </SessionProvider>
    </Layout>
  );
};

export default App;
