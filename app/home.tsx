'use client';

import React, { useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Jost } from 'next/font/google';
import { ITopic } from '@types';
import { useLiveRegion } from './lib/client'; // update path as needed
import {
  NewLinkModal,
  MainTitle,
  Subtitle,
  AuthLinks,
  Header,
  LiveRegion,
  TopicCard,
} from '@components';

const jost = Jost({ subsets: ['latin'], variable: '--font-inter' });

export default function HomeClient({
  currentTopics,
}: {
  currentTopics: ITopic[];
}) {
  const [open, setOpen] = useState<boolean>(false);
  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const numberOfTopicLinks = currentTopics?.length || 0;
  const previousNumberOfLinksRef = useRef<number>(numberOfTopicLinks);

  const liveRegionContent = useLiveRegion({
    numberOfTopicLinks,
    previousNumberOfLinksRef,
    type: 'topic',
  });

  return (
    <div className={`${jost.variable} font-sans`}>
      <Header />
      <LiveRegion liveRegionContent={liveRegionContent} />
      <main className='flex flex-col items-center gap-y-10 text-center p-10 lg:pt-20 lg:px-10 min-h-screen'>
        <MainTitle />
        <Subtitle setOpen={setOpen} />
        {!session && !userId && <AuthLinks />}
        {currentTopics?.length > 0 && (
          <ul className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-6 gap-8'>
            {currentTopics.map((topic) => (
              <TopicCard key={topic._id} {...topic} />
            ))}
          </ul>
        )}
        {open && session && (
          <NewLinkModal type='topic' open={open} setOpen={setOpen} />
        )}
      </main>
      <footer className='text-center w-full p-5'>
        made with love by claurennt
      </footer>
    </div>
  );
}
