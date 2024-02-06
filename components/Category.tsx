import React from 'react';

type CategoryProps = {
  type: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, name: string) => void;
};

const Category: React.FunctionComponent<CategoryProps> = ({
  type,
  handleChange,
}) => (
  <div className='flex items-center h-5 pt-5'>
    <input
      value={type}
      onChange={(e) => handleChange(e, 'category')}
      id='category'
      name='category'
      type='radio'
      className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded'
    />{' '}
    <label htmlFor='category' className='px-3 text-gray-900'>
      {type}
    </label>
  </div>
);

export default Category;
