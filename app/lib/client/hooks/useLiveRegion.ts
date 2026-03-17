import { useEffect, useState, useRef, useCallback } from 'react';

export const useLiveRegion = ({
  totalCount,
  type,
}: {
  totalCount?: number;
  type?: string;
}) => {
  const [announcement, setAnnouncement] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevCount = useRef<number | undefined>(totalCount);

  const announce = useCallback((message: string) => {
    // Clear first to force screen readers to re-read identical consecutive messages
    setAnnouncement('');

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Small delay ensures the DOM change is registered
    timeoutRef.current = setTimeout(() => {
      setAnnouncement(message);
    }, 50);
  }, []);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  useEffect(() => {
    // Don't announce on first mount
    if (prevCount.current === undefined) {
      prevCount.current = totalCount;
      return;
    }

    // Only announce if the count actually changed
    if (totalCount !== undefined && totalCount !== prevCount.current) {
      if (totalCount > prevCount.current) {
        announce(`New ${type} added.`);
      } else if (totalCount < prevCount.current) {
        announce(`${type} removed.`);
      }
      prevCount.current = totalCount;
    }
  }, [totalCount, type, announce]);

  return { announcement, announce };
};
