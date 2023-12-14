import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter, useSearchParams } from 'next/navigation';

import logo from 'public/logo.png';

const Register = () => {
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const toastId = useRef(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const registerAdmin = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!emailRef || !passwordRef || !usernameRef) return;

    const data = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      name: usernameRef.current.value,
    };

    const registrationPromise = axios.post('/api/auth/register', {
      ...data,
    });

    // show different toasts while request is being handled
    toast.promise(registrationPromise, {
      pending: {
        render: () => 'Registration request sent...',
        isLoading: true,
      },
      success: {
        type: toast.TYPE.INFO,
        render: () =>
          'User registration successfull. Check your inbox to activate your account...',
      },
      error: {
        render: () => 'Email or username already in use',
      },
    });
  };

  const activated = searchParams.get('activated');

  // show toast and re-directs the user to the login form after successful email activation
  useEffect(() => {
    let timerId: number;
    if (activated) {
      toastId.current = toast.success(
        'Your account has been activated! You are now being redirected to the login page...'
      );
      timerId = window.setTimeout(() => {
        router.push('/auth/login');
      }, 5000);
    }
    return () => clearTimeout(timerId);
  }, [searchParams, router, activated]);

  return (
    <>
      <div role='alert'>
        <span className='sr-only'>
          Your account has been activated! You are being redirected to the login
          form...
        </span>
      </div>
      <ToastContainer
        ref={toastId}
        position='top-center'
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
      />
      <div
        className={`flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 ${
          activated && 'blur-sm pointer-events-none' //blurs and disables background form after account activation
        }`}
      >
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <Image
            width='40'
            height='40'
            className='mx-auto h-10 w-auto'
            src={logo}
            alt='Your Company'
          />
          <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
            Sign in to your account
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form
            noValidate
            className='space-y-6 group'
            action='#'
            method='POST'
            onSubmit={registerAdmin}
          >
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Email address*
              </label>
              <div className='mt-2'>
                <input
                  ref={emailRef}
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
                <span className='mt-2 hidden text-sm text-red-500 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block'>
                  Please enter a valid email address
                </span>
              </div>
            </div>
            <div>
              <label
                htmlFor='username'
                className='block text-sm font-medium leading-6 text-gray-900'
              >
                Username*
              </label>
              <div className='mt-2'>
                <input
                  ref={usernameRef}
                  id='username'
                  name='username'
                  type='text'
                  autoComplete='username'
                  required
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Password*
                </label>
                <div className='text-sm'>
                  <a
                    href='#'
                    className='font-semibold text-indigo-600 hover:text-indigo-500'
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className='mt-2'>
                <input
                  ref={passwordRef}
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                />
              </div>
            </div>

            <div>
              <button
                type='submit'
                className={`flex w-full justify-center rounded-md bg-primary-200${
                  passwordRef && usernameRef && emailRef ? '' : 'opacity-30' //blurs and deactivates the button if input values are missing
                } px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 group-invalid:pointer-events-none group-invalid:opacity-30`}
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default Register;
