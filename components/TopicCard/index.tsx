import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { getIconName } from '@lib/client';
import { useSearchParams } from 'next/navigation';
import { ITopic } from '../../types';
import { deleteTopic } from '@actions/topics';
import { TopicAction } from './TopicAction';
import { DeletionModal } from '@components/DeletionModal';

type TopicCardProps = Pick<ITopic, 'name' | 'description' | '_id'> & {
  anchorId: string;
  isOwner: boolean;
};

export const TopicCard = ({
  name,
  _id,
  description,
  anchorId,
  isOwner,
}: TopicCardProps) => {
  const lowerCaseName = name?.toLowerCase();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const [openSettings, setOpenSettings] = useState(false);
  const [openDeletionModal, setOpenDeletionModal] = React.useState(false);

  const correctIconName = getIconName(lowerCaseName);
  const src = correctIconName
    ? `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${correctIconName}/${correctIconName}-original.svg`
    : name.toLowerCase().includes('accessibility') ||
        name.toLowerCase().includes('a11y')
      ? '/a11y.svg'
      : `https://img.icons8.com/ios-filled/50/fd5244/${
          name.startsWith('UX') ? 'illustrator--v1' : 'source-code'
        }.png`;
  const href = userId
    ? `/topics/${_id}?userId=${userId}&name=${encodeURIComponent(name)}`
    : `/topics/${_id}?name=${encodeURIComponent(name)}`;

  const id = _id.toString();

  const handleTogglePopup = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenSettings((prev) => !prev);
  };

  const handleOpenModal = (open: boolean) => setOpenDeletionModal(open);

  const handleDeleteTopic = async () => {
    await deleteTopic({ topicId: _id });
  };

  return (
    <li
      className='relative  
          flex flex-col gap-5 justify-center 
          px-5 text-center my-2 mx-auto 
          w-[250px] h-[250px] rounded-[40px] 
          bg-[#1a1a1a] 
          border-2 border-[var(--primary-color-neon)]
          shadow-[5px_5px_30px_7px_rgba(0,0,0,0.25),-5px_-5px_30px_7px_rgba(0,0,0,0.22)]
          cursor-pointer
          hover:outline hover:outline-4 hover:outline-[var(--secondary-color)]
         
          focus-within:outline focus-within:outline-secondary-300 focus-within:outline-2 focus-within:outline-offset-2
        '
    >
      <DeletionModal
        open={openDeletionModal}
        handleOpenModal={handleOpenModal}
        handleDelete={handleDeleteTopic}
        title={`Are you sure you want to delete this topic: ${name} ?`}
      />
      <Image
        src={src}
        height={50}
        width={50}
        alt=''
        className='rounded-full mx-auto'
      />
      <Link
        href={href}
        key={id}
        id={anchorId}
        className='before:block before:absolute before:inset-0 static focus:outline-none  active:bg-primary-neon'
      >
        <h2 className='text-center font-bold text-[1.2rem] font-sans underline'>
          {name}
        </h2>
      </Link>
      <p className='text-sm opacity-80'>{description}</p>
      {isOwner && (
        <button
          onClick={() => setOpenSettings((prev) => !prev)}
          aria-controls={`${id}-remove-btn`}
          aria-expanded={openSettings}
          aria-label='Toggle settings'
          className='absolute top-5 right-5 z-99 p-2 hover:text-background hover:bg-secondary-100 rounded-full'
        >
          &#x25E6;&#x25E6;&#x25E6;
        </button>
      )}
      {openSettings && isOwner && (
        <TopicAction
          handleOnBlur={() => setOpenSettings(false)}
          uniqueId={`${id}-remove-btn`}
          handleOnClick={() => handleOpenModal(true)}
        />
      )}
    </li>
  );
};
