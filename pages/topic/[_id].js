import { useRouter } from "next/router";
import DBClient from "../../utils/DBClient.js";
import axios from "axios";
import { nanoid } from "nanoid";
import Link from "../../components/Link";

const { NEXT_PUBLIC_DEV_URL } = process.env;

const TopicPage = ({ links }) => {
  //get router info with props passed with Link component
  const router = useRouter();

  const { _id, name } = router.query;
  const addNewLink = () => {
    //todo
  };
  return (
    <div>
      <button>add</button>
      <h1>{name}</h1>

      {links?.map((link) => (
        <Link key={nanoid()} {...link} />
      ))}
    </div>
  );
};

export default TopicPage;

export async function getServerSideProps({ params }) {
  await DBClient();
  try {
    /* find all the data in our database */
    const { data } = await axios.get(
      `${NEXT_PUBLIC_DEV_URL}/api/links/${params._id}`
    );

    const serializedLinks = JSON.parse(JSON.stringify(data));
    return { props: { links: serializedLinks } };
    //serialize data to pass down as props
  } catch (e) {
    console.log("fetch error", e);
  }
}
