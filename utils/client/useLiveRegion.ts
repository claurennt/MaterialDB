import { useEffect, useState } from 'react';

export const useLiveRegion = ({
  announceLiveRegion,
  filteringTags,
  individualTopic,
  previousNumberOfLinks,
  open,
}) => {
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
    const currentNumberOfLinks = individualTopic.links.length;
    // announces live region when user successfully adds a new link
    if (!open && currentNumberOfLinks > previousNumberOfLinks.current) {
      setLiveRegionContent('New link successfully added to the list.');

      //updates ref with new number of links to include newly added link
      previousNumberOfLinks.current = currentNumberOfLinks;
      announceLiveRegion.current = false;
    }
  }, [individualTopic.links.length, open]);

  return liveRegionContent;
};
