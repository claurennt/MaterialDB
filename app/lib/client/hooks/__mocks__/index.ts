export const useAuth = jest.fn(() => ({
  authAction: jest.fn(),
  setAuthFeedback: jest.fn(),
  authFeedback: { isError: false, message: 'Mock useAuth message' },
}));

export const useFormHandler = jest.fn(() => ({
  submit: jest.fn(),
  handleAddTag: jest.fn(),
  handleRemoveTag: jest.fn(),
  handleClearError: jest.fn(),
  error: null,
  tags: [],
}));

export const useLiveRegion = jest.fn(() => ({
  announce: jest.fn(),
  announcement: 'Mock Announcement Content',
}));
