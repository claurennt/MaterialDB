import type { GetServerSideProps, NextPage } from 'next';
import { useRouter, NextRouter } from 'next/router';
import { useState } from 'react';
import DBClient from '../../utils/server/DBClient';
import axios from 'axios';
import { nanoid } from 'nanoid';
import Link from '../../components/Link';
import NewLinkForm from '../../components/NewLinkForm';
import SearchBar from '../../components/SearchBar';
import type { AppProps } from '@/types/components';

const TopicPage = ({ individualTopic }: AppProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState();
  const [newLink, setNewLink] = useState({
    url: '',
    category: '',
    tags: [],
  });

  const inputs = [
    { name: 'url', placeholder: 'paste website url here' },
    { name: 'tags', placeholder: 'add your tags here' },
  ];

  const categories = [
    { type: 'article', color: 'orange' },
    { type: 'website', color: 'violet' },
    { type: 'repository', color: 'darkorchid' },
    { type: 'tutorial', color: 'red' },
    { type: 'video', color: 'violet' },
    { type: 'resource', color: 'aquamarine' },
    { type: 'package', color: 'teal' },
    { type: 'library', color: 'fuchsia' },
  ];

  //get router info with props passed with Link component
  const router: NextRouter = useRouter();

  const {
    query: { name, currentAdminId },
  } = router;

  const handleChange = (e) =>
    setNewLink((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const addNewLink = async (e) => {
    e.preventDefault();

    await axios.put(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/api/topics/${individualTopic._id}`,
      { newLink, currentAdminId }
    );

    // close the modal and refresh the page to get updated server side props and display new added link
    setTimeout(() => {
      setOpen(false);
      router.reload();
    }, 500);
  };

  // handle search submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // update query state
    setSearch(e.target.search.value);

    e.target.search.value = '';
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
          newData={newLink}
          handleChange={handleChange}
          name={name as string}
          currentAdmin={currentAdminId}
          addNew={addNewLink}
          setOpen={setOpen}
          open={open}
          categories={categories}
          inputs={inputs}
        />
      )}

      <h1 className='font-medium leading-tight text-5xl mt-0 mb-5 text-blue-600 text-center'>
        {name}
      </h1>

      <SearchBar handleSubmit={handleSubmit} />

      {individualTopic.links.map((link) => (
        <Link
          search={search}
          key={nanoid()}
          link={link}
          currentAdmin={currentAdminId}
          categories={categories}
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
