import { useState } from 'react';

import sendAuthRequest from './authUtils';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { HandleUserAuth, SetAuthState, EventTarget } from '@/types/components';

const useAuthHook = () => {
  const [loginData, setLoginData] = useState<undefined | {}>();
  const [registerData, setRegisterData] = useState<undefined | {}>();
  const [openAuthModal, setOpenAuthModal] = useState<{
    login: boolean;
    register: boolean;
  }>({
    login: false,
    register: false,
  });

  const router = useRouter();

  const handleLoginData: HandleUserAuth = (e) => {
    const target: EventTarget = e.target;

    setLoginData((prevLoginData) => ({
      ...prevLoginData,
      [target.name]: target.value,
    }));
  };

  const handleRegisterData: HandleUserAuth = (e) => {
    const target: EventTarget = e.target;

    setRegisterData((prevLoginData) => ({
      ...prevLoginData,

      [target.name]: target.value,
    }));
  };

  const handleLoginRequest: HandleUserAuth = async (e) => {
    e.preventDefault();
    const isLoginSuccessfull = await sendAuthRequest('login', loginData);

    if (isLoginSuccessfull) {
      setOpenAuthModal((prev) => ({ ...prev, login: false }));

      router.reload();
    } else {
      alert('Login Failed');
    }
  };

  const handleRegisterRequest: HandleUserAuth = async (e) => {
    e.preventDefault();
    const isRegistrationPending = await sendAuthRequest(
      'register',
      registerData
    );
    console.log(isRegistrationPending);
    setOpenAuthModal((prev) => ({ ...prev, register: false }));

    return isRegistrationPending
      ? alert('A confirmation email has been sent to your email address')
      : alert('A user with this email and/or username already exists');
  };

  return {
    handleRegisterData,
    handleLoginData,
    handleLoginRequest,
    handleRegisterRequest,
    openAuthModal,
    setOpenAuthModal,
  };
};

export default useAuthHook;
