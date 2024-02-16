import type { GetServerSideProps } from 'next';
import { useRouter, NextRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { DBClient } from '@utils/server';
import { ITopic } from '@types';
import { Topic } from '@models';
import '@models';
import { TopicLink, NewLinkForm, AddNewButton, SearchBar } from '@components';

type TopicPageProps = {
  individualTopic: ITopic;
};

const TopicPage: React.FunctionComponent<TopicPageProps> = ({
  individualTopic,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<undefined | string>();

  const { data: session } = useSession();

  // gets router info with props passed with Link component
  const router: NextRouter = useRouter();
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

  return (
    <div>
      <button
        className='bg-primary-100 text-sm  text-white hover:bg-primary-neon focus:bg-primary-neon font-bold py-1 px-2 rounded-tl rounded-br m-5 absolute right-20 top-0'
        onClick={() => router.replace('/')}
      >
        Home
      </button>
      {open && _id && (
        <NewLinkForm
          individualTopicId={individualTopic._id}
          setOpen={setOpen}
          open={open}
          type='link'
        />
      )}
      <div className='flex flex-col items-center text-center pt-10 gap-4 pb-10'>
        <h1 className='leading-tight text-5xl mt-0 mb-5 text-primary-100 text-center'>
          {name}
        </h1>
        <div className='flex gap-10'>
          <SearchBar handleSubmit={handleSubmit} />
          <span className='self-center'>OR </span>
          {session && <AddNewButton text='link' setOpen={setOpen} />}
        </div>
      </div>
      {individualTopic?.links?.map((link, i) => (
        <TopicLink search={search} key={link._id ?? i} link={link} />
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
