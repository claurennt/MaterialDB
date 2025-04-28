import { useEffect, useState } from 'react';

type UseLiveRegionArgs = {
  announceLiveRegionRef?: React.MutableRefObject<boolean>;
  filteringTags?: string[] | null;
  numberOfTopicLinks?: number;
  numberOfFilteredLinks?: number;
  previousNumberOfLinksRef?: React.MutableRefObject<number>;
  type: string;
  open?: boolean;
  isError?: boolean;
  isLoading?: boolean;
};
export const useLiveRegion = ({
  announceLiveRegionRef = { current: true },
  filteringTags = null,
  numberOfTopicLinks,
  numberOfFilteredLinks,
  previousNumberOfLinksRef = { current: 0 },
  open = false,
  type,
  isError = false,
  isLoading = false,
}: UseLiveRegionArgs) => {
  const [liveRegionContent, setLiveRegionContent] = useState<string>('');

  useEffect(() => {
    let announceLiveRegion = announceLiveRegionRef.current;
    if (!announceLiveRegion) return;
    // announces live region when user filters links by clicking on tag button
    if (announceLiveRegion && Array.isArray(filteringTags)) {
      const linkLabel = numberOfFilteredLinks === 1 ? 'link' : 'links';
      const tagLabel = filteringTags.length === 1 ? 'tag' : 'tags';

      const liveRegion = filteringTags.length
        ? `${numberOfFilteredLinks} ${linkLabel} with ${tagLabel} ${filteringTags.join(
            ', '
          )}`
        : 'All tag filters have been removed';

      setLiveRegionContent(liveRegion);
      announceLiveRegion = false;
    }
  }, [filteringTags]);

  useEffect(() => {
    if (!open) return;
    // announces live region when user unsuccessfully adds a new resource or is submitting the form

    if (isError) {
      setLiveRegionContent(
        `Something went wrong: ${type} addition failed, please try again`
      );
      return;
    }
    if (isLoading) setLiveRegionContent('Submitting form...');
  }, [open, isError, isLoading, type]);

  useEffect(() => {
    if (open) return;

    const currentNumberOfLinks = numberOfTopicLinks;
    let previousNumberOfLinks = previousNumberOfLinksRef.current;

    // announces live region when user successfully adds a new link
    if (currentNumberOfLinks > previousNumberOfLinks)
      setLiveRegionContent(`New ${type} successfully added to the list.`);
    // announces live region when user successfully deletes a link
    if (currentNumberOfLinks < previousNumberOfLinks)
      setLiveRegionContent('Successful link deletion');

    //updates ref with new number of links to include newly added or deleted link
    previousNumberOfLinks = currentNumberOfLinks;
    announceLiveRegionRef.current = false;
  }, [numberOfTopicLinks, open, previousNumberOfLinksRef, type]);

  return liveRegionContent;
};
