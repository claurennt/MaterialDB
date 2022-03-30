import { useRouter } from "next/router";
import DBClient from "../../utils/DBClient.js";

const { NEXT_PUBLIC_DEV_URL } = process.env;

const TopicPage = ({ links }) => {
  //get router info with props passed with Link component
  const router = useRouter();
  console.log(links);
  const { _id, name } = router.query;

  return (
    <div>
      <h1>{name}</h1>
      <p>{_id}</p>
    </div>
  );
};

export default TopicPage;

export async function getServerSideProps({ params }) {
  await DBClient();
  /* find all the data in our database */
  const res = await fetch(`${NEXT_PUBLIC_DEV_URL}/api/links/${params._id}`);

  const links = await res.json();
  console.log(links);
  const serializedLinks = JSON.parse(JSON.stringify(links));
  //serialize data to pass down as props
  return { props: { links: serializedLinks } };
}
