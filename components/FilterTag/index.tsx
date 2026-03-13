'use client';

type FilterTagProps = {
  tag: string;
  handleFilterByTag: (e: React.MouseEvent<HTMLButtonElement>) => void;
  activeFilters: string[];
  totalTags: number;
  index: number;
};

export const FilterTag = ({
  tag,
  handleFilterByTag,
  activeFilters,
  totalTags,
  index,
}: FilterTagProps) => {
  const isActive = activeFilters.includes(tag);

  // Determine border radius based on position in group
  const borderRadius =
    totalTags === 1
      ? 'rounded'
      : index === 0
        ? 'rounded-l'
        : index === totalTags - 1
          ? 'rounded-r'
          : 'rounded-none';

  const borderColor = isActive ? 'border-secondary-200' : 'border-primary-200';

  return (
    <li>
      <button
        onClick={handleFilterByTag}
        aria-pressed={isActive}
        className={`
          flex items-center gap-1 px-2 py-0.5 border text-[9px] font-bold tracking-widest uppercase transition-colors
          ${borderRadius} ${borderColor} 
          text-primary-100 hover:text-pink-300 hover:border-secondary-100
 
        `}
      >
        {tag}
        {isActive && (
          <span aria-hidden className='text-secondary-200 ml-1'>
            ✓
          </span>
        )}
      </button>
    </li>
  );
};
