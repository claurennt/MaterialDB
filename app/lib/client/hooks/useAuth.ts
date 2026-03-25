import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { registerAdmin } from '@actions/admins';
import { Credentials } from '../../../../types';

export const useAuth = () => {
  const [authFeedback, setAuthFeedback] = useState<{
    isError: boolean;
    message: string;
  }>({
    isError: false,
    message: '',
  });
  const router = useRouter();

  const authAction = async (type: 'login' | 'register', data: Credentials) => {
    setAuthFeedback({ isError: false, message: '' });

    try {
      if (type === 'login') {
        const result = await signIn('credentials', {
          ...data,
          redirect: false,
        });

        if (!result?.ok) {
          throw new Error(result?.error ?? 'An error occurred during login.');
        }

        setAuthFeedback((prev) => ({
          ...prev,
          message: 'Login successful! Redirecting...',
        }));

        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 3000);
      } else {
        const result = await registerAdmin(data);
        if (result?.error) throw new Error(result.error);

        setAuthFeedback((prev) => ({
          ...prev,
          isError: false,
          message: 'Account created! Please check your email.',
        }));
      }
    } catch (err) {
      setAuthFeedback({
        isError: true,
        message: (err as any).message,
      });
    }
  };

  return { authAction, setAuthFeedback, ...authFeedback };
};
