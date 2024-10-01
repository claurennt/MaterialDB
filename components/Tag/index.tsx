import React from 'react';

type TagProps =
  | {
      onClick: (tag: string) => void;
      id: string;
      tag: string;
    }
  | {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
      filteringTags: string[];
      id: string;
      tag: string;
      totalTags: number;
      index: number;
    };

export const isFilteringTagProps = (
  props: TagProps
): props is Extract<TagProps, { totalTags: number }> => 'totalTags' in props;

export const Tag: React.FunctionComponent<TagProps> = (props) => {
  if (isFilteringTagProps(props)) {
    // Handling the filtering tag variant
    const { tag, onClick, filteringTags, totalTags, index, id } = props;
    const filterTagBackground = filteringTags.includes(tag)
      ? 'bg-secondary-200'
      : 'bg-primary-neon';

    const filterTagStyles = `${
      totalTags === 1
        ? 'rounded'
        : index === 0
        ? 'rounded-l'
        : index === totalTags - 1
        ? 'rounded-r'
        : ''
    } px-2 mx-1 mt-1 text-md hover:bg-secondary-300 text-white ${filterTagBackground}`;

    return (
      <li>
        <button
          aria-labelledby={id}
          onClick={onClick}
          className={filterTagStyles}
        >
          {tag}
        </button>
        <span className='sr-only' id={id}>
          {filteringTags.includes(tag)
            ? `Click to remove filter tag ${tag}`
            : `Click to filter all links with tag ${tag}`}
        </span>
      </li>
    );
  } else {
    // Handling the form tag variant
    const { tag, onClick, id } = props;

    return (
      <li>
        <button
          aria-labelledby={id}
          onClick={() => onClick(tag)}
          className='items-center my-2 text-sm text-tertiary-100 bg-transparent rounded-sm focus-visible:ring-2 ring-offset-2 ring-primary-300'
          data-dismiss-target='#tag-dismiss-default'
        >
          <span
            id='tag-dismiss-default'
            className='px-2 py-1 text-sm font-medium text-tertiary-100 bg-primary-300 rounded hover:bg-secondary-300 focus-visible:outline-none focus:outline-none'
          >
            {tag} x
          </span>
        </button>
        <span className='sr-only' id={id}>
          Remove tag {tag} from list
        </span>
      </li>
    );
  }
};
