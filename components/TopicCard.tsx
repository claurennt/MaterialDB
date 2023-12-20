import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from 'pages/index.module.css';

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

  const src = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${lowerCaseName}/${lowerCaseName}-original.svg`;

  const onImageError = (e) => {
    e.target.src =
      'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/codepen/codepen-plain.svg';
  };
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
        height='40'
        width='40'
        alt={`icon for ${lowerCaseName}`}
        onError={onImageError}
      />
      <h3>{name}</h3>
      <p>{description}</p>
    </Link>
  );
};

export default TopicCard;
