import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from 'pages/index.module.css';
import { getIconName } from '../../utils/client';
import { useSearchParams } from 'next/navigation';
type TopicCardProps = {
  name: string;
  _id: string;
  description: string;
};

export const TopicCard: React.FunctionComponent<TopicCardProps> = ({
  name,
  _id,
  description,
}) => {
  const { card } = styles;

  const lowerCaseName = name?.toLowerCase();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const correctIconName = getIconName(lowerCaseName);
  const src = correctIconName
    ? `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${correctIconName}/${correctIconName}-original.svg`
    : `https://img.icons8.com/ios-filled/50/fd5244/${
        name.startsWith('UX') ? 'illustrator--v1' : 'source-code'
      }.png`;

  return (
    <Link
      className={card}
      href={{
        pathname: '/topics/[_id]',
        query: {
          _id,
          name,
          userId,
        },
      }}
      key={_id}
    >
      <Image src={src} height='50' width='50' aria-hidden='true' alt='' />
      <h3>{name}</h3>
      <p>{description}</p>
    </Link>
  );
};
