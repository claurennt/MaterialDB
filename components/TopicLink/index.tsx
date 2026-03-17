import React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { ILink } from '../../types/mongoose';
import { DeletionModal, FilterTag, CopyToClipboardButton } from '..';

import { HighlightedText } from '@components';
import { deleteLink } from '@actions/links';

type TopicLinkProps = {
  link: ILink;
  search: string;
  handleFilterByTag: (e: React.MouseEvent<HTMLButtonElement>) => void;
  activeFilters: string[];
  isOwner: boolean;
};

export const TopicLink = ({
  link: { title, url, tags, _id },
  handleFilterByTag,
  activeFilters,
  search,
  isOwner,
}: TopicLinkProps) => {
  const [openDeletionModal, setOpenDeletionModal] =
    React.useState<boolean>(false);

  const router = useRouter();
  const { id: topicId } = useParams();

  const handleDeleteLink = async () => {
    await deleteLink({ id: _id, topicId });
    router.refresh();
  };
  const handleOpenModal = (open: boolean) => setOpenDeletionModal(open);

  return (
    <li className='flex gap-2 flex-col mx-3'>
      <DeletionModal
        open={openDeletionModal}
        handleOpenModal={handleOpenModal}
        handleDeleteLink={handleDeleteLink}
      />
      <div className='flex'>
        <a
          id={`scraped-link-${_id}`}
          href={url}
          target='_blank'
          className='rounded-md underline-offset-4 decoration-secondary-100 decoration-1 inline-block text-lg md:text-xl underline mr-4 hover:text-pink-300'
        >
          <HighlightedText search={search} title={title} />
        </a>
        <div className='flex items-center gap-4 flex-shrink-0 text-sm'>
          <CopyToClipboardButton url={url} />
          {isOwner && (
            <>
              <button
                className='p-1 hover:text-gray-400 text-red-400 bg-red-400/10 rounded-md transition-colors'
                onClick={() => handleOpenModal(true)}
              >
                Remove
              </button>
            </>
          )}
        </div>
      </div>
      <ul className='flex' aria-label='tags'>
        {tags?.map((tag, index) => (
          <FilterTag
            activeFilters={activeFilters}
            handleFilterByTag={handleFilterByTag}
            key={index}
            tag={tag}
            totalTags={tags.length}
            index={index}
          />
        ))}
      </ul>
    </li>
  );
};
