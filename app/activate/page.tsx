import { redirect } from 'next/navigation';
import { activateAccount } from '@actions/admins';
import { View } from './view';

interface PageProps {
  searchParams: { token?: string };
}

export default async function ActivatePage({ searchParams }: PageProps) {
  const { token } = searchParams;

  if (!token) redirect('/');

  // Execute the activation immediately on the server
  const result = await activateAccount(token);

  return <View result={result} />;
}
