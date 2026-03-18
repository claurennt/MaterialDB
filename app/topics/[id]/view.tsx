'use client';
import React, { useState, useRef, useMemo } from 'react';

import { useLiveRegion } from '@lib/client/hooks/useLiveRegion';
import { ILink } from '../../../types';

import '@models';
import { TopicLink } from '@components/TopicLink';
import { NewLinkModal } from '@components/NewLinkModal';
import { AddNewButton } from '@components/AddNewButton';
import { SearchBar } from '@components/SearchBar';
import { Header } from '@components/Header';
import { LiveRegion } from '@components/LiveRegion';

type TopicPageProps = {
  links: ILink[];
  topicName: string;
  isOwner: boolean;
  topicId?: string;
  isAuthenticated: boolean;
};

const TopicPage = ({ links, topicName, isOwner, topicId }: TopicPageProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const announceLiveRegionRef = useRef<boolean>(false);

  const totalCount = links?.length || 0;

  const { announcement } = useLiveRegion({ totalCount, type: 'link' });

  const handleFilterByTag = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const target = e.currentTarget;

    setActiveFilters((prev) => {
      const tagText = target.innerText.toLowerCase().replace(/\s*✓/g, '');
      const newTags = prev.filter((tag) => tag.toLowerCase() !== tagText);
      return prev.includes(tagText) ? newTags : [...newTags, tagText];
    });

    announceLiveRegionRef.current = true;
  };

  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      const matchesTags =
        activeFilters.length === 0 ||
        link.tags.some((tag) => activeFilters.includes(tag.toLowerCase()));

      const matchesSearch =
        !search || link.title.toLowerCase().includes(search.toLowerCase());

      return matchesTags && matchesSearch;
    });
  }, [links, activeFilters, search]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSearch(formData.get('search') as string);
  };

  const handleOpenModal = (open: boolean) => setOpenModal(open);

  return (
    <>
      <Header />
      <LiveRegion liveRegionContent={announcement} />
      <main>
        {isOwner && (
          <NewLinkModal
            topicId={topicId}
            handleOpenModal={handleOpenModal}
            open={openModal}
            type='link'
          />
        )}

        <div className='flex flex-col items-center text-center pt-10 gap-4 pb-10 mt-10'>
          <h1 className='leading-tight text-5xl mt-0 mb-5 text-primary-100 text-center pt-3'>
            {topicName}
          </h1>
          <div className='flex gap-7 justify-center items-center flex-col md:flex-row'>
            <SearchBar
              handleSearch={handleSearch}
              search={search}
              setSearch={setSearch}
            />

            {isOwner && (
              <>
                <span className='self-center md:self-end block'>OR </span>{' '}
                <AddNewButton text='link' handleOpenModal={handleOpenModal} />
              </>
            )}
          </div>
        </div>
        <ul className='flex flex-col mt-3 gap-5 mx-2'>
          {filteredLinks.map((link) => (
            <TopicLink
              key={link._id.toString()}
              link={link}
              activeFilters={activeFilters}
              search={search}
              handleFilterByTag={handleFilterByTag}
              isOwner={isOwner}
            />
          ))}
        </ul>
      </main>
    </>
  );
};

export default TopicPage;
