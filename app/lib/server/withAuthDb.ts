import { DBClient } from 'app/lib/server/DBClient';
import { authOptions } from 'app/api/auth/[...nextauth]/authOptions';
import { getServerSession } from 'next-auth';

type ActionCallback<T> = (args: { userId: string; data: any }) => Promise<T>;

export const withAuthDb =
  <T>(callback: ActionCallback<T>) =>
  async (data: any = {}) => {
    try {
      const session = await getServerSession(authOptions);

      if (!session) {
        throw new Error(
          'Unauthorized: You do not have the rights to perform this operation.',
        );
      }

      await DBClient();

      return await callback({ userId: session.user.id, data });
    } catch (error) {
      console.error('Server Action Error:', error.message);
      throw new Error(error.message || 'SERVER_ERROR');
    }
  };
