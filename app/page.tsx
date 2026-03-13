import { getServerSession } from 'next-auth';
import { DBClient } from 'app/lib/server/DBClient';
import { Topic } from '@models';
import Home from './home';
import { authOptions } from './api/auth/[...nextauth]/authOptions';

const getTopics = async (userId: string) => {
  await DBClient();

  const topics = await Topic.find({ _creator: userId })
    .select('name description _id')
    .lean();

  return JSON.parse(JSON.stringify(topics));
};

export default async function Page({
  searchParams,
}: {
  searchParams: { userId?: string };
}) {
  const { userId } = searchParams;
  const session = await getServerSession(authOptions);
  const id = userId || session?.user?.id; // If no userId in URL, use session ID

  if (!id) {
    return <Home topics={[]} isOwner={false} isAuthenticated={false} />;
  }

  try {
    const topics = await getTopics(id);

    const isOwner = !userId || session?.user?.id === userId;

    return (
      <Home
        topics={topics}
        isOwner={isOwner}
        userId={id}
        isAuthenticated={!!session}
      />
    );
  } catch (err) {
    console.error('Data fetching error:', err);
    return <Home topics={[]} isOwner={false} isAuthenticated={false} />;
  }
}
