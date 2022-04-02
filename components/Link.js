import Tag from "./Tag";

import { nanoid } from "nanoid";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Link = ({ title, url, tags }) => {
  return (
    <>
      <a href={url} target="_blank">
        {title}
      </a>
      <CopyToClipboard text={url}>
        <button>copy</button>
      </CopyToClipboard>

      {tags?.map((tag) => (
        <Tag key={nanoid()} tag={tag} />
      ))}
    </>
  );
};

export default Link;
