// highlight query using regular expression
export const highlightSearchTerm = (searchTerm: string, title: string) => {
  const regexp = new RegExp(searchTerm, 'gi');
  const replacementPattern = '<mark>$&</mark>';
  const highlightedQuery = title.replaceAll(regexp, replacementPattern);
  return { __html: highlightedQuery };
};
