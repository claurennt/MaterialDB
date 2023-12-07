import axios from 'axios';

import type { AuthRequestHandler } from '../../types/pages';

//util function to send an auth request to the backend
const sendAuthRequest: AuthRequestHandler = async (path, data = null) => {
  try {
    const { status } = await axios.post(
      `/api/auth/${path}`,
      data && {
        ...data,
      }
    );

    return status;
  } catch (err) {
    console.log(err.message);
  }
};

export { sendAuthRequest };
