import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { getIconName } from '@lib/client';
import { useSearchParams } from 'next/navigation';
import { ObjectId } from 'mongoose';

type TopicCardProps = {
  name: string;
  _id: ObjectId;
  description: string;
};

export const TopicCard: React.FunctionComponent<TopicCardProps> = ({
  name,
  _id,
  description,
}) => {
  const lowerCaseName = name?.toLowerCase();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const correctIconName = getIconName(lowerCaseName);
  const src = correctIconName
    ? `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${correctIconName}/${correctIconName}-original.svg`
    : name.toLowerCase().includes('accessibility') ||
        name.toLowerCase().includes('a11y')
      ? '/a11y.svg'
      : `https://img.icons8.com/ios-filled/50/fd5244/${
          name.startsWith('UX') ? 'illustrator--v1' : 'source-code'
        }.png`;
  const href = userId
    ? `/topics/${_id}?userId=${userId}&name=${encodeURIComponent(name)}`
    : `/topics/${_id}?name=${encodeURIComponent(name)}`;
  return (
    <li>
      <Link
        href={href}
        key={_id}
        className='
          flex flex-col gap-5 justify-center 
          px-5 text-center my-8 mx-auto 
          w-[250px] h-[250px] rounded-[40px] 
          bg-[#1a1a1a] 
          border-2 border-[var(--primary-color-neon)]
          shadow-[5px_5px_30px_7px_rgba(0,0,0,0.25),-5px_-5px_30px_7px_rgba(0,0,0,0.22)]
          transition-all duration-400 cursor-pointer
          hover:outline hover:outline-4 hover:outline-[var(--secondary-color)]
          focus-visible:outline focus-visible:outline-4 focus-visible:outline-[var(--secondary-color)]
          active:bg-[var(--primary-color-neon)]
          active:outline active:outline-2
        '
      >
        <Image
          src={src}
          height={50}
          width={50}
          alt=''
          className='rounded-full mx-auto'
        />
        <h3 className='text-center font-bold text-[1.2rem] font-sans'>
          {name}
        </h3>
        <p className='text-sm opacity-80'>{description}</p>
      </Link>
    </li>
  );
};
