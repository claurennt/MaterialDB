import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import { DeletionPopup, Tag } from '..';
import { ILink } from 'types/mongoose';
import {
  highlightSearchTerm,
  deleteResource,
  copyToClipboard,
} from '@utils/client';
import copy from 'public/copy.png';

type TopicLinkProps = {
  link: ILink;
  search: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  filteringTags: string[];
  setShowDeletionPopup: React.Dispatch<React.SetStateAction<boolean>>;
  showDeletionPopup: boolean;
};

export const TopicLink: React.FunctionComponent<TopicLinkProps> = ({
  link: { title, url, tags, _id },
  onClick,
  filteringTags,
  search,
  showDeletionPopup,
  setShowDeletionPopup,
}) => {
  const { data: session } = useSession();

  const router = useRouter();
  let userToken: string;
  if (session?.user) {
    userToken = session.user.access_token;
  }

  const deleteLink = async () => {
    await deleteResource(userToken, `/api/links/${_id}`);
    router.replace(router.asPath);
  };

  return (
    <li>
      <div className='flex'>
        <DeletionPopup
          open={showDeletionPopup}
          setOpen={setShowDeletionPopup}
          deleteLink={deleteLink}
        />
        {session && (
          <>
            <button
              className='text-4xl mx-3 self-center leading-3 focus:outline-none text-primary-neon focus:ring-2 focus:ring-secondary-100'
              onClick={() => setShowDeletionPopup(true)}
              aria-labelledby={`remove-link-${_id}`}
            >
              -
            </button>
            <span className='sr-only' id={`remove-link-${_id}`}>
              Remove current link from list
            </span>
          </>
        )}
        <div className='flex'>
          <a
            href={url}
            target='_blank'
            className='inline-block text-lg md:text-2xl underline focus:outline-secondary-100 focus:outline-2 focus:outline-offset-4 text-pr bg-gradient-to-l from-[rgb(181,255,255)] to-[rgb(80,243,243)] bg-clip-text text-transparent'
            dangerouslySetInnerHTML={
              search ? highlightSearchTerm(search, title) : { __html: title }
            }
          />
          <button
            onClick={() => copyToClipboard(url)}
            className='text-secondary-200 text-lg mx-3 hover:scale-150 focus:outline-secondary-100 focus:outline-2 focus:outline-offset-4'
            aria-label='copy link to clipboard'
          >
            <Image width='24' height='24' src={copy} alt='' />
          </button>
        </div>
      </div>
      <div className='ml-9 flex'>
        {tags?.map((tag, index) => (
          <Tag
            filteringTags={filteringTags}
            onClick={onClick}
            key={index}
            tag={tag}
            totalTags={tags.length}
            index={index}
          />
        ))}
      </div>
    </li>
  );
};
