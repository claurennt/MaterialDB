import { useState, Fragment } from 'react';
import Head from 'next/head';
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next';
import type { HomeProps } from '@/types/components';

import Link from 'next/link';
import axios from 'axios';

import NewLinkForm from '../components/NewLinkForm';
import LoginForm from '../components/LoginForm';
import styles from './index.module.css';
import { getSession } from 'next-auth/react';

export default function Home({ session, currentTopics }: HomeProps) {
  const { title, container, description, grid, card } = styles;

  const [open, setOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(session);
  const [retrievedTopics, _] = useState(currentTopics);
  const [newTopic, setNewTopic] = useState({
    name: '',
    description: '',
  });

  const handleClick = async (e) => {
    if (e.target.name === 'logout') {
      await axios.post('/api/auth/logout');
    }

    setOpenPanel(!openPanel);
    setCurrentAdmin();
  };

  const handleChange = (e) =>
    setNewTopic((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const addNewTopic = async (e) => {
    e.preventDefault();

    const { data } = await axios.post('/api/topics', {
      newTopic,
      creatorId: currentAdmin._id,
    });

    setOpen(false);
    setCurrentAdmin(data);
  };

  const topicsArray = currentAdmin?.topics || retrievedTopics;
  console.log(currentAdmin);
  return (
    <div className={container}>
      <Head>
        <title>MaterialDB</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <LoginForm
          openPanel={openPanel}
          setOpenPanel={setOpenPanel}
          currentAdmin={currentAdmin}
          setCurrentAdmin={setCurrentAdmin}
        />
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold  px-4 rounded-full absolute right-0 top-0 m-4'
          name={!currentAdmin?.username ? 'login' : 'logout'}
          onClick={handleClick}
        >
          {!currentAdmin?.username ? 'login' : 'logout'}
        </button>
        {currentAdmin?.username ? (
          <h1 className={title}>
            Welcome back to your <span>MaterialDB</span> {currentAdmin.username}
            !
          </h1>
        ) : (
          <h1 className={title}>
            Welcome to <span>MaterialDB!</span>
          </h1>
        )}
        <h2>
          MaterialDB is an app where you can collect useful links and resources
          that help you become a better <span>developer/instructor</span>.
        </h2>
        <p className={description}>
          If you wanna see a list of resources pick a topic below.
        </p>

        <div className={grid}>
          {topicsArray?.map(({ name, _id, description, subtopics }) => (
            <Fragment key={_id}>
              <Link
                href={{
                  pathname: '/topics/[_id]',
                  query: {
                    _id: _id,
                    currentAdmin: currentAdmin?._id,
                    name: name,
                  },
                }}
                key={_id}
              >
                <a className={card}>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </a>
              </Link>
            </Fragment>
          ))}
        </div>
      </main>
      {currentAdmin && (
        <button
          className='bg-blue-600 absolute bottom-0 right-0 p-1 text-lg '
          onClick={() => setOpen(true)}
        >
          +
        </button>
      )}
      {open && (
        <NewLinkForm
          handleChange={handleChange}
          newData={newTopic}
          addNew={addNewTopic}
          open={open}
          setOpen={setOpen}
          currentAdmin={currentAdmin}
          setCurrentAdmin={setCurrentAdmin}
        />
      )}
      <footer>made with love by claurennt</footer>
    </div>
  );
}

//pre-render page with server side props
export const getServerSideProps: GetServerSideProps = async ({
  req,
  query: { userId },
}) => {
  try {
    // if the url has a userId parameter send a request to api/topics?userId=${userId}
    if (userId) {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_AUTH_URL}/api/topics?userId=${userId}`
      );
      return { props: { currentTopics: data } };
    }
    //else get the the current session
    const session = await getSession({ req });

    //if there is a session,i.e. cookies are stored send it as prop else send []
    return { props: { session: session || null } };
  } catch (err) {
    console.log(err);
    //if no admin is authenticated and no query is present in the url send null
    return { props: { session: null } };
  }
};
