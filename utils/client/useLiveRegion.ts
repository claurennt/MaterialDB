import { RefObject, useEffect, useState } from 'react';

type UseLiveRegionArgs = {
  announceLiveRegion?: React.MutableRefObject<boolean>;
  filteringTags?: string[] | null;
  numberOfTopicLinks?: number;
  previousNumberOfLinks?: React.MutableRefObject<number>;
  type: string;
  open?: boolean;
  isError?: boolean;
  isLoading?: boolean;
};
export const useLiveRegion = ({
  announceLiveRegion = { current: true },
  filteringTags = null,
  numberOfTopicLinks,
  previousNumberOfLinks,
  open = false,
  type,
  isError = false,
  isLoading = false,
}: UseLiveRegionArgs) => {
  const [liveRegionContent, setLiveRegionContent] = useState<string>('');

  useEffect(() => {
    // announces live region when user filters links by clicking on tag button
    if (announceLiveRegion.current && Array.isArray(filteringTags)) {
      setLiveRegionContent(
        filteringTags.length
          ? `Now showing all links with tags: ${filteringTags}`
          : `all tag filters have been removed`
      );
      announceLiveRegion.current = false;
    }
  }, [filteringTags]);

  useEffect(() => {
    // announces live region when user unsuccessfully adds a new resource or is submitting the form
    if (open) {
      if (isError)
        setLiveRegionContent(
          `Something went wrong: ${type} addition failed, please try again`
        );

      if (isLoading) setLiveRegionContent('Submitting form...');
    }

    const currentNumberOfLinks = numberOfTopicLinks;
    // announces live region when user successfully adds a new link
    if (!open && currentNumberOfLinks > previousNumberOfLinks.current) {
      setLiveRegionContent(`New ${type} successfully added to the list.`);

      //updates ref with new number of links to include newly added link
      previousNumberOfLinks.current = currentNumberOfLinks;
      announceLiveRegion.current = false;
    }
  }, [numberOfTopicLinks, open, type, isLoading]);

  return liveRegionContent;
};
