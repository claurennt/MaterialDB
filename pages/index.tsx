import React, { useRef, useState } from 'react';
import { GetServerSideProps } from 'next';

import { Jost } from 'next/font/google';
import { useSession } from 'next-auth/react';
import { getServerSession } from 'next-auth';
import * as jose from 'jose';
import 'react-toastify/dist/ReactToastify.css';

import { SECRET } from '../globals';
import { ITopic } from '@types';
import { DBClient } from '@utils/server';
import {
  NewLinkModal,
  MainTitle,
  Subtitle,
  AuthLinks,
  Header,
  LiveRegion,
  TopicCard,
} from '@components';
import { Topic, Admin } from '@models';
import { authOptions } from './api/auth/[...nextauth]';
import { useRouter } from 'next/router';
import { useLiveRegion } from '@utils/client';

type HomeProps = { currentTopics: ITopic[] };

//font for the project
const jost = Jost({ subsets: ['latin'], variable: '--font-inter' });

const Home: React.FunctionComponent<HomeProps> = ({ currentTopics }) => {
  const [open, setOpen] = useState<boolean>(false);

  const { data: session } = useSession();

  const {
    query: { userId },
  } = useRouter();
  const numberOfTopicLinks = currentTopics?.length;
  const previousNumberOfLinksRef = useRef<number>(numberOfTopicLinks);

  const liveRegionContent = useLiveRegion({
    numberOfTopicLinks,
    previousNumberOfLinksRef,
    type: 'topic',
  });

  return (
    <>
      <Header />
      <LiveRegion liveRegionContent={liveRegionContent} />
      <div className='min-h-full'>
        <div className={`${jost.variable} font-sans pb-2 `}>
          <main className='flex flex-col items-center gap-y-10 text-center pt-20'>
            <MainTitle />
            <Subtitle setOpen={setOpen} />
            {!session && !userId && <AuthLinks />}
            {currentTopics?.length > 0 ? (
              <ul className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-6 gap-8'>
                {currentTopics.map((topic: ITopic) => (
                  <TopicCard key={topic._id} {...topic} />
                ))}
              </ul>
            ) : null}

            {open && session && (
              <NewLinkModal type='topic' open={open} setOpen={setOpen} />
            )}
          </main>
          <footer
            className={`text-center ${
              currentTopics?.length > 0 ? 'static' : 'absolute'
            } bottom-5 w-full`}
          >
            made with love by claurennt
          </footer>
        </div>
      </div>
    </>
  );
};

export default Home;

//pre-render page with server side props
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    await DBClient();
    const { query } = ctx;

    // if the url has a userId parameter send a request to the database to get the topics of that user
    if (query.userId) {
      const topics = await Topic.find(query && { _creator: query.userId });

      return { props: { currentTopics: JSON.parse(JSON.stringify(topics)) } };
    }

    const data = await getServerSession(ctx.req, ctx.res, authOptions);

    if (!data) {
      return { props: { currentTopics: null } };
    }

    const {
      user: { access_token },
    } = data;

    const {
      payload: { email },
    } = await jose.jwtVerify(access_token, SECRET);

    const loggedInUserTopics = await Admin.findOne({
      email,
    }).populate('topics');

    return {
      props: {
        currentTopics: JSON.parse(JSON.stringify(loggedInUserTopics.topics)),
      },
    };
  } catch (err) {
    console.log(err);
    return err.code === 'ERR_JWS_INVALID'
      ? { props: {} }
      : { props: { currentTopics: null } };
  }
};
