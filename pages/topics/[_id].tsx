import type { GetServerSideProps } from 'next';
import { useRouter, NextRouter } from 'next/router';
import React, { useState } from 'react';
import { nanoid } from 'nanoid';

import TopicLink from 'components/TopicLink';
import NewLinkForm from 'components/NewLinkForm';
import SearchBar from 'components/SearchBar';

import { ILink, ITopic } from 'types/mongoose';
import Topic from 'models/Topic';
import { useSession } from 'next-auth/react';

type TopicPageProps = {
  individualTopic: ITopic;
};

const TopicPage: React.FunctionComponent<TopicPageProps> = ({
  individualTopic,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<undefined | string>();

  const [topicLinks, setTopicLinks] = useState<ILink[]>(individualTopic.links);

  const { data: session } = useSession();

  //get router info with props passed with Link component
  const router: NextRouter = useRouter();
  const {
    query: { name },
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

  return (
    <div className=''>
      {session && (
        <button
          className='bg-blue-600 absolute bottom-0 right-0 p-1 text-lg '
          onClick={() => setOpen(true)}
        >
          +
        </button>
      )}

      <button
        className='absolute top-0 right-0 mx-5 px-5 text-base '
        onClick={() => router.replace('/')}
      >
        Home
      </button>
      {open && (
        <NewLinkForm
          individualTopicId={individualTopic._id}
          setTopicLinks={setTopicLinks}
          setOpen={setOpen}
          open={open}
          type='link'
        />
      )}

      <h1 className='font-medium leading-tight text-5xl mt-0 mb-5 text-blue-600 text-center'>
        {name}
      </h1>

      <SearchBar handleSubmit={handleSubmit} />

      {topicLinks?.map((link) => (
        <TopicLink
          setTopicLinks={setTopicLinks}
          search={search}
          key={nanoid()}
          link={link}
        />
      ))}
    </div>
  );
};

export default TopicPage;

export const getServerSideProps: GetServerSideProps = async ({
  params: { _id },
}) => {
  try {
    /* find topic by id in our database */
    const topic = await Topic.findById(_id);

    return { props: { individualTopic: JSON.parse(JSON.stringify(topic)) } };
  } catch (e) {
    console.log('fetch error', e);
    return { props: { individualTopic: [] } };
  }
};
