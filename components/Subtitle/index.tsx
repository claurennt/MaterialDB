import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from 'pages/index.module.css';
import { AddNewButton } from '../AddNewButton';

type SubtitleProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Subtitle: React.FunctionComponent<SubtitleProps> = ({
  setOpen,
}) => {
  const { description } = styles;
  const {
    query: { userId },
  } = useRouter();
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
        <p className={description}>
          If you wanna see a list of resources pick a{' '}
          <span className='text-primary-100'>topic</span> below.
        </p>
      )}
    </>
  );
};
