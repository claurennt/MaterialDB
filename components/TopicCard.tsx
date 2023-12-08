import Link from 'next/link';
import styles from 'pages/index.module.css';
import { IndividualTopic } from 'types/pages';

const TopicCard = ({ name, _id, description }: IndividualTopic) => {
  const { card } = styles;

  const lowerCaseName = name.toLowerCase();
  const src = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${lowerCaseName}/${lowerCaseName}-original.svg`;

  return (
    <Link
      className={card}
      href={{
        pathname: '/topics/[_id]',
        query: {
          _id: _id,
          // currentAdminId: currentAdmin?._id,
          name: name,
        },
      }}
      key={_id}
    >
      <img src={src} height='20px' width='20px' />
      <h3>{name}</h3>
      <p>{description}</p>
    </Link>
  );
};

export default TopicCard;
