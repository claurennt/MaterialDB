import Head from "next/head";
import { useState, Fragment } from "react";
import Link from "next/link";
import axios from "axios";

import NewLinkForm from "../components/NewLinkForm.jsx";
import LoginForm from "../components/LoginForm.jsx";
import styles from "./index.module.css";

export default function Home({ currentAdminSession, currentTopics }) {
  const { title, container, description, grid, card } = styles;

  const [open, setOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(currentAdminSession);
  const [retrievedTopics, _] = useState(currentTopics);

  const handleClick = async (e) => {
    if (e.target.name === "logout") {
      await axios.post("/api/auth/logout");
    }

    setOpenPanel(!openPanel);
    setCurrentAdmin();
  };

  const topicsArray = currentAdmin?.topics || retrievedTopics;

  return (
    <div className={container}>
      <Head>
        <title>MaterialDB</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <LoginForm
          openPanel={openPanel}
          setOpenPanel={setOpenPanel}
          currentAdmin={currentAdmin}
          setCurrentAdmin={setCurrentAdmin}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold  px-4 rounded-full absolute right-0 top-0 m-4"
          name={!currentAdmin ? "login" : "logout"}
          onClick={handleClick}
        >
          {!currentAdmin ? "login" : "logout"}
        </button>
        {currentAdmin ? (
          <h1 className={title}>
            Welcome back to your <span>MaterialDB</span> {currentAdmin.username}
            !
          </h1>
        ) : (
          <h1 className={title}>
            Welcome to <span>MaterialDB!</span>
          </h1>
        )}
        <h2>
          MaterialDB is an app where you can collect useful links and resources
          that help you become a better <span>developer/instructor</span>.
        </h2>
        <p className={description}>
          If you wanna see a list of resources pick a topic below.
        </p>

        <div className={grid}>
          {topicsArray?.map(({ name, _id, description, subtopics }) => (
            <Fragment key={_id}>
              <Link
                href={{
                  pathname: "/topics/[_id]",
                  query: {
                    _id: _id,
                    currentUser: currentAdmin?._id,
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
            </Fragment>
          ))}
        </div>
      </main>
      {currentAdmin && (
        <button
          className="bg-blue-600 absolute bottom-0 right-0 p-1 text-lg "
          onClick={() => setOpen(true)}
        >
          +
        </button>
      )}
      {open && (
        <NewLinkForm
          open={open}
          setOpen={setOpen}
          currentAdmin={currentAdmin}
          setCurrentAdmin={setCurrentAdmin}
        />
      )}
      <footer>made with love by claurennt</footer>
    </div>
  );
}

//pre-render page with server side props
export async function getServerSideProps({
  query: { userId },
  req: {
    headers: { cookie },
  },
}) {
  console.log("here");
  // if the url has a userId parameter send a request to api/topics?userId=${userId}
  if (userId) {
    const { data } = await axios.get(
      `${process.env.NEXTAUTH_URL}/api/topics?userId=${userId}`
    );
    return { props: { currentTopics: data } };
  } else {
    /* retrieve current logged in user */
    const { data } = await axios.get(
      `${process.env.NEXTAUTH_URL}/api/auth/session`,
      {
        headers: {
          Cookie: cookie,
        },
      },
      { withCredentials: true }
    );
    return { props: { currentAdminSession: data || [] } };
  }
}
