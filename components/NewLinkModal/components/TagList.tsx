import { Tag } from 'components/Tag';

type TagListProps = {
  tags: string[];
  onRemoveTag: (tag: string) => void;
};
export const TagsList: React.FunctionComponent<TagListProps> = ({
  tags,
  onRemoveTag,
}) => (
  <ul className='flex flex-wrap list-none'>
    {tags.map((tag, i) => (
      <Tag
        tag={tag}
        key={tag + i}
        onClick={onRemoveTag}
        id={`remove-tag-${tag}`}
        index={i}
      />
    ))}
  </ul>
);
