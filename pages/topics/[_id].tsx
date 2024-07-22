import type { GetServerSideProps } from 'next';
import { useRouter, NextRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';
import { DBClient } from '@utils/server';
import { ITopic } from '@types';
import { Topic } from '@models';
import '@models';
import { TopicLink, NewLinkForm, AddNewButton, SearchBar } from '@components';
import Link from 'next/link';

type TopicPageProps = {
  individualTopic: ITopic;
};

const TopicPage: React.FunctionComponent<TopicPageProps> = ({
  individualTopic,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<undefined | string>();
  const [filteringTags, setFilteringTags] = useState<string[] | null>(null);
  const [liveRegionContent, setLiveRegionContent] = useState<string>('');
  const { data: session } = useSession();

  // gets router info with props passed with Link component
  const router: NextRouter = useRouter();
  const {
    query: { name, _id, userId },
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
    const target = e.target as HTMLButtonElement;
    setFilteringTags((prev) =>
      prev.includes(target.innerText)
        ? [
            ...prev.filter(
              (tag) => tag.toLowerCase() !== target.innerText.toLowerCase()
            ),
          ]
        : [
            ...prev.filter(
              (tag) => tag.toLowerCase() !== target.innerText.toLowerCase()
            ),
            target.innerText.toLowerCase(),
          ]
    );
  };
  useEffect(() => {
    if (filteringTags)
      setLiveRegionContent(
        filteringTags.length
          ? `Now showing all links with tags: ${filteringTags}`
          : `all tag filters have been removed`
      );
  }, [filteringTags]);
  console.log(typeof filteringTags);
  return (
    <div>
      <span aria-live='polite' role='alert' className='sr-only'>
        {liveRegionContent}
      </span>
      <Link
        className={`self-center text-primary-300 p-1 text-lg hover:text-secondary-300 ease-linear duration-300 active:scale-75 font-bold px-5 absolute top-3 ${
          session ? 'right-24' : 'left-2'
        }`}
        href={{
          pathname: '/',
          query: `${userId ? `userId=${userId}` : ''}`,
        }}
      >
        Home
      </Link>
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
          <SearchBar handleSubmit={handleSubmit} />

          {session && (
            <>
              <span className='self-center'>OR </span>{' '}
              <AddNewButton text='link' setOpen={setOpen} />
            </>
          )}
        </div>
      </div>
      {individualTopic?.links
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
