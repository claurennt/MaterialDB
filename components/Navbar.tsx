import LogoutButton from './LogoutButton';

import { useSession } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <>
      <div className='absolute right-0 top-0'>
        {session && <LogoutButton />}
      </div>
    </>
  );
};

export default Navbar;
