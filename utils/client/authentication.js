import client from "./client";
import { getCookies, setCookies, removeCookies, getCookie } from "cookies-next";
import axios from "axios";
// const setAuthToken = (value) =>
//   setCookies(`${process.env.NEXT_PUBLIC_NAMESPACE}-auth-token`, value);

// const getAuthToken = () =>
//   getCookie(`${process.env.NEXT_PUBLIC_NAMESPACE}-auth-token`);

// const removeAuthToken = () =>
//   removeCookies(`${process.env.NEXT_PUBLIC_NAMESPACE}-auth-token`);

//util function to send a login request to the backend
const loginAdmin = async (loginData) => {
  try {
    /*makes a POST request to the login endpoint and 
    retrieves the x-authorization-token as token from the headers of the response */

    const { status } = await axios.post(
      "/api/auth/login",
      {
        ...loginData,
      },
      { withCredentials: true }
    );

    if (status !== 200) return false;

    return true;
  } catch (err) {
    console.log(err.message);
  }
};

export { loginAdmin };
