import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { getIconName } from '@lib/client';
import { useSearchParams } from 'next/navigation';
import { ITopic } from '../../types';
import { deleteTopic } from '@actions/topics';
import { DeletionModal } from '@components/DeletionModal';
import { InvokerButton } from '@components/InvokerButton';
import styles from '../../styles/index.module.css';

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
          // onBlur={(e) => {
          //   console.log('bbbb', e.target);
          //   e.currentTarget === document.activeElement &&
          //     setOpenSettings(false);
          // }}
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
        <InvokerButton
          commandfor='topic-delete-dialog'
          command='show-modal'
          aria-label={`Delete topic ${name}`}
          className={styles.invoker_button_open_delete_topic}

          //  handleOnBlur={() => setOpenSettings(false)}
          //   uniqueId={`${id}-remove-btn`}
          //   handleOnClick={() => handleOpenModal(true)}
          // />
          // onBlur={handleOnBlur}
          // id={uniqueId}
          // aria-label='Delete topic'
          // onClick={handleOnClick}
          // className={styles.invoker_button_delete}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            stroke-width='1.5'
            stroke='currentColor'
            className='size-6 hover:fill-bg hover:stroke-secondary-100'
            aria-hidden
          >
            <path
              stroke-linecap='round'
              stroke-linejoin='round'
              d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0'
            />
          </svg>
        </InvokerButton>
      )}
    </li>
  );
};
