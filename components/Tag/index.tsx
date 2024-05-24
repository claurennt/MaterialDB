export const Tag = ({ tag, tagsNumber, index }) => (
  <button
    className={`${
      tagsNumber === 1
        ? 'rounded'
        : index === 0
        ? 'rounded-l'
        : index === tagsNumber - 1
        ? 'rounded-r'
        : ''
    } px-2 mx-1 mt-1 bg-primary-neon text-md hover:bg-secondary-300 focus:bg-primary-neon text-white`}
  >
    {tag}
  </button>
);
