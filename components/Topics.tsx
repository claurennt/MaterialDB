import TopicCard from './TopicCard';
import styles from '../pages/index.module.css';
import { AppProps } from '@/types/components';

const Topics = ({ topicsArray }: AppProps) => {
  const { grid } = styles;

  return (
    <div className={grid}>
      {topicsArray?.map((topic) => (
        <TopicCard key={topic._id} {...topic} />
      ))}
    </div>
  );
};

export default Topics;
