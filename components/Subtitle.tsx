import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from 'pages/index.module.css';

type SubtitleProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Subtitle: React.FunctionComponent<SubtitleProps> = ({ setOpen }) => {
  const { description } = styles;
  const {
    query: { userId },
  } = useRouter();
  const { data: session } = useSession();
  return (
    <>
      {session ? (
        <>
          <p className='text-2xl'>
            Start adding new <span className='text-primary-100 '>topics</span>{' '}
            to your collection!
          </p>
          <button
            aria-label='open modal to app new topic'
            className='bg-primary-100 p-1 text-lg hover:bg-primary-neon focus:bg-primary-neon text-white font-bold py-2 px-4 rounded-full'
            onClick={() => setOpen(true)}
          >
            Add topic
          </button>
        </>
      ) : (
        <h2 className='text-3xl'>
          MaterialDB is an app where you can collect useful links and resources
          that help you become a better{' '}
          <span className='text-primary-100'>developer/instructor</span>.
        </h2>
      )}
      {userId && (
        <p className={description}>
          If you wanna see a list of resources pick a{' '}
          <span className='text-primary-100'>topic</span> below.
        </p>
      )}
    </>
  );
};

export default Subtitle;
