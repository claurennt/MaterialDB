import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

import { Tag } from '..';
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
};

export const TopicLink: React.FunctionComponent<TopicLinkProps> = ({
  link: { title, url, tags, _id },
  onClick,
  filteringTags,
  search,
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
    <div className='mt-5 flex'>
      <div className='flex flex-row'>
        <div>
          <ul className='flex items-center'>
            <li>
              {session && (
                <>
                  <button
                    className='text-4xl mx-3 self-start focus:outline-none text-primary-100 focus:ring-2 focus:ring-secondary-100'
                    onClick={deleteLink}
                    aria-labelledby={`remove-link-${_id}`}
                  >
                    -
                  </button>
                  <span className='sr-only' id={`remove-link-${_id}`}>
                    Remove current link from list
                  </span>
                </>
              )}

              <a
                href={url}
                target='_blank'
                className='text-2xl focus:outline-secondary-100 focus:outline-2 focus:outline-offset-4'
                dangerouslySetInnerHTML={
                  search
                    ? highlightSearchTerm(search, title)
                    : { __html: title }
                }
              />

              <button
                onClick={() => copyToClipboard(url)}
                className='text-secondary-200 text-lg mx-3 hover:scale-150 focus:outline-secondary-100 focus:outline-2 focus:outline-offset-4'
                aria-label='copy link to clipboard'
              >
                <Image width='25' height='25' src={copy} alt='' />
              </button>

              <div className='ml-10'>
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
          </ul>
        </div>
      </div>
    </div>
  );
};
