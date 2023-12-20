import { useSession } from 'next-auth/react';

const MainTitle = () => {
  const { data: session } = useSession();

  return (
    <>
      {session?.user ? (
        <h1 className='font-sans text-5xl md:text-7xl'>
          Welcome back to your{' '}
          <span className='bg-primary-200 text-white m-0 p-0'>MaterialDB</span>{' '}
          {session.user.name}!
        </h1>
      ) : (
        <h1 className='font-sans text-5xl md:text-7xl'>
          Welcome to{' '}
          <span className='bg-primary-200 text-white'> MaterialDB!</span>
        </h1>
      )}
    </>
  );
};

export default MainTitle;
