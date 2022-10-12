import type { AppProps } from 'next/app';
import '../styles/global.css';
import { SessionProvider } from 'next-auth/react';

// Wrap the Component prop with ErrorBoundary component
export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
