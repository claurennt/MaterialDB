import { useSession } from 'next-auth/react';
import styles from 'pages/index.module.css';

const MainTitle = () => {
  const { title } = styles;
  const { data: session } = useSession();

  return (
    <>
      {session?.user ? (
        <h1 className={title}>
          Welcome back to your{' '}
          <span className='text-primary-100'>MaterialDB</span>{' '}
          {session.user.name}!
        </h1>
      ) : (
        <h1 className='font-sans text-5xl md:text-7xl'>
          Welcome to <span className='text-primary-100'> MaterialDB!</span>
        </h1>
      )}
    </>
  );
};

export default MainTitle;
