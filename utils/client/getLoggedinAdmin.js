const getLoggedinAdmin = () => {
  //wait for the browser to load the window otherwise localStorage is not defined in NextJS
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("currentUser");
    const loggedInAdmin = JSON.parse(data);

    return {
      initialAdmin: loggedInAdmin || null,
      isAdminAuthenticated: loggedInAdmin ? true : false,
    };
  }
};

export default getLoggedinAdmin;
