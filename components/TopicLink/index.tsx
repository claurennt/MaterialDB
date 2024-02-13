import React from 'react';
import { Tag } from '..';
import { nanoid } from 'nanoid';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import axios from 'axios';
import Image from 'next/image';

import { ILink } from 'types/mongoose';
import { useSession } from 'next-auth/react';
import { categories } from 'utils/client/data';
import highlightSearchTerm from 'utils/client/highlightSearch';
import copy from 'public/copy.png';
import { useRouter } from 'next/router';

type TopicLinkProps = {
  link: ILink;
  search: string;
};

export const TopicLink: React.FunctionComponent<TopicLinkProps> = ({
  link: { title, url, tags, _id, category },

  search,
}) => {
  const { data: session } = useSession();
  const router = useRouter();

  const deleteLink = async () => {
    await axios.delete(`/api/links/${_id}`);

    router.replace(router.asPath);
  };

  //find matching category and retrieve color for styling
  const color = categories?.find((c) => c.type === category)?.color;

  return (
    <div className='mt-5 flex'>
      {session && (
        <>
          <button
            className='text-blue-600 text-4xl mx-3 '
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
      <div className='flex flex-row'>
        <span
          className={`text-white text-m mx-2 px-2 h-fit self-center`}
          style={{ backgroundColor: color }}
        >
          {category}
        </span>
        <div>
          <div className='flex'>
            <a
              href={url}
              target='_blank'
              className='text-2xl'
              dangerouslySetInnerHTML={
                search ? highlightSearchTerm(search, title) : { __html: title }
              }
            />

            <CopyToClipboard text={url}>
              <button
                className='text-secondary-200 text-lg mx-3 self-center'
                aria-label='copy link to clipboard'
              >
                <Image width='25' height='25' src={copy} alt='Material DB' />
              </button>
            </CopyToClipboard>
          </div>
          <div className='flex flex-row'>
            {tags?.map((tag) => (
              <Tag key={nanoid()} tag={tag} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
