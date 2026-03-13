export const HighlightedText = ({
  search,
  title,
}: {
  search: string;
  title: string;
}) => {
  if (!search.trim()) return <>{title}</>;

  // Escape special characters in search to prevent regex errors
  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = title.split(new RegExp(`(${escapedSearch})`, 'gi'));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === search.toLowerCase() ? (
          <mark key={i}>{part}</mark>
        ) : (
          part
        ),
      )}
    </>
  );
};
