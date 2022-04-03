import Head from "next/head";
import Link from "next/link";
import axios from "axios";
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
          {topics.map(({ name, _id, description, subtopics, links }) => {
            return (
              <Link
                href={{
                  pathname: "topics/[_id]",
                  query: {
                    _id: _id,
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

      <footer>made with love by claurennt</footer>
    </div>
  );
}

export async function getStaticProps() {
  await DBClient();

  /* find all the data in our database */
  const { data: topics } = await axios.get(
    `${process.env.NEXT_PUBLIC_DEV_URL || process.env.PORT}/api/topics`
  );

  return { props: { topics: topics } };
}
