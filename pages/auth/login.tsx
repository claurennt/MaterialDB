import React, { useRef } from 'react';
import { signIn } from 'next-auth/react';

import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import Image from 'next/image';

import 'react-toastify/dist/ReactToastify.css';
import logo from 'public/logo.png';

const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const toastId = useRef(null);

  const router = useRouter();

  const loginAdmin = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!emailRef || !passwordRef) return;

    const data = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    // signIn function from NextAuth api that trigggers the authorization-jwt-session flow
    const { error, url } = await signIn('credentials', {
      ...data,
      callbackUrl: '/',
      redirect: false,
    });

    if (error) {
      emailRef.current.value = '';
      passwordRef.current.value = '';
      toast.error(
        'Invalid credentials. Please make sure you enter correct login data!'
      );
      emailRef.current.focus();
    } else {
      toast.success(
        'Successful login! You are being redirected to your topics dashboard'
      );
      setTimeout(() => {
        router.push(url);
      }, 2000);
    }
  };

  return (
    <>
      <ToastContainer
        ref={toastId}
        position='top-center'
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        aria-live='assertive'
      />
      <div className='flex flex-1 flex-col justify-center px-6 py-12 lg:px-8  text-white h-screen items-center '>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <Image
            width='40'
            height='40'
            className='mx-auto h-10 w-auto'
            src={logo}
            alt=''
          />
          <h2 className='mt-8 text-center text-2xl font-bold leading-9 tracking-tight '>
            Sign in to your account
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form
            className='space-y-6'
            action='#'
            method='POST'
            onSubmit={loginAdmin}
          >
            <fieldset className='flex flex-1 flex-col gap-8'>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium leading-6 '
                >
                  Email address
                </label>
                <div className='mt-2'>
                  <input
                    ref={emailRef}
                    id='email'
                    name='email'
                    type='email'
                    autoComplete='email'
                    required
                    className='block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 text-gray-900'
                  />
                </div>
              </div>

              <div>
                <div className='flex items-center justify-between'>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium leading-6'
                  >
                    Password
                  </label>
                  <div className='text-sm'>
                    <a
                      href='#'
                      className='font-semibold text-primary-100 hover:text-primary-200'
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
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-100 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div>
                <button
                  type='submit'
                  className='text-white flex w-full justify-center rounded-md bg-primary-100 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                >
                  Sign in
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
};
export default Login;
