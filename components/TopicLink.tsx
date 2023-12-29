import React from 'react';
import Tag from './Tag';
import { nanoid } from 'nanoid';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import axios from 'axios';
import type { HighlightSearchTerm } from 'types/components';
import { ILink } from 'types/mongoose';
import { useSession } from 'next-auth/react';
import { categories } from 'utils/client/data';

type TopicLinkProps = {
  link: ILink;
  search: string;
  setTopicLinks: React.Dispatch<React.SetStateAction<ILink[]>>;
};

const TopicLink: React.FunctionComponent<TopicLinkProps> = ({
  link: { title, url, tags, _id, category },
  search,
  setTopicLinks,
}) => {
  const { data: session } = useSession();
  const deleteLink = async () => {
    const { data } = await axios.delete(`/api/links/${_id}`);

    setTopicLinks((prev) => prev.filter((link) => link._id !== data._id));
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
      <div>
        <button
          className={`text-white text-m mx-2 px-2`}
          style={{ backgroundColor: color }}
        >
          {category}
        </button>
        <a
          href={url}
          target='_blank'
          className='text-2xl'
          dangerouslySetInnerHTML={
            search ? highlightSearchTerm(title) : { __html: title }
          }
        />

        <CopyToClipboard text={url}>
          <button className='text-blue-600 text-lg mx-3 '>copy</button>
        </CopyToClipboard>
        <div className='flex flex-row'>
          {tags?.map((tag) => (
            <Tag key={nanoid()} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicLink;
