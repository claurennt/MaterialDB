'use client';
import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth/next';

import HomePageTitle from 'components/HomePageTitle';
import Topics from 'components/Topics';
import type { AppProps } from 'types/components';
import type { IndividualTopic } from 'types/pages';
import AuthLinks from 'components/AuthLinks';
import NewLinkForm from 'components/NewLinkForm';

import { authOptions } from './api/auth/[...nextauth]';

import { Jost } from 'next/font/google';

//font for the project
const jost = Jost({ subsets: ['latin'], variable: '--font-inter' });

export default function Home(props: AppProps) {
  const { session } = props;

  const [open, setOpen] = useState<boolean>(false);

  const [retrievedTopics, setRetrievedTopics] = useState<IndividualTopic[]>(
    session?.topics ?? []
  );

  return (
    <div className={`${jost.variable} font-sans`}>
      <Head>
        <title>MaterialDB</title>
        <link rel='icon' href='/logo.ico' />
      </Head>

      <main className='flex flex-col items-center gap-y-10 text-center pt-20'>
        <HomePageTitle />
        {session ? <Topics topicsArray={retrievedTopics} /> : <AuthLinks />}
      </main>
      {session && (
        <button
          className='bg-blue-600 absolute bottom-0 right-0 p-1 text-lg '
          onClick={() => setOpen(true)}
        >
          +
        </button>
      )}
      {open && (
        <NewLinkForm
          type='topic'
          setRetrievedTopics={setRetrievedTopics}
          open={open}
          setOpen={setOpen}
        />
      )}
      <footer className='absolute text-center bottom-3 right-0 left-0'>
        made with love by claurennt
      </footer>
    </div>
  );
}

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
        `${process.env.REQUESTURL}?userId=${userId}`
      );
      return { props: { currentTopics: data || null } };
    }

    const session = await getServerSession(req, res, authOptions);

    //if there is a session,i.e. cookies are stored send it as prop else send null
    return { props: { session: session || null } };
  } catch (err) {
    //if no admin is authenticated and no query is present in the url send null
    return { props: { session: null } };
  }
};
