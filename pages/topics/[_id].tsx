import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { useSession } from 'next-auth/react';
import React, { useState, useRef } from 'react';
import { DBClient } from '@utils/server';
import { useLiveRegion } from '@utils/client';
import { ITopic } from '@types';
import { Topic } from '@models';
import '@models';
import {
  TopicLink,
  NewLinkForm,
  AddNewButton,
  SearchBar,
  Header,
} from '@components';

type TopicPageProps = {
  individualTopic: ITopic;
};

const TopicPage: React.FunctionComponent<TopicPageProps> = ({
  individualTopic,
}) => {
  const numberOfTopicLinks = individualTopic.links?.length;
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<undefined | string>();
  const [filteringTags, setFilteringTags] = useState<string[]>([]);

  const announceLiveRegion = useRef<boolean>(false);
  const previousNumberOfLinks = useRef<number>(numberOfTopicLinks);

  const liveRegionContent = useLiveRegion({
    announceLiveRegion,
    filteringTags,
    numberOfTopicLinks,
    previousNumberOfLinks,
    open,
  });

  const { data: session } = useSession();

  // gets router info with props passed with Link component
  const router = useRouter();
  const {
    query: { name, _id },
  } = router;

  // handle search submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      search: { value: string };
    };
    const searchedValue = target.search.value;

    // update query state
    setSearch(searchedValue);

    target.search.value = '';
  };

  const filterResultsByActiveTag = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const target = e.currentTarget;

    setFilteringTags((prev) => {
      const tagText = target.innerText.toLowerCase();
      const newTags = prev.filter((tag) => tag.toLowerCase() !== tagText);
      return prev.includes(tagText) ? newTags : [...newTags, tagText];
    });

    announceLiveRegion.current = true;
  };

  return (
    <>
      <Header />
      <div>
        <span aria-live='polite' role='alert' className='sr-only'>
          {liveRegionContent}
        </span>

        {open && _id && (
          <NewLinkForm
            individualTopicId={individualTopic._id}
            setOpen={setOpen}
            open={open}
            type='link'
          />
        )}
        <div className='flex flex-col items-center text-center pt-10 gap-4 pb-10'>
          <h1 className='leading-tight text-5xl mt-0 mb-5 text-primary-100 text-center pt-3'>
            {individualTopic?.name ?? name}
          </h1>
          <div className='flex gap-10'>
            <SearchBar
              handleSubmit={handleSubmit}
              search={search}
              setSearch={setSearch}
            />

            {session && (
              <>
                <span className='self-center'>OR </span>{' '}
                <AddNewButton text='link' setOpen={setOpen} />
              </>
            )}
          </div>
        </div>
        {individualTopic.links
          ?.filter((link) =>
            filteringTags.length
              ? link.tags.some((tag) => filteringTags.includes(tag))
              : link
          )
          .map((link, i) => (
            <TopicLink
              filteringTags={filteringTags}
              search={search}
              key={link._id ?? i}
              link={link}
              onClick={filterResultsByActiveTag}
            />
          ))}
      </div>
    </>
  );
};

export default TopicPage;

export const getServerSideProps: GetServerSideProps = async ({
  query: { _id },
}) => {
  try {
    await DBClient();

    /* find topic by id in our database */
    const topic = await Topic.findById(_id).populate('links');

    return { props: { individualTopic: JSON.parse(JSON.stringify(topic)) } };
  } catch (e) {
    console.log('fetch error', e);
    return { props: { individualTopic: [] } };
  }
};
