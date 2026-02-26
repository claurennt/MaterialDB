import { DBClient } from 'app/lib/server/DBClient';

export const withDb =
  <T extends any[], R>(callback: (...args: T) => Promise<R>) =>
  async (...args: T): Promise<R> => {
    try {
      await DBClient();

      return await callback(...args);
    } catch (error: any) {
      console.error('Database/Action Error:', error.message);

      return { error: error.message || 'SERVER_ERROR' } as R;
    }
  };
