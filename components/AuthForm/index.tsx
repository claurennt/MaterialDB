'use client';
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@lib/client';
import { AuthInput, ErrorMessage } from '@components';
import Link from 'next/link';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const errorBoxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { authAction, error, setError } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));

    const r = await authAction(mode, data);

    if (r?.success) router.push(mode === 'login' ? '/' : '/');
  };

  useEffect(() => {
    if (error) errorBoxRef.current?.focus();
  }, [error]);

  const handleChange = () => setError(null);

  const linkText =
    mode === 'login'
      ? "Don't have an account? Register"
      : 'Already have an account? Login';

  const buttonText = mode === 'login' ? 'Sign In' : 'Create Account';

  return (
    <>
      <ErrorMessage error={error} ref={errorBoxRef} />

      <form onSubmit={handleSubmit} className='space-y-6 flex flex-col gap-2'>
        {mode === 'register' && (
          <AuthInput
            type='email'
            isError={!!error}
            handleChange={handleChange}
          />
        )}

        <AuthInput
          type='username'
          isError={!!error}
          handleChange={handleChange}
        />
        <AuthInput
          type='password'
          isError={!!error}
          handleChange={handleChange}
        />

        <button
          type='submit'
          className='w-full rounded-md bg-primary-200 py-2.5 text-black font-semibold disabled:opacity-50 focus-within:outline focus:outline-2 focus:outline-secondary-100 focus:outline-offset-4'
        >
          {buttonText}
        </button>

        <div className='text-center text-sm'>
          <Link
            href={`${mode === 'login' ? 'register' : 'login'}`}
            className='font-semibold text-secondary-100 focus:outline focus:outline-2 focus:outline-offset-4 focus:outline-primary-100 underline underline-offset-2'
          >
            {linkText}
          </Link>
        </div>
      </form>
    </>
  );
};
