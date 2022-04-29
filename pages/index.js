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

export default function Home({ topics }) {
  const { title, container, description, grid, card } = styles;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [open, setOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);
  const [currentUser, setCurrentUser] = useState();

  const [newTopic, setNewTopic] = useState({
    name: "",
    description: "",
  });
  const inputs = [
    { name: "name", placeholder: "Name of the topic" },
    { name: "description", placeholder: "add a short intro to the topic" },
  ];

  //get router info with props passed with Link component
  const router = useRouter();
  //GET request to the protected endpoint in the backend to get information about the current user
  const getCurrentUserContext = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/auth/me");

      setCurrentUser(data);
      localStorage.setItem("currentUser", JSON.stringify(data));
    } catch (err) {
      console.log("No user is authenticated at the moment", err.message);
    }
  }, []);

  useEffect(() => {
    //if there is a token we get the current user context from the backend
    const currentUserData = localStorage.getItem("currentUser");

    getCurrentUserContext();
  }, [getCurrentUserContext]);

  const handleChange = (e) =>
    setNewTopic((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const addNewTopic = async (e) => {
    e.preventDefault();

    await axios.post("/api/topics", {
      newTopic,
      _id: currentUser._id,
    });
    // close the modal and refresh the page to get updated server side props and display new added link
    setTimeout(() => {
      setOpen(false);
      router.reload(window.location.pathname);
    }, 500);
  };

  const handleClick = async (e) => {
    if (e.target.name === "logout") {
      await axios.post("/api/auth/logout");
    }
    setOpenPanel(!openPanel);
  };
  const topicsArray = topics ?? currentUser.topics;
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
          setIsAuthenticated={setIsAuthenticated}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold  px-4 rounded-full absolute right-0 top-0 m-4"
          name={!isAuthenticated ? "login" : "logout"}
          onClick={handleClick}
        >
          {!isAuthenticated ? "Log In" : "Log Out"}
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
          {topicsArray.map(({ name, _id, description, subtopics }) => {
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
      {isAuthenticated && (
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
          setIsAuthenticated={setIsAuthenticated}
        />
      )}
      <footer>made with love by claurennt</footer>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  await DBClient();
  console.log(query);
  /* find all the data in our database */
  const { data: topics } = await axios.get(
    `${process.env.NEXT_PUBLIC_DEV_URL}/api/topics?currentUser=${query.currentUser}`
  );
  console.log(topics);
  return { props: { topics: topics } };
}
