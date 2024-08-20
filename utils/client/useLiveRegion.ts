import { RefObject, useEffect, useState } from 'react';

type UseLiveRegionArgs = {
  announceLiveRegion: React.MutableRefObject<boolean>;
  filteringTags: string[];
  numberOfTopicLinks: number;
  previousNumberOfLinks: React.MutableRefObject<number>;
  open: boolean;
};
export const useLiveRegion = ({
  announceLiveRegion,
  filteringTags,
  numberOfTopicLinks,
  previousNumberOfLinks,
  open,
}: UseLiveRegionArgs) => {
  const [liveRegionContent, setLiveRegionContent] = useState<string>('');

  useEffect(() => {
    // announces live region when user filters links by clicking on tag button
    if (announceLiveRegion.current) {
      setLiveRegionContent(
        filteringTags.length
          ? `Now showing all links with tags: ${filteringTags}`
          : `all tag filters have been removed`
      );
      announceLiveRegion.current = false;
    }
  }, [filteringTags]);

  useEffect(() => {
    const currentNumberOfLinks = numberOfTopicLinks;
    // announces live region when user successfully adds a new link
    if (!open && currentNumberOfLinks > previousNumberOfLinks.current) {
      setLiveRegionContent('New link successfully added to the list.');

      //updates ref with new number of links to include newly added link
      previousNumberOfLinks.current = currentNumberOfLinks;
      announceLiveRegion.current = false;
    }
  }, [numberOfTopicLinks, open]);

  return liveRegionContent;
};
