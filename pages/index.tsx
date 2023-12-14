'use client';
import React, { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

import HomePageTitle from 'components/HomePageTitle';
import Topics from 'components/Topics';

import AuthLinks from 'components/AuthLinks';
import NewLinkForm from 'components/NewLinkForm';

import { Jost } from 'next/font/google';

import { AppProps } from 'types/components';
import { ITopic } from 'types/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { Session } from 'inspector';

type HomeProps = { currentTopics: ITopic[]; session: Session };

//font for the project
const jost = Jost({ subsets: ['latin'], variable: '--font-inter' });

const Home: React.FunctionComponent<HomeProps> = ({ currentTopics }) => {
  const [open, setOpen] = useState<boolean>(false);

  const [retrievedTopics, setRetrievedTopics] = useState<
    AppProps['currentTopics']
  >(currentTopics || []);

  return (
    <div className={`${jost.variable} font-sans`}>
      <Head>
        <title>MaterialDB</title>
        <link rel='icon' href='/logo.ico' />
      </Head>

      <main className='flex flex-col items-center gap-y-10 text-center pt-20'>
        <HomePageTitle />
        {currentTopics && (
          <>
            <p>
              Start adding new <span className='text-primary-100'>topics</span>{' '}
              to your collection!
            </p>
            <button
              aria-label='open modal to app new topic'
              className='bg-primary-100 p-1 text-lg hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
              onClick={() => setOpen(true)}
            >
              Add topic
            </button>
          </>
        )}{' '}
        {currentTopics ? (
          <Topics topicsArray={retrievedTopics} />
        ) : (
          <AuthLinks />
        )}
        {open && (
          <NewLinkForm
            type='topic'
            setRetrievedTopics={setRetrievedTopics}
            open={open}
            setOpen={setOpen}
          />
        )}{' '}
      </main>
      <footer className='absolute text-center bottom-0 right-0 left-0'>
        made with love by claurennt
      </footer>
    </div>
  );
};

//pre-render page with server side props
export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query: { userId },
}) => {
  try {
    // if the url has a userId parameter send a request to api/topics?userId=${userId}
    if (userId) {
      const { data } = await axios.get(
        `${process.env.NEXTAUTH_URL}?userId=${userId}`
      );
      const currentTopics: ITopic = data;

      return { props: { currentTopics: [currentTopics] } };
    }

    const session = await getServerSession(req, res, authOptions);
    if (session.user.topics) {
      //if there is a session,i.e. cookies are stored send it as prop else send null
      return {
        props: {
          session: session,
          currentTopics: session.user.topics,
        },
      };
    } else return { props: {} };
  } catch (err) {
    //if no admin is authenticated and no query is present in the url send null
    return { props: { session: null } };
  }
};

export default Home;
