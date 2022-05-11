import Head from "next/head";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import DBClient from "../utils/server/DBClient.js";
import { Topic } from "../models/Topic.js";
import NewLinkForm from "../components/NewLinkForm.jsx";
import LoginForm from "../components/LoginForm.jsx";
import styles from "./index.module.css";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import getLoggedinAdmin from "../utils/client/getLoggedinAdmin.js";
import withSession from "../utils/server/withSession.js";

export default function Home() {
  const { title, container, description, grid, card } = styles;

  const [open, setOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [retrievedTopics, setRetrievedTopics] = useState();
  const [newTopic, setNewTopic] = useState({
    name: "",
    description: "",
  });
  const inputs = [
    { name: "name", placeholder: "Name of the topic" },
    { name: "description", placeholder: "add a short intro to the topic" },
  ];

  //get router info with props passed with Link component
  const { query } = useRouter();

  //GET request to the protected endpoint in the backend to get information about the current user
  const getCurrentUserContext = async () => {
    const { initialAdmin } = getLoggedinAdmin();
    try {
      if (!initialAdmin && !query) {
        const { data } = await axios.get("/api/auth/me");

        setCurrentUser(data);
        localStorage.setItem("currentUser", JSON.stringify(data));
      } else setCurrentUser(initialAdmin);
    } catch (err) {
      console.log("No user is authenticated at the moment", err.message);
    }
  };

  useEffect(() => {
    const getTopicsByUrlParams = async () => {
      const { data } = await axios.get(`/api?userId=${query.userId}`);

      setRetrievedTopics(data);
    };
    if (query.userId) getTopicsByUrlParams();
  }, []);

  useEffect(() => {
    getCurrentUserContext();
  }, []);

  const handleChange = (e) =>
    setNewTopic((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const addNewTopic = async (e) => {
    e.preventDefault();

    const { data: updatedAdmin } = await axios.post("/api/topics", {
      newTopic,
      creatorId: currentUser._id,
    });

    setOpen(false);
    setListOfTopics(updatedAdmin.topics);
  };

  const handleClick = async (e) => {
    if (e.target.name === "logout") {
      await axios.post("/api/auth/logout");
    }
    localStorage.removeItem("currentUser");
    setOpenPanel(!openPanel);
    setCurrentUser();
  };
  const topicsArray = currentUser?.topics ?? retrievedTopics;

  return (
    <div className={container}>
      <Head>
        <title>MaterialDB</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <LoginForm
          open={openPanel}
          setOpen={setOpenPanel}
          //   setIsAdminAuthenticated={setIsAdminAuthenticated}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold  px-4 rounded-full absolute right-0 top-0 m-4"
          name={!currentUser ? "login" : "logout"}
          onClick={handleClick}
        >
          {!currentUser ? "login" : "logout"}
        </button>
        <h1 className={title}>
          Welcome to <span>MaterialDB!</span>
        </h1>
        <h2>
          MaterialDB is an app where you can collect useful links and resources
          that help you become a better <span>developer/instructor</span>.
        </h2>
        <p className={description}>
          If you wanna see a list of resources pick a topic below.
        </p>

        <div className={grid}>
          {topicsArray?.map(({ name, _id, description, subtopics }) => {
            return (
              <Link
                href={{
                  pathname: "/topics/[_id]",
                  query: {
                    _id: _id,
                    currentUser: currentUser?._id,
                    name: name,
                  },
                }}
                key={_id}
              >
                <a className={card}>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </a>
              </Link>
            );
          })}
        </div>
      </main>
      {currentUser && (
        <button
          className="bg-blue-600 absolute bottom-0 right-0 p-1 text-lg "
          onClick={() => setOpen(true)}
        >
          +
        </button>
      )}
      {open && (
        <NewLinkForm
          inputs={inputs}
          open={open}
          setOpen={setOpen}
          handleChange={handleChange}
          addNew={addNewTopic}
          //      setIsAdminAuthenticated={setIsAdminAuthenticated}
        />
      )}
      <footer>made with love by claurennt</footer>
    </div>
  );
}

// export const getServerSideProps = withSession(async ({ req, res }) => {
//   const myCookie = req.cookies.MaterialDB;
//   /* find all the data in our database */
//   const { data } = await axios.get(
//     `${process.env.NEXTAUTH_URL}/api/auth/me`,
//     { headers: { Authorization: myCookie } }
//   );
//   console.log("dddddd", data);
//   // const r = await axios.get(`${process.env.NEXTAUTH_URL}/api/auth/me`);
//   // console.log("r", r);
//   return { props: { currentAdmin: data || [] } };
// });
