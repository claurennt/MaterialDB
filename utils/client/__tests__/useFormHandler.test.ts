// useFormHandler.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useFormHandler } from '../useFormHandler';
import { addNewResource } from '../sendRequest';

// Mocks
jest.mock('../index', () => ({
  addNewResource: jest.fn(),
  isTopic: jest.fn((state) => 'name' in state),
  formReducer: jest.fn((state, action) => state),
}));

describe('useFormHandler', () => {
  const mockSession = {
    user: { id: 'user-123' },
  } as any;

  const accessToken = 'mock-token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize properly', () => {
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
    expect(typeof result.current.dispatch).toBe('function');
    expect(typeof result.current.handleSubmitForm).toBe('function');
    expect(result.current.inputRef.current).toBeNull();
  });

  it('should not submit if inputRef is missing', async () => {
    const { result } = renderHook(() =>
      useFormHandler({ accessToken, session: mockSession })
    );

    result.current.inputRef.current = null;
    const fakeEvent = { preventDefault: jest.fn() } as any;
    const invalidState = { name: '', description: '' }; // Invalid NewTopic

    const success = await act(async () =>
      result.current.handleSubmitForm(fakeEvent, invalidState)
    );

    expect(fakeEvent.preventDefault).toHaveBeenCalled();
    expect(success).toBe(false);
  });

  it('stests correct implementaion if validation fails', async () => {
    const { result } = renderHook(() =>
      useFormHandler({ accessToken, session: mockSession })
    );

    const mockInput = document.createElement('input');
    result.current.inputRef.current = mockInput;
    const focusSpy = jest.spyOn(mockInput, 'focus');

    const invalidState = { name: '', description: '' }; // Invalid newTopic

    const success = await act(async () =>
      result.current.handleSubmitForm(
        { preventDefault: jest.fn() } as any,
        invalidState
      )
    );

    expect(success).toBe(false);
    expect(focusSpy).toHaveBeenCalled(); // Focus called
  });

  it('should submit successfully if validation passes', async () => {
    const { result } = renderHook(() =>
      useFormHandler({ accessToken, session: mockSession })
    );

    // Mock refs
    const mockInput = document.createElement('input');
    result.current.inputRef.current = mockInput;
    const focusSpy = jest.spyOn(mockInput, 'focus');
    // Valid NewTopic
    const validState = { name: 'My Topic', description: 'Some description' };

    const success = await act(async () =>
      result.current.handleSubmitForm(
        { preventDefault: jest.fn() } as any,
        validState
      )
    );

    expect(success).toBe(true);
    expect(focusSpy).not.toHaveBeenCalled(); // Focus not called
  });
});
