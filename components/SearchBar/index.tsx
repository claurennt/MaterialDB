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
  <form onSubmit={handleSubmit}>
    <label
      htmlFor='default-search'
      className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'
    >
      Search bar
    </label>
    <div className='relative'>
      <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
        <svg
          className='w-4 h-4 text-gray-500 dark:text-gray-400'
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
      </div>
      <input
        value={search || ''}
        onChange={(e) => setSearch(e.target.value)}
        name='search'
        type='text'
        id='default-search'
        className='block w-96 p-4 ps-10 text-sm text-white border-0 border-b-2  border-primary-100 bg-transparent  focus:ring-secondary-100 focus:ring-2 placeholder-slate-100 dark:text-white '
        placeholder='Search for word...'
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
