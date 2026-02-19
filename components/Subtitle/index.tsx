import React from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { AddNewButton } from '../AddNewButton';

type SubtitleProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Subtitle: React.FunctionComponent<SubtitleProps> = ({
  setOpen,
}) => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  // const { description } = styles;

  const { data: session } = useSession();
  return (
    <>
      {session ? (
        <>
          <h2 className='text-2xl'>
            Start adding new <span className='text-primary-100'>topics </span>
            to your collection!
          </h2>
          <AddNewButton text='topic' setOpen={setOpen} />
        </>
      ) : (
        <h2 className='text-3xl'>
          MaterialDB is an app where you can collect useful links and resources
          that help you become a better
          <span className='text-primary-100'> developer/instructor</span>.
        </h2>
      )}
      {userId && !session && (
        <p>
          If you wanna see a list of resources pick a{' '}
          <span className='text-primary-100'>topic</span> below.
        </p>
      )}
    </>
  );
};
