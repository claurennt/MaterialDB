import type { AppProps } from 'next/app';
import '../styles/global.css';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
// Wrap the Component prop with ErrorBoundary component
export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps<{
  session: Session;
}>) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
