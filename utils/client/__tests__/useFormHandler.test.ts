import { renderHook, act } from '@testing-library/react';
import { useFormHandler } from '../useFormHandler';
import { addNewResource } from '../index';
import { Session } from 'next-auth';

// Mock dependencies
jest.mock('../index', () => ({
  ...jest.requireActual('../useFormHandler'),
  addNewResource: jest.fn(),
  validateUrl: jest.fn((url) => url.startsWith('http')),
  isTopic: jest.fn((state) => 'name' in state),
}));

const mockSession = {
  user: {
    id: 'user123',
  },
} as Session;

const accessToken = 'mockToken';
const individualTopicId = 'topic123';

describe('useFormHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() =>
      useFormHandler({ accessToken, session: mockSession })
    );

    expect(result.current.state).toEqual({
      newTopic: { name: '', description: '' },
      newLink: { url: '', tags: [] },
      tagValue: '',
      isError: false,
      isLoading: false,
    });
    expect(result.current.inputRef.current).toBeNull();
  });

  it('should return false and set error if input is invalid', async () => {
    const { result } = renderHook(() =>
      useFormHandler({ accessToken, session: mockSession })
    );

    const mockEvent = { preventDefault: jest.fn() } as any;

    const invalidLink = { url: '', tags: [] };

    const success = await act(async () =>
      result.current.handleSubmitForm(mockEvent, invalidLink)
    );

    expect(result.current.state.isError).toBe(true);
    expect(success).toBe(false);
  });

  it('should submit successfully if input is valid (NewLink)', async () => {
    const { result } = renderHook(() =>
      useFormHandler({ accessToken, session: mockSession, individualTopicId })
    );

    const mockEvent = { preventDefault: jest.fn() } as any;

    // Simulate inputRef being non-null
    const input = document.createElement('input');
    result.current.inputRef.current = input;

    const validLink = { url: 'http://valid-url.com', tags: [] };
    result.current.isValidInput.current = true;

    (addNewResource as jest.Mock).mockResolvedValueOnce(true);

    const success = await act(async () =>
      result.current.handleSubmitForm(mockEvent, validLink)
    );

    expect(addNewResource).toHaveBeenCalledWith(
      mockEvent,
      accessToken,
      expect.objectContaining({
        url: 'http://valid-url.com',
        _topic: individualTopicId,
      })
    );

    expect(success).toBe(true);
  });

  it('should submit successfully if input is valid (NewTopic)', async () => {
    const { result } = renderHook(() =>
      useFormHandler({ accessToken, session: mockSession })
    );

    const mockEvent = { preventDefault: jest.fn() } as any;

    const input = document.createElement('input');
    result.current.inputRef.current = input;

    const validTopic = { name: 'New Topic', description: '' };
    result.current.isValidInput.current = true;

    (addNewResource as jest.Mock).mockResolvedValueOnce(true);

    const success = await act(async () =>
      result.current.handleSubmitForm(mockEvent, validTopic)
    );

    expect(addNewResource).toHaveBeenCalledWith(
      mockEvent,
      accessToken,
      expect.objectContaining({ name: 'New Topic', creatorId: 'user123' })
    );

    expect(success).toBe(true);
  });

  it('should handle exception during submission', async () => {
    const { result } = renderHook(() =>
      useFormHandler({ accessToken, session: mockSession })
    );

    const mockEvent = { preventDefault: jest.fn() } as any;

    const input = document.createElement('input');
    result.current.inputRef.current = input;

    const validTopic = { name: 'Topic', description: '' };
    result.current.isValidInput.current = true;

    (addNewResource as jest.Mock).mockRejectedValueOnce(new Error('fail'));

    const success = await act(async () =>
      result.current.handleSubmitForm(mockEvent, validTopic)
    );

    expect(success).toBe(false);
    expect(result.current.state.isError).toBe(true);
  });
});
