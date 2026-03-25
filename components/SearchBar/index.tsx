import React, { useRef } from 'react';
type SearchBarProps = {
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};
export const SearchBar = ({
  handleSearch,
  search,
  setSearch,
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    setSearch('');
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSearch} className='relative mt-10 m-auto'>
      <div className='flex flex-col'>
        <label
          htmlFor='default-search'
          className='text-sm font-medium dark:text-white absolute left-0 bottom-14 text-justify w-60'
        >
          Search for word
        </label>
        <div className='relative flex justify-center'>
          <input
            ref={inputRef}
            name='search'
            type='search'
            id='default-search'
            className='border-t-transparent border-x-transparent border-b-primary-200 border-b-2 focus:border-b-secondary-200 focus:ring-0 focus:border-transparent bg-transparent block w-72 md-p-4 flex-1 rounded-none rounded-r-md sm:text-sm '
          />
        </div>
        {search ? (
          <button
            type='button'
            className='absolute top-0 right-0 text-secondary-200 m-0 focus-visible:outline-1 text-xl w-8 h-8 rounded-full'
            aria-label='clear input'
            onClick={handleClick}
          >
            X
          </button>
        ) : (
          <svg
            className='w-5 h-5 text-secondary-200 dark:text-gray-400 bottom-3 absolute right-0'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 20 20'
          >
            <path
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
            />
          </svg>
        )}
      </div>
    </form>
  );
};
