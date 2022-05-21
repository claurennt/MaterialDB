import axios from "axios";

//util function to send a login request to the backend
const loginAdmin = async (loginData) => {
  try {
    /*makes a POST request to the login endpoint and 
    retrieves the x-authorization-token as token from the headers of the response */

    const { status } = await axios.post("/api/auth/login", {
      ...loginData,
    });

    if (status !== 200) return false;

    return true;
  } catch (err) {
    console.log(err.message);
  }
};

export default loginAdmin;
