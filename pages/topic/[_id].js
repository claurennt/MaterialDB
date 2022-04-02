import { useRouter } from "next/router";
import DBClient from "../../utils/DBClient.js";
import axios from "axios";
import { nanoid } from "nanoid";
import Link from "../../components/Link";

const TopicPage = ({ individualTopic }) => {
  //get router info with props passed with Link component
  const router = useRouter();

  const { name } = router.query;

  const addNewLink = () => {
    //todo
  };
  return (
    <div>
      <button>add</button>
      <h1>{name}</h1>

      {individualTopic.links.map((link) => (
        <Link key={nanoid()} {...link} />
      ))}
    </div>
  );
};

export default TopicPage;

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_DEV_URL}/api/topics/`
  );
  console.log("dd", data);
  // Get the paths we want to pre-render based on posts
  const paths = data.map(({ _id }) => ({
    params: { _id: _id.toString() },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}
export async function getStaticProps({ params: { _id } }) {
  await DBClient();
  console.log("ok");
  try {
    /* find topic by id in our database */
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_DEV_URL}/api/topics/${_id}`
    );

    return { props: { individualTopic: data } };
  } catch (e) {
    console.log("fetch error", e);
  }
}
