import Head from "next/head";
import Link from "next/link";

import DBClient from "../utils/DBClient.js";
import { Topic } from "../models/Models.js";

import styles from "./index.module.css";

export default function Home({ topics }) {
  const { title, container, description, grid, card } = styles;

  return (
    <div className={container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
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
          {topics.map(({ name, _id, description, subtopics, links }) => (
            <Link
              href={{
                pathname: "topic/[_id]",
                query: {
                  _id: _id,
                  subtopics: subtopics,
                  links: links,
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
          ))}
        </div>
      </main>

      <footer>made with love by claurennt</footer>
    </div>
  );
}

export async function getServerSideProps() {
  await DBClient();
  /* find all the data in our database */
  const topics = await Topic.find({});
  const serializedTopics = JSON.parse(JSON.stringify(topics));

  //serialize data to pass down as props
  return { props: { topics: serializedTopics } };
}
