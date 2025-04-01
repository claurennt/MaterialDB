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
    const { tag, onClick, filteringTags, totalTags, index } = props;
    const isActiveFilteringTag = filteringTags.includes(tag);

    const borderColor = isActiveFilteringTag
      ? 'border-secondary-200'
      : 'border-primary-neon';

    const borderStyle =
      totalTags === 1
        ? 'rounded'
        : index === 0
        ? 'rounded-l'
        : index === totalTags - 1
        ? 'rounded-r'
        : '';

    const filterTagStyles = `border ${borderStyle} ${borderColor} px-2 mx-1 mt-1 text-md text-white`;

    return (
      <>
        <button
          onClick={onClick}
          className={filterTagStyles}
          aria-pressed={isActiveFilteringTag}
        >
          {tag}
          {isActiveFilteringTag ? (
            <span aria-hidden className='text-secondary-200'>
              {' '}
              ✓{' '}
            </span>
          ) : null}
        </button>
      </>
    );
  } else {
    // Handling the form tag variant
    const { tag, onClick, id } = props;

    return (
      <>
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
      </>
    );
  }
};
