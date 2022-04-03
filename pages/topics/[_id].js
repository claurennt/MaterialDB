import { useRouter } from "next/router";
import { useState } from "react";
import DBClient from "../../utils/DBClient.js";
import axios from "axios";
import { nanoid } from "nanoid";
import Link from "../../components/Link";
import NewLinkForm from "../../components/NewLinkForm";

const TopicPage = ({ individualTopic }) => {
  const [open, setOpen] = useState(false);

  const [newLink, setNewLink] = useState({
    url: "",
    category: "",
    tags: [],
  });

  //get router info with props passed with Link component
  const router = useRouter();

  const { name } = router.query;

  const handleChange = (e) => {
    const tags = [];

    setNewLink({
      ...newLink,
      [e.target.name]: e.target.value,
    });
  };
  console.log(newLink);
  const addNewLink = async (e) => {
    e.preventDefault();
    console.log("new", newLink);
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_DEV_URL}/api/topics/${individualTopic._id}`,
      {
        ...newLink,
      }
    );

    console.log(res);
    // close the modal and refresh the page to get updated server side props and display new added link
    setTimeout(() => {
      setOpen(false);
      router.reload(window.location.pathname);
    }, 500);
  };

  return (
    <div className="">
      <button
        className="bg-blue-600 absolute bottom-0 right-0 p-1 text-lg "
        onClick={() => setOpen(true)}
      >
        +
      </button>
      <button
        className="absolute top-0 right-0 mx-5 px-5 text-base "
        onClick={() => router.replace("/")}
      >
        Home
      </button>
      {open && (
        <NewLinkForm
          name={name}
          addNewLink={addNewLink}
          handleChange={handleChange}
          setOpen={setOpen}
          open={open}
        />
      )}

      <h1 className="underline font-bold text-3xl">{name}</h1>

      {individualTopic.links.map((link) => (
        <Link key={nanoid()} {...link} />
      ))}
    </div>
  );
};

export default TopicPage;

export async function getServerSideProps({ params: { _id } }) {
  await DBClient();

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
