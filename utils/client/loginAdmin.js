import axios from "axios";

//util function to send a login request to the backend
const loginAdmin = async (loginData) => {
  try {
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
