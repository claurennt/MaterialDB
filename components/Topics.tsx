import React from 'react';
import TopicCard from './TopicCard';

import { ITopic } from 'types/mongoose';

type TopicsProps = { topicsArray: ITopic[] | {}[] };

const Topics: React.FunctionComponent<TopicsProps> = ({ topicsArray }) => {
  return (
    <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-6 gap-8'>
      {topicsArray.map((topic: ITopic) => (
        <TopicCard key={topic._id} {...topic} />
      ))}
    </div>
  );
};

export default Topics;
