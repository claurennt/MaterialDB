'use client';

import React, { useState } from 'react';
import { ITopic } from '../types';
import { useLiveRegion } from '@lib/client/hooks/useLiveRegion';
import { AuthLinks } from '@components/AuthLinks';
import { Header } from '@components/Header';
import { LiveRegion } from '@components/LiveRegion';
import { TopicCard } from '@components/TopicCard';
import { SkipLink } from '@components/SkipLink';
import { MainTitle } from '@components/MainTitle';
import { Subtitle } from '@components/Subtitle';
import { NewLinkModal } from '@components/NewLinkModal';
import { InvokerButton } from '@components/InvokerButton';
import styles from '../styles/index.module.css';
import { DeletionModal } from '@components/DeletionModal';
import { deleteTopic } from '@actions/topics';

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

          return (
            <TopicCard
              key={key}
              {...topic}
              anchorId={anchorId}
              isOwner={isOwner}
            />
          );
        })}
      </ul>
    ) : null;

  const newTopicAnchorId =
    prevTopicsLengthRef.current < topics.length
      ? `topic-card-${topics.length - 1}`
      : '';

  const handleOpenModal = (open: boolean) => setOpenModal(open);
  const uniqueTopicDialogId = 'add-topic-modal';
  console.log('home', uniqueTopicDialogId);

  const handleDeleteTopic = async (e) => {
    console.log(e.target);
    await deleteTopic({ topicId: _id });
  };
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
            <InvokerButton
              command='show-modal'
              // handleOpenModal={handleOpenModal}
              commandfor={uniqueTopicDialogId}
              className={styles.invoker_button_open}
            >
              Add new topic
            </InvokerButton>
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
        {/* TODO i removed isowner, it has to be made hidden if not owner but always in dom, plus multiple dialogs are in dom now ,
        PLUS the invoker close one sems only to work if contained inside dialog, i moved the + around*/}
        <NewLinkModal
          type='topic'
          // open={openModal}
          // handleOpenModal={handleOpenModal}
          uniqueDialogId={uniqueTopicDialogId}
        />
        <DeletionModal
          uniqueDialogId='topic-delete-dialog'
          handleDelete={handleDeleteTopic}
          title={`Are you sure you want to delete this topic?`}
        />
      </main>
      <footer className='text-center w-full p-5'>
        made with love by claurennt
      </footer>
    </>
  );
}
