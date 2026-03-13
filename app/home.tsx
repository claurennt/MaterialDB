'use client';

import React, { useState } from 'react';
import { ITopic } from '@types';
import { useLiveRegion } from '@lib/client';
import {
  NewLinkModal,
  MainTitle,
  Subtitle,
  AuthLinks,
  Header,
  LiveRegion,
  TopicCard,
  AddNewButton,
  SkipLink,
} from '@components';

export default function Home({
  topics,
  isOwner,
  userId,
  isAuthenticated,
}: {
  topics: Pick<ITopic, 'name' | 'description' | '_id'>[];
  isOwner: boolean;
  userId?: string;
  isAuthenticated: boolean;
}) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const prevTopicsLengthRef = React.useRef<number>(topics.length);

  const totalCount = topics?.length || 0;

  const { announcement } = useLiveRegion({ totalCount, type: 'topic' });

  const showTopics = () =>
    totalCount ? (
      <ul className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-6 gap-8'>
        {topics.map((topic, i) => {
          const key = topic._id.toString();
          const anchorId = `topic-card-${i}`;

          return <TopicCard key={key} {...topic} anchorId={anchorId} />;
        })}
      </ul>
    ) : null;

  const newTopicAnchorId =
    prevTopicsLengthRef.current < topics.length
      ? `topic-card-${topics.length - 1}`
      : '';

  const handleOpenModal = (open: boolean) => setOpenModal(open);
  return (
    <>
      <Header />
      <LiveRegion liveRegionContent={announcement} />
      <main className='flex flex-col items-center gap-y-10 text-center p-10 lg:pt-20 lg:px-10 min-h-screen'>
        <MainTitle />

        <Subtitle
          totalCount={totalCount}
          isOwner={isOwner}
          isAuthenticated={isAuthenticated}
        />
        <div className='relative flex justify-center'>
          {isAuthenticated ? (
            <AddNewButton text='topic' handleOpenModal={handleOpenModal} />
          ) : !userId ? (
            <AuthLinks />
          ) : null}

          <SkipLink
            anchorId={newTopicAnchorId}
            show={!openModal && !!newTopicAnchorId}
            type='topic'
          />
        </div>

        {showTopics()}

        {isOwner && (
          <NewLinkModal
            type='topic'
            open={openModal}
            handleOpenModal={handleOpenModal}
          />
        )}
      </main>
      <footer className='text-center w-full p-5'>
        made with love by claurennt
      </footer>
    </>
  );
}
