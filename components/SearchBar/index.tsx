import React from 'react';
type SearchBarProps = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};
export const SearchBar: React.FunctionComponent<SearchBarProps> = ({
  handleSubmit,
  search,
  setSearch,
}) => (
  <form onSubmit={handleSubmit} className='relative mt-10'>
    <label
      htmlFor='default-search'
      className='text-sm font-medium text-white dark:text-white absolute left-0 bottom-14 right-60'
    >
      <svg
        className='w-5 h-5 text-gray-500 dark:text-gray-400 absolute bottom-1'
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
      <span className='w-full absolute bottom-1 left-2'>Search for word</span>
    </label>
    <div className='relative'>
      <input
        value={search || ''}
        onChange={(e) => setSearch(e.target.value)}
        name='search'
        type='text'
        id='default-search'
        className='block w-96 p-4 ps-10 text-sm text-white border-0 border-b-2  border-primary-100 bg-transparent  focus:ring-secondary-100 focus:ring-2 placeholder-slate-100 dark:text-white '
      />

      {search && (
        <button
          type='button'
          className='absolute top-0 bottom-2 right-2 text-secondary-100 px-2 m-0 focus:outline-secondary-100 focus:outline-1'
          aria-label='clear input field'
          onClick={() => setSearch('')}
        >
          X
        </button>
      )}
    </div>
  </form>
);
