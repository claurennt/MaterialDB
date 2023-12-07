import type { GetServerSideProps, NextPage } from 'next';
import { useRouter, NextRouter } from 'next/router';
import { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';

import axios from 'axios';
import { nanoid } from 'nanoid';
import TopicLink from '../../components/TopicLink';
import NewLinkForm from '../../components/NewLinkForm';
import SearchBar from '../../components/SearchBar';
import type { AppProps, TopicLink as Link, NewLink } from '@/types/components';

const TopicPage = ({ individualTopic }: AppProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<undefined | string>();

  const [topicLinks, setTopicLinks] = useState<Link[]>(individualTopic.links);

  //get router info with props passed with Link component
  const router: NextRouter = useRouter();

  const {
    query: { name, currentAdminId },
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
      {currentAdminId && (
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
        />
      )}

      <h1 className='font-medium leading-tight text-5xl mt-0 mb-5 text-blue-600 text-center'>
        {name}
      </h1>

      <SearchBar handleSubmit={handleSubmit} />

      {topicLinks.map((link) => (
        <TopicLink
          setTopicLinks={setTopicLinks}
          search={search}
          key={nanoid()}
          link={link}
          currentAdminId={currentAdminId}
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
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/api/topics/${_id}`
    );

    return { props: { individualTopic: data } };
  } catch (e) {
    console.log('fetch error', e);
  }
};
