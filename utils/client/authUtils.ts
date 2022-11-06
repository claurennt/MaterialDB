import axios from "axios";

//util function to send a login request to the backend
const sendAuthRequest = async (path, data) => {
  try {
    const { status } = await axios.post(`/api/auth/${path}`, {
      ...data,
    });
    console.log(status);
    if (status !== 200 || status !== 201) return false;

    return true;
  } catch (err) {
    console.log(err.message);
  }
};

export default sendAuthRequest;
