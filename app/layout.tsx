// import './global.css';
import Providers from './providers';
import '../styles/global.css';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/authOptions';
import { Layout } from '@components';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang='en'>
      <body>
        <Providers session={session}>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
