import Tag from "./Tag";

import { nanoid } from "nanoid";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Link = ({ title, link, tags }) => {
  return (
    <>
      <a href={link} target="_blank">
        {title}
      </a>
      <CopyToClipboard text={link}>
        <button>copy</button>
      </CopyToClipboard>

      {tags.map((tag) => (
        <Tag key={nanoid()} tag={tag} />
      ))}
    </>
  );
};

export default Link;
