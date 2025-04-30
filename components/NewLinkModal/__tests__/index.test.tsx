import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { NewLinkModal, NewLinkModalProps } from '..';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));
jest.mock('../../../utils/client', () => ({
  linkInputs: [{ name: 'url' }, { name: 'tags' }],
  topicInputs: [{ name: 'name' }, { name: 'description' }],
  useFormHandler: jest.fn(),
  useLiveRegion: jest.fn(),
}));

const mockUseSession = useSession as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockUseFormHandler = jest.requireMock(
  '../../../utils/client'
).useFormHandler;
const mockUseLiveRegion = jest.requireMock(
  '../../../utils/client'
).useLiveRegion;

describe('NewLinkModal', () => {
  const setOpenMock = jest.fn();
  const routerReplaceMock = jest.fn();
  const handleSubmitFormMock = jest.fn();

  const defaultProps = {
    setOpen: setOpenMock,
    type: 'link' as NewLinkModalProps['type'],
    open: true,
  };

  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          access_token: 'mock-token',
        },
      },
    });

    mockUseRouter.mockReturnValue({
      asPath: '/test-path',
      replace: routerReplaceMock,
    });

    mockUseFormHandler.mockReturnValue({
      state: {
        isError: false,
        isLoading: false,
        newLink: {
          url: '',
          tags: [],
        },
        newTopic: {
          name: '',
        },
        tagValue: '',
      },
      dispatch: jest.fn(),
      handleSubmitForm: handleSubmitFormMock,
    });

    mockUseLiveRegion.mockReturnValue('Live region content');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders link modal correctly', () => {
    render(<NewLinkModal {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Add new article/resource')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'url' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'tags' })).toBeInTheDocument();
  });

  it('renders topic modal correctly when type is topic', () => {
    render(<NewLinkModal {...defaultProps} type='topic' />);

    expect(screen.getByText('Insert a new topic')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'name' })).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'description' })
    ).toBeInTheDocument();
  });

  it('handles input changes for link url', () => {
    const mockDispatch = jest.fn();
    mockUseFormHandler.mockReturnValue({
      ...mockUseFormHandler(),
      dispatch: mockDispatch,
    });

    render(<NewLinkModal {...defaultProps} />);

    const urlInput = screen.getByRole('textbox', { name: 'url' });
    fireEvent.change(urlInput, { target: { value: 'https://example.com' } });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_NEW_LINK',
      payload: { url: 'https://example.com', tags: [] },
    });
  });

  it('handles tag input and keydown', () => {
    const mockDispatch = jest.fn();
    mockUseFormHandler.mockReturnValue({
      state: {
        ...mockUseFormHandler().state,
        tagValue: 'react',
      },
      dispatch: mockDispatch,
    });

    render(<NewLinkModal {...defaultProps} />);

    const tagsInput = screen.getByRole('textbox', { name: 'tags' });
    fireEvent.keyDown(tagsInput, { key: 'Enter' });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_NEW_LINK',
      payload: { url: '', tags: ['react'] },
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TAG_VALUE',
      payload: '',
    });
  });

  it('handles tag removal', () => {
    const mockDispatch = jest.fn();
    mockUseFormHandler.mockReturnValue({
      state: {
        ...mockUseFormHandler().state,
        newLink: {
          url: '',
          tags: ['react', 'typescript'],
        },
      },
      dispatch: mockDispatch,
    });

    render(<NewLinkModal {...defaultProps} />);

    const firstTagRemoveButton = screen.getAllByRole('button', {
      name: /remove tag/i,
    })[0];
    fireEvent.click(firstTagRemoveButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_NEW_LINK',
      payload: { url: '', tags: ['typescript'] },
    });
  });

  it('submits form successfully', async () => {
    handleSubmitFormMock.mockResolvedValue(true);
    jest.useFakeTimers();

    const user = userEvent.setup({
      advanceTimers: () => jest.advanceTimersByTime(3000),
    });
    render(<NewLinkModal {...defaultProps} />);

    await user.click(
      screen.getByRole('button', { name: /Click to create new link/i })
    );

    expect(handleSubmitFormMock).toHaveBeenCalled();

    expect(setOpenMock).toHaveBeenCalledWith(false);
    expect(routerReplaceMock).toHaveBeenCalledWith('/test-path');
    jest.useRealTimers();
  });

  it('shows error state', () => {
    mockUseFormHandler.mockReturnValue({
      ...mockUseFormHandler(),
      state: {
        ...mockUseFormHandler().state,
        isError: true,
      },
    });

    render(<NewLinkModal {...defaultProps} />);

    const urlInput = screen.getByRole('textbox', { name: 'url' });
    expect(urlInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not navigate when form submission fails', async () => {
    handleSubmitFormMock.mockResolvedValue(false);

    render(<NewLinkModal {...defaultProps} />);

    fireEvent.click(
      screen.getByRole('button', { name: /Click to create new link/i })
    );

    await waitFor(() => {
      expect(handleSubmitFormMock).toHaveBeenCalled();
      expect(setOpenMock).not.toHaveBeenCalled();
      expect(routerReplaceMock).not.toHaveBeenCalled();
    });
  });
});
