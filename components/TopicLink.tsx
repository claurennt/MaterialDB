import React from 'react';
import Tag from './Tag';
import { nanoid } from 'nanoid';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import axios from 'axios';
import Image from 'next/image';

import type { HighlightSearchTerm } from 'types/components';
import { ILink } from 'types/mongoose';
import { useSession } from 'next-auth/react';
import { categories } from 'utils/client/data';
import copy from 'public/copy.png';
import { useRouter } from 'next/router';


type TopicLinkProps = {
  link: ILink;
  search: string;
};

const TopicLink: React.FunctionComponent<TopicLinkProps> = ({
  link: { title, url, tags, _id, category },
  link,
  search,
}) => {
  const { data: session } = useSession();
  const router = useRouter();

  const deleteLink = async () => {
    await axios.delete(`/api/links/${_id}`);

    router.replace(router.asPath);
  };

  // highlight query using regular expression
  const highlightSearchTerm: HighlightSearchTerm = (title) => {
    const regexp = new RegExp(search, 'gi');
    const replacementPattern = '<mark>$&</mark>';
    const highlightedQuery = title.replaceAll(regexp, replacementPattern);
    return { __html: highlightedQuery };
  };

  //find matching category and retrieve color for styling
  const color = categories?.find((c) => c.type === category)?.color;

  return (
    <div className='mt-5 flex'>
      {session && (
        <button className='text-blue-600 text-4xl mx-3 ' onClick={deleteLink}>
          -
        </button>
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
                search ? highlightSearchTerm(title) : { __html: title }
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

export default TopicLink;
