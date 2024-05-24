import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import axios from 'axios';

import { Tag } from '..';
import { ILink } from 'types/mongoose';
import { highlightSearchTerm, deleteResource } from 'utils/client';
import copy from 'public/copy.png';

type TopicLinkProps = {
  link: ILink;
  search: string;
};

export const TopicLink: React.FunctionComponent<TopicLinkProps> = ({
  link: { title, url, tags, _id },

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
                    className='text-blue-600 text-4xl mx-3 self-start'
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
                className='text-2xl'
                dangerouslySetInnerHTML={
                  search
                    ? highlightSearchTerm(search, title)
                    : { __html: title }
                }
              />
              <CopyToClipboard text={url}>
                <button
                  className='text-secondary-200 text-lg mx-3'
                  aria-label='copy link to clipboard'
                >
                  <Image width='25' height='25' src={copy} alt='' />
                </button>
              </CopyToClipboard>
              <div>
                {tags?.map((tag, index) => (
                  <Tag
                    key={index}
                    tag={tag}
                    tagsNumber={tags.length}
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
