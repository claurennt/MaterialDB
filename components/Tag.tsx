const Tag = ({ tag }) => (
  <button className='tag px-2 text-xs mx-1 border-border-color p-1 text-lg hover:bg-secondary-300 focus:bg-primary-neon text-white rounded-full'>
    {tag}
  </button>
);

export default Tag;
