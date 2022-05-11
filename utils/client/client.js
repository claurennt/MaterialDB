import axios from "axios";
import { getAuthToken } from "./authentication";
const authBaseURL = process.env.NEXTAUTH_URL;
//creates a new instance of axios to use with the interceptors
const client = axios.create({ authBaseURL });

// /*everytime we do a request to our new axios instance we intercept it, check if there is a token stored in the Cookies
// (meaning the user is authenticated) and if there is we add it to the headers of the request*/
// client.interceptors.request.use(
//   (req) => {
//     // const token = getAuthToken();
//     // //we set the headers that will be verified in the backend by jwt
//     // if (token) req.headers.authorization = `Bearer ${token}`;
//     console.log("client re", req.cookie);
//     return req;
//   },
//   (err) => {
//     Promise.reject(err);
//   }
// );

// //we can use the response interceptors to notfy the user of an unsuccessful login
// client.interceptors.response.use(
//   (req) => req,
//   (err) => {
//     //TODO: add toast
//     console.log(err.response);
//     if (err.response.status === 401 || err.response.status === 403)
//       throw new Error("Error in the response");
//     throw Error;
//   }
// );

export default client;
