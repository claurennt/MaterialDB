import Tag from "./Tag";

import { nanoid } from "nanoid";
import { CopyToClipboard } from "react-copy-to-clipboard";
import axios from "axios";
import { useRouter } from "next/router";

const Link = ({ title, url, tags, _id }) => {
  const router = useRouter();

  const deleteLink = async () => {
    const res = await axios.delete(`/api/links/${_id}`);

    // refresh the page to get updated server side props
    router.replace(router.asPath);
  };
  return (
    <div>
      <button
        className="text-blue-600 text-4xl mx-3 "
        onClick={() => deleteLink()}
      >
        -
      </button>

      <a href={url} target="_blank">
        {title}
      </a>
      <CopyToClipboard text={url}>
        <button className="text-blue-600 text-base mx-3 ">copy</button>
      </CopyToClipboard>
      <div className="flex flex-row">
        {tags?.map((tag) => (
          <Tag key={nanoid()} tag={tag} />
        ))}{" "}
      </div>
    </div>
  );
};

export default Link;
