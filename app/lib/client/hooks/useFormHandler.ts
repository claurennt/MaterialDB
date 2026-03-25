import { useCallback, useState } from 'react';

import { createTopic } from '@actions/topics';
import { createLink } from '@actions/links';
import { isValidUrl } from '../isValidUrl';

export const useFormHandler = ({
  type,
  topicId,
  announce,
}: {
  type: 'topic' | 'link';
  topicId?: string;
  announce: (msg: string) => void;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = (tagValue: string) => {
    const cleanTag = tagValue.trim();

    const isDuplicate = tags.some(
      (t) => t.toLowerCase() === cleanTag.toLowerCase(),
    );

    if (isDuplicate) {
      announce(`Tag ${cleanTag} already exists.`);
      return;
    }

    setTags((prev) => [...prev, cleanTag]);
    announce(`Added tag: ${cleanTag}`);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
    announce(`Removed tag: ${tagToRemove}`);
  };

  const handleClearError = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      const target = e.target as HTMLInputElement;

      // Check if the input currently being typed in is marked as invalid
      if (target.getAttribute('aria-invalid') === 'true' || error) {
        setError(null);
      }
    },
    [error],
  );

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const url = formData.get('url') as string;
    const description = formData.get('description') as string;

    // Validation
    const isTopic = type === 'topic';
    const isRequiredValueEmpty = isTopic ? !name.trim() : !url.trim();

    if (isRequiredValueEmpty) {
      const msg = isTopic ? 'Name is required' : 'URL is required';
      setError(msg);
      return false;
    }
    if (!isTopic && !isValidUrl(url)) {
      setError('Please enter a valid url');
      return false;
    }

    // Execution
    announce('Submitting your form...');

    try {
      if (isTopic) {
        await createTopic({
          name,
          description,
        });
      } else {
        await createLink({ url, tags, _topic: topicId });
      }

      return true;
    } catch (err) {
      setError('Server Error');

      return false;
    }
  };

  return {
    submit,
    error,
    handleClearError,
    tags,
    handleAddTag,
    handleRemoveTag,
  };
};
