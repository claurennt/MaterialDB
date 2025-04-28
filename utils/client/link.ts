export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Content copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};

// highlight query using regular expression
export const highlightSearchTerm = (searchTerm: string, title: string) => {
  const regexp = new RegExp(searchTerm, 'gi');
  const replacementPattern = '<mark>$&</mark>';
  const highlightedQuery = title.replaceAll(regexp, replacementPattern);
  return { __html: highlightedQuery };
};
