import type { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { useSession } from 'next-auth/react';
import React, { useState, useRef } from 'react';
import { DBClient } from '@utils/server';
import { useLiveRegion } from '@utils/client';
import { ILink, ITopic } from '@types';
import { Topic } from '@models';
import '@models';
import {
  TopicLink,
  NewLinkModal,
  AddNewButton,
  SearchBar,
  Header,
  LiveRegion,
} from '@components';

type TopicPageProps = {
  individualTopic: ITopic;
};

const doesLinkMatchTags = ({
  filteringTags,
  link,
}: {
  filteringTags: string[];
  link: ILink;
}) => {
  if (!filteringTags.length) return true;
  return link.tags.some((tag) => filteringTags.includes(tag));
};

const TopicPage: React.FunctionComponent<TopicPageProps> = ({
  individualTopic,
}) => {
  const numberOfTopicLinks = individualTopic.links?.length;
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<undefined | string>();
  const [filteringTags, setFilteringTags] = useState<string[]>([]);
  const [showDeletionPopup, setShowDeletionPopup] = useState(false);
  const announceLiveRegionRef = useRef<boolean>(false);
  const previousNumberOfLinksRef = useRef<number>(numberOfTopicLinks);

  const numberOfFilteredLinks = individualTopic.links.filter((link) =>
    doesLinkMatchTags({ filteringTags, link })
  ).length;

  const liveRegionContent = useLiveRegion({
    announceLiveRegionRef,
    filteringTags,
    numberOfFilteredLinks,
    numberOfTopicLinks,
    previousNumberOfLinksRef,
    open,
    type: 'link',
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
  };

  const filterResultsByActiveTag = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const target = e.currentTarget;

    setFilteringTags((prev) => {
      const tagText = target.innerText.toLowerCase().replace(/\s*✓/g, '');
      const newTags = prev.filter((tag) => tag.toLowerCase() !== tagText);
      return prev.includes(tagText) ? newTags : [...newTags, tagText];
    });

    announceLiveRegionRef.current = true;
  };

  const getLinks = () =>
    individualTopic.links
      ?.filter((link) => {
        const matchesTags = doesLinkMatchTags({ filteringTags, link });
        const matchesSearch = search
          ? link.title.toLowerCase().includes(search.toLowerCase())
          : true;
        return matchesTags && matchesSearch;
      })
      .map((link, i) => (
        <TopicLink
          filteringTags={filteringTags}
          search={search}
          key={link._id ?? i}
          link={link}
          onClick={filterResultsByActiveTag}
          showDeletionPopup={showDeletionPopup}
          setShowDeletionPopup={setShowDeletionPopup}
        />
      ));
  return (
    <>
      <Header />
      <main>
        <LiveRegion liveRegionContent={liveRegionContent} />

        {open && _id && (
          <NewLinkModal
            individualTopicId={individualTopic._id}
            setOpen={setOpen}
            open={open}
            type='link'
          />
        )}
        <div className='flex flex-col items-center text-center pt-10 gap-4 pb-10 mt-10'>
          <h1 className='leading-tight text-5xl mt-0 mb-5 text-primary-100 text-center pt-3'>
            {individualTopic?.name ?? name}
          </h1>
          <div className='flex gap-7 justify-center items-center flex-col md:flex-row'>
            <SearchBar
              handleSubmit={handleSubmit}
              search={search}
              setSearch={setSearch}
            />

            {session && (
              <>
                <span className='self-center md:self-end block'>OR </span>{' '}
                <AddNewButton text='link' setOpen={setOpen} />
              </>
            )}
          </div>
        </div>
        <ul className='flex flex-col mt-3 gap-5 mx-2'>{getLinks()}</ul>
      </main>
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
