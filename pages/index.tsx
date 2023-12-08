import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { GetServerSideProps } from 'next';

import { ToastContainer } from 'react-toastify';

import Header from 'components/Header';
import Topics from 'components/Topics';

import type { AppProps } from 'types/components';
import type { IndividualTopic } from 'types/pages';

import NewLinkForm from 'components/NewLinkForm';
import MailActivationSuccess from 'components/MailActivationSuccess';

import styles from './index.module.css';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';

export default function Home(props: AppProps) {
  const { session } = props;

  const [open, setOpen] = useState<boolean>(false);

  const [retrievedTopics, setRetrievedTopics] = useState<IndividualTopic[]>(
    session?.topics ?? []
  );

  const { container } = styles;

  const topicsArray = retrievedTopics;

  return (
    <div className={container}>
      <Head>
        <title>MaterialDB</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />

      <main>
        <MailActivationSuccess />

        <ToastContainer
          position='top-center'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <Topics topicsArray={topicsArray} />
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
      <footer>made with love by claurennt</footer>
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
