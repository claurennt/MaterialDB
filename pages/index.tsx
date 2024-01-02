'use client';
import React, { useEffect, useState } from 'react';
import DBClient from 'utils/server/DBClient';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

import Topics from 'components/Topics';

import AuthLinks from 'components/AuthLinks';
import NewLinkForm from 'components/NewLinkForm';

import { Jost } from 'next/font/google';

import { ITopic } from 'types/mongoose';
import { Session } from 'next-auth';

import { useSession } from 'next-auth/react';
import Subtitle from 'components/Subtitle';
import Topic from 'models/Topic';
import MainTitle from 'components/MainTitle';

type HomeProps = { currentTopics: ITopic[]; session: Session };

//font for the project
const jost = Jost({ subsets: ['latin'], variable: '--font-inter' });

const Home: React.FunctionComponent<HomeProps> = ({ currentTopics }) => {
  const { data: session } = useSession();

  const [retrievedTopics, setRetrievedTopics] = useState<ITopic[]>(
    currentTopics?.length ? currentTopics : []
  );
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    // after login update the topics taken from the logged in user
    if (session) {
      setRetrievedTopics(session.user.topics);
    }
  }, [session]);

  return (
    <div className={`${jost.variable} font-sans`}>
      <Head>
        <title>MaterialDB</title>
        <link rel='icon' href='/logo.ico' />
      </Head>

      <main className='flex flex-col items-center gap-y-10 text-center pt-20'>
        <MainTitle />
        <Subtitle setOpen={setOpen} />

        {!session && <AuthLinks />}

        {retrievedTopics?.length > 0 ? (
          <Topics topicsArray={retrievedTopics} />
        ) : null}

        {open && session && (
          <NewLinkForm type='topic' open={open} setOpen={setOpen} />
        )}
      </main>
      <footer className='text-center  mt-20 mb-5'>
        made with love by claurennt
      </footer>
    </div>
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

      if (topics) return { props: { currentTopics: topics } };
    }

    return { props: { currentTopics: null } };
  } catch (err) {
    console.log('err', err);
    //if no admin is authenticated and no query is present in the url send null
    return { props: { currentTopics: null } };
  }
};

export default Home;
