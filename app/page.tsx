// app/page.tsx
import { getServerSession } from 'next-auth';

import { DBClient } from '../lib/server/DBClient';
import { Topic, Admin } from '@models';
import * as jose from 'jose';
import { SECRET } from '../globals';
import HomeClient from './home'; //
import { authOptions } from './api/auth/[...nextauth]/authOptions';

export default async function Page({
  searchParams,
}: {
  searchParams: { userId?: string };
}) {
  await DBClient();
  const session = await getServerSession(authOptions);
  let topics = [];

  try {
    // 1. Check if we are viewing someone else's profile via URL
    if (searchParams.userId) {
      topics = await Topic.find({ _creator: searchParams.userId });
    }
    // 2. Otherwise, check if the current user is logged in
    else if (session?.user?.access_token) {
      const {
        payload: { email },
      } = await jose.jwtVerify(session.user.access_token, SECRET);
      const user = await Admin.findOne({ email }).populate('topics');
      topics = user?.topics || [];
    }
  } catch (err) {
    console.error('Data fetching error:', err);
  }

  // Pass the server data into your Client Component
  return <HomeClient currentTopics={JSON.parse(JSON.stringify(topics))} />;
}
