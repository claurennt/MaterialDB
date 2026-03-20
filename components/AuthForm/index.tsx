'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@lib/client/hooks/useAuth';
import { AuthInput } from '@components/AuthInput';
import { AuthFeedback } from '@components/AuthFeedback';
import { Credentials } from '../../types';
import styles from '../../styles/index.module.css';
interface AuthFormProps {
  mode: 'login' | 'register';
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const authFeedbackRef = useRef<HTMLDivElement>(null);
  const { authAction, isError, setAuthFeedback, message } = useAuth();

  useEffect(() => {
    if (!message) return;
    authFeedbackRef.current?.focus();
  }, [message]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData) as unknown as Credentials;
    const { username, email, password } = data;

    const canSubmit =
      mode === 'register'
        ? email && username && password
        : username && password;

    if (!canSubmit) {
      setAuthFeedback({
        isError: true,
        message: `${mode === 'register' ? 'Email, ' : ''}Username and Password are required`,
      });
      return;
    }

    await authAction(mode, data);
  };

  const handleChange = () => setAuthFeedback({ isError: false, message: '' });

  const linkText =
    mode === 'login'
      ? "Don't have an account? Register"
      : 'Already have an account? Login';

  const buttonText = mode === 'login' ? 'Sign In' : 'Create Account';

  return (
    <>
      {/* After successful creation of a new account only the feedback message should be shown */}
      <AuthFeedback isError={isError} message={message} ref={authFeedbackRef} />

      {mode === 'register' && message && !isError ? null : (
        <form onSubmit={handleSubmit} className='space-y-6 flex flex-col gap-2'>
          {mode === 'register' && (
            <AuthInput
              type='email'
              isError={isError}
              handleChange={handleChange}
            />
          )}

          <AuthInput
            type='username'
            isError={isError}
            handleChange={handleChange}
          />
          <AuthInput
            type='password'
            isError={isError}
            handleChange={handleChange}
          />

          <button
            type='submit'
            className='w-full rounded-md bg-primary-200 py-2.5 text-black font-semibold disabled:opacity-50'
          >
            {buttonText}
          </button>

          <div className='text-center text-sm'>
            <Link
              href={`${mode === 'login' ? 'register' : 'login'}`}
              className={styles.auth_nav_link}
            >
              {linkText}
            </Link>
          </div>
        </form>
      )}
    </>
  );
};
