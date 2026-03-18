import { RemovableTag } from '@components/RemovableTag';
import { RefObject, useEffect, useRef } from 'react';

type TagListProps = {
  tags: string[];
  onRemoveTag: (tag: string) => void;
  submitButtonRef: RefObject<HTMLButtonElement>;
};
export const TagsList = ({
  tags,
  onRemoveTag,
  submitButtonRef,
}: TagListProps) => {
  const tagsRef = useRef<HTMLButtonElement[]>([]);
  const lastDeletedIndex = useRef<number | null>(null);

  useEffect(() => {
    if (lastDeletedIndex.current === null) return;

    const index = lastDeletedIndex.current;
    const nextTag = tagsRef.current[index];
    const prevTag = tagsRef.current[index - 1];

    if (index === tags.length || tags.length === 1)
      submitButtonRef?.current?.focus();
    if (nextTag) {
      nextTag.focus();
    } else if (prevTag) {
      prevTag.focus();
    }

    lastDeletedIndex.current = null;
  }, [tags, submitButtonRef]);

  const handleRemove = (index: number, tag: string) => {
    onRemoveTag(tag);
    lastDeletedIndex.current = index;
  };

  return (
    <ul className='flex gap-2 flex-wrap list-none text-sm text-red-600 -mt-4 mb-4'>
      {tags.map((tag, i) => (
        <RemovableTag
          ref={(el) => {
            if (el) tagsRef.current[i] = el;
          }}
          tag={tag}
          key={tag + i}
          onRemoveTag={() => handleRemove(i, tag)}
          id={`remove-tag-${tag}`}
        />
      ))}
    </ul>
  );
};
