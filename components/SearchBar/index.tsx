import React, { useRef } from 'react';
type SearchBarProps = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};
export const SearchBar: React.FunctionComponent<SearchBarProps> = ({
  handleSubmit,
  search,
  setSearch,
}) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    setSearch('');
    inputRef.current.focus();
  };

  return (
    <form onSubmit={handleSubmit} className='relative mt-10 m-auto'>
      <div className='flex flex-col'>
        <label
          htmlFor='default-search'
          className='text-sm font-medium text-white dark:text-white absolute left-0 bottom-14 text-justify w-60'
        >
          Search for word
        </label>
        <div className='relative flex justify-center'>
          <svg
            className='w-5 h-5 text-gray-500 dark:text-gray-400 bottom-3 absolute left-0'
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
          <input
            ref={inputRef}
            name='search'
            type='search'
            id='default-search'
            className='block w-72 md-p-4 ps-10 text-sm text-white border-0 border-b-2 border-primary-100 bg-transparent  focus:ring-secondary-100 focus:ring-2 placeholder-slate-100 dark:text-white'
          />
        </div>
        {search && (
          <button
            type='button'
            className='absolute top-0 right-0 text-secondary-100 m-0 focus:outline-secondary-100 focus:outline-1 text-xl w-8 h-8 rounded-full'
            aria-label='clear input'
            onClick={handleClick}
          >
            X
          </button>
        )}
      </div>
    </form>
  );
};
