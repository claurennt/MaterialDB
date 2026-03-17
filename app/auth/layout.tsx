'use client';
import Image from 'next/image';
import { useSelectedLayoutSegment } from 'next/navigation';
import logo from '../../public/logo.png';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const segment = useSelectedLayoutSegment();
  const heading = segment === 'register' ? 'Create account' : 'Sign in';
  return (
    <main className='flex flex-col justify-center px-3 py-12 min-h-screen max-w-sm mx-auto'>
      <div className='text-center mb-4'>
        <Image
          src={logo}
          alt='Logo'
          width={40}
          height={40}
          className='mx-auto'
        />
        <h1 className='mt-8 text-2xl font-bold tracking-tight'>{heading}</h1>
      </div>
      {children}
    </main>
  );
};

export default AuthLayout;
