import styles from '../pages/index.module.css';
import { useSession } from 'next-auth/react';

const MainTitle = () => {
  const { title } = styles;
  const { data: session } = useSession();

  return session?.user ? (
    <h1 className={title}>
      Welcome back to your <span>MaterialDB</span> {session.user.name}!
    </h1>
  ) : (
    <h1 className={title}>
      Welcome to <span>MaterialDB!</span>
    </h1>
  );
};

export default MainTitle;
