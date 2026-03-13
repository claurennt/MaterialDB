import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { registerAdmin } from '@actions/admins';
import { Credentials } from 'types/components';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authFeedback, setAuthFeedback] = useState<{
    isError: boolean;
    message: string;
  }>({
    isError: false,
    message: '',
  });

  const router = useRouter();

  const authAction = async (type: 'login' | 'register', data: Credentials) => {
    setIsLoading(true);
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
        router.refresh();

        // Technical Redirect
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        const result = await registerAdmin(data);
        if (result?.error) throw new Error(result.error);

        setAuthFeedback((prev) => ({
          ...prev,
          isError: false,
          message: 'Account created successfully! Please check your email.',
        }));
      }
    } catch ({ message }) {
      setAuthFeedback({
        isError: true,
        message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { authAction, isLoading, setAuthFeedback, ...authFeedback };
};
