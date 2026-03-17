import { renderHook } from '@testing-library/react';
import { useFormHandler } from '../useFormHandler';
import { createTopic } from '@actions/topics';
import { createLink } from '@actions/links';
import { isValidUrl } from '@lib/client';
import { act, FormEvent } from 'react';

jest.mock('@actions/topics');
jest.mock('@actions/links');
jest.mock('@lib/client', () => ({
  isValidUrl: jest.fn(),
}));

describe('useFormHandler', () => {
  const mockAnnounce = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper to mock the Form Event with actual data
  const createMockEvent = (data = {}): FormEvent<HTMLFormElement> => {
    const form = document.createElement('form');
    Object.entries(data).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });
    return {
      currentTarget: form,
      preventDefault: jest.fn(),
      target: {},
    } as unknown as FormEvent<HTMLFormElement>;
  };

  // ### --- Validation Tests ---
  it('should set error and return false if topic name is missing', async () => {
    const { result } = renderHook(() =>
      useFormHandler({ type: 'topic', announce: mockAnnounce }),
    );

    const event = createMockEvent({ name: '', description: '' });
    let response: boolean | undefined = undefined;
    await act(async () => {
      response = await result.current.submit(event);
    });

    expect(response).toBe(false);
    expect(result.current.error).toBe('Name is required');
  });

  it('should set error when URL is missing', async () => {
    const { result } = renderHook(() =>
      useFormHandler({ type: 'link', announce: mockAnnounce }),
    );

    const event = createMockEvent({ url: '' });
    let response: boolean | undefined = undefined;
    await act(async () => {
      response = await result.current.submit(event);
    });

    expect(response).toBe(false);
    expect(result.current.error).toBe('URL is required');
  });

  it('should set error when URL is invalid', async () => {
    (isValidUrl as jest.Mock).mockReturnValue(false);

    const { result } = renderHook(() =>
      useFormHandler({ type: 'link', announce: mockAnnounce }),
    );

    const event = createMockEvent({ url: 'test-url' });
    let response: boolean | undefined = undefined;
    await act(async () => {
      response = await result.current.submit(event);
    });

    expect(response).toBe(false);
    expect(result.current.error).toBe('Please enter a valid url');
  });

  // ### --- State & Tag Management ---
  it('should add tags and handle duplicates correctly', () => {
    const { result } = renderHook(() =>
      useFormHandler({ type: 'link', announce: mockAnnounce }),
    );

    act(() => {
      result.current.handleAddTag('React');
      result.current.handleAddTag('Web Accessibility');
    });
    expect(result.current.tags).toEqual(['React', 'Web Accessibility']);

    act(() => {
      result.current.handleAddTag('react'); // Duplicate check
      result.current.handleRemoveTag('Web Accessibility');
    });
    expect(result.current.tags).toEqual(['React']);
    expect(mockAnnounce).toHaveBeenCalledWith('Tag react already exists.');
  });

  // ### --- Successful Submission ---
  it('should call createLink and return true on valid link submission', async () => {
    (isValidUrl as jest.Mock).mockReturnValue(true);
    (createLink as jest.Mock).mockResolvedValue({ success: true });

    const { result } = renderHook(() =>
      useFormHandler({ type: 'link', topicId: '123', announce: mockAnnounce }),
    );

    // Populate some tags first
    act(() => {
      result.current.handleAddTag('Testing');
    });

    const event = createMockEvent({ url: 'https://google.com' });
    let response: boolean | undefined = undefined;
    await act(async () => {
      response = await result.current.submit(event);
    });

    expect(response).toBe(true);
    expect(createLink).toHaveBeenCalledWith({
      url: 'https://google.com',
      tags: ['Testing'],
      _topic: '123',
    });
  });

  // ### --- Error Handling ---
  it('should handle server-side errors gracefully', async () => {
    (isValidUrl as jest.Mock).mockReturnValue(true);
    (createTopic as jest.Mock).mockRejectedValue(new Error('Database down'));

    const { result } = renderHook(() =>
      useFormHandler({ type: 'topic', announce: mockAnnounce }),
    );

    const event = createMockEvent({ name: 'Great Topic' });
    let response: boolean | undefined = undefined;
    await act(async () => {
      response = await result.current.submit(event);
    });

    expect(result.current.error).toBe('Server Error');
  });
});
