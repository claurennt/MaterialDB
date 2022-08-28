import { useState } from "react";

import sendAuthRequest from "./authUtils";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const useAuthHook = () => {
  const [loginData, setLoginData] = useState();
  const [registerData, setRegisterData] = useState();
  const [openAuthModal, setOpenAuthModal] = useState({
    login: false,
    register: false,
  });

  const router = useRouter();

  const handleLoginData = (e) => {
    setLoginData((prevLoginData) => ({
      ...prevLoginData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegisterData = (e) => {
    setRegisterData((prevLoginData) => ({
      ...prevLoginData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLoginRequest = async (e) => {
    e.preventDefault();
    const isLoginSuccessfull = await sendAuthRequest("login", loginData);

    if (isLoginSuccessfull) {
      setOpenAuthModal((prev) => ({ ...prev, login: false }));

      router.reload(window.location.pathname);
    } else {
      alert("Login Failed");
    }
  };

  const handleRegisterRequest = async (e) => {
    e.preventDefault();
    const isRegistrationPending = await sendAuthRequest(
      "register",
      registerData
    );
    console.log(isRegistrationPending);
    setOpenAuthModal((prev) => ({ ...prev, register: false }));

    return isRegistrationPending
      ? alert("A confirmation email has been sent to your email address")
      : alert("A user with this email and/or username already exists");
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
