import Link from 'next/link';

import { MainTitle } from '@components/MainTitle';
import styles from '../../styles/index.module.css';
interface PageProps {
  result: {
    success: boolean;
    message: string;
  };
}

export const View = ({ result }: PageProps) => (
  <main className='flex flex-col items-center gap-y-10 text-center p-10 lg:pt-20 lg:px-10 min-h-screen'>
    <MainTitle />
    {result.success ? (
      <>
        <p className='text-gray-600 mb-8'>{result.message}</p>
        <Link href='/login' className={`text-md ${styles.auth_nav_link}`}>
          Go to Login
        </Link>
      </>
    ) : (
      <p className='text-red-600'>Error: {result.message}</p>
    )}
  </main>
);
