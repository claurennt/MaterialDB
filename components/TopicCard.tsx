import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from 'pages/index.module.css';
import { iconsNames, getIconName } from '../utils/client/iconNames';
type TopicCardProps = {
  name: string;
  _id: string;
  description: string;
};

const TopicCard: React.FunctionComponent<TopicCardProps> = ({
  name,
  _id,
  description,
}) => {
  const { card } = styles;

  const lowerCaseName = name?.toLowerCase();

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
          _id: _id,
          name: name,
        },
      }}
      key={_id}
    >
      <Image
        src={src}
        height='50'
        width='50'
        alt={`icon for ${correctIconName ?? name}`}
      />
      <h3>{name}</h3>
      <p>{description}</p>
    </Link>
  );
};

export default TopicCard;
