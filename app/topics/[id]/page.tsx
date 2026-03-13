import { Metadata } from 'next';
import { DBClient } from 'app/lib/server/DBClient';
import { Link } from '@models';
import View from './view';
import { authOptions } from 'app/api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth';

const getLinks = async ({ userId, id }: { userId: string; id: string }) => {
  await DBClient();

  const links = await Link.find({ _creator: userId, _topic: id })
    .sort({ createdAt: -1 })
    .select('title tags _id url')
    .lean();

  return JSON.parse(JSON.stringify(links));
};

export function generateMetadata({
  searchParams,
}: {
  searchParams: { name: string };
}): Metadata {
  const { name } = searchParams;
  return {
    title: name,
  };
}
export default async function Page({
  searchParams: { userId, name },
  params: { id },
}: {
  searchParams: { userId?: string; name: string };
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  const currentUserId = userId || session?.user?.id; // If no userId in URL, use session ID

  if (!currentUserId) {
    return (
      <View
        links={[]}
        isOwner={false}
        topicName={name}
        isAuthenticated={false}
      />
    );
  }

  try {
    const links = await getLinks({ userId: currentUserId, id });

    const isOwner = !userId || session?.user?.id === userId;
    return (
      <View
        links={links}
        isOwner={isOwner}
        topicName={name}
        topicId={id}
        isAuthenticated={!!session}
      />
    );
  } catch (err) {
    console.error('Data fetching error:', err);
    return (
      <View
        links={[]}
        isOwner={false}
        topicName={name}
        isAuthenticated={false}
      />
    );
  }
}
