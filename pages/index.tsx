'use client';
import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Jost } from 'next/font/google';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { BounceLoader } from 'react-spinners';

import { ITopic } from 'types/mongoose';
import Topics from 'components/Topics';
import DBClient from 'utils/server/DBClient';
import AuthLinks from 'components/AuthLinks';
import NewLinkForm from 'components/NewLinkForm';
import Subtitle from 'components/Subtitle';
import Topic from 'models/Topic';
import MainTitle from 'components/MainTitle';

type HomeProps = { currentTopics: ITopic[]; session: Session };

//font for the project
const jost = Jost({ subsets: ['latin'], variable: '--font-inter' });

const Home: React.FunctionComponent<HomeProps> = ({ currentTopics }) => {
  const [open, setOpen] = useState<boolean>(false);

  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const retrievedTopics: ITopic[] | Session['user']['topics'] =
    currentTopics?.length ? currentTopics : session?.user?.topics || [];

  useEffect(() => {
    let timerId: number;
    if (session) setIsLoading(false);
    else {
      timerId = window.setTimeout(() => setIsLoading(false), 500);
    }
    return () => clearTimeout(timerId);
  }, [session]);

  return (
    <>
      <Head>
        <title>MaterialDB</title>
        <link rel='icon' href='/logo.ico' />
      </Head>
      <div className={'min-h-full'}>
        <div className={`${jost.variable} font-sans pb-2 `}>
          <main className='flex flex-col items-center gap-y-10 text-center pt-20'>
            <MainTitle />
            <Subtitle setOpen={setOpen} />
            <BounceLoader color='#FD5244' loading={isLoading} size={100} />
            {!session && !isLoading && <AuthLinks />}

            {retrievedTopics?.length > 0 ? (
              <Topics topicsArray={retrievedTopics} />
            ) : null}

            {open && session && (
              <NewLinkForm type='topic' open={open} setOpen={setOpen} />
            )}
          </main>
          <footer className='text-center absolute bottom-5 w-full'>
            made with love by claurennt
          </footer>
        </div>
      </div>
    </>
  );
};

//pre-render page with server side props
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    await DBClient();
    const { query } = ctx;

    // if the url has a userId parameter send a request to the database to get the topics of that user
    if (query.userId) {
      const topics = await Topic.find(query && { _creator: query.userId });

      if (topics)
        return { props: { currentTopics: JSON.parse(JSON.stringify(topics)) } };
    }

    return { props: { currentTopics: null } };
  } catch (err) {
    console.log('err', err);
    //if no admin is authenticated and no query is present in the url send null
    return { props: { currentTopics: null } };
  }
};

export default Home;
