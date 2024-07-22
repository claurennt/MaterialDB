type TagProps = {
  tag: string;
  totalTags: number;
  index: number;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  filteringTags: string[];
};

export const Tag: React.FunctionComponent<TagProps> = ({
  tag,
  totalTags,
  index,
  onClick,
  filteringTags,
}) => (
  <>
    <button
      aria-describedby={`tag-${index}`}
      onClick={onClick}
      className={`${
        totalTags === 1
          ? 'rounded'
          : index === 0
          ? 'rounded-l'
          : index === totalTags - 1
          ? 'rounded-r'
          : ''
      } px-2 mx-1 mt-1 text-md hover:bg-secondary-300  text-white ${
        filteringTags?.includes(tag) ? 'bg-secondary-200' : 'bg-primary-neon'
      }`}
    >
      {tag}
    </button>

    <span className='sr-only' id={`tag-${index}`}>
      {filteringTags?.includes(tag)
        ? `Click to remove filter tag ${tag}`
        : ` Click to filter all links with tag ${tag}`}
    </span>
  </>
);
