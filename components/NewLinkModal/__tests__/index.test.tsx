import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { NewLinkModal } from '..';
import { createTopic } from '@actions/topics';

jest.mock('@actions/topics');
jest.mock('@actions/links');

describe('NewLinkModal', () => {
  const mockHandleOpenModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the correct title for "link" type', () => {
    render(
      <NewLinkModal open handleOpenModal={mockHandleOpenModal} type='link' />,
    );

    expect(screen.getByText(/add new article\/resource/i)).toBeInTheDocument();
  });

  it('renders the correct title for "topic" type', () => {
    render(
      <NewLinkModal open handleOpenModal={mockHandleOpenModal} type='topic' />,
    );

    expect(screen.getByText(/insert a new topic/i)).toBeInTheDocument();
  });

  it('calls handleOpenModal(false) after successful topic submission', async () => {
    const mockedCreateTopic = jest.mocked(createTopic);
    mockedCreateTopic.mockResolvedValueOnce({ success: true } as any);

    render(
      <NewLinkModal open handleOpenModal={mockHandleOpenModal} type='topic' />,
    );

    const input = screen.getByLabelText(/name/i);
    await userEvent.type(input, 'New Test Topic');

    const form = screen.getByTestId('resource-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockHandleOpenModal).toHaveBeenCalledWith(false);
    });
  });

  it('does not close modal if submission fails', async () => {
    const mockedCreateTopic = jest.mocked(createTopic);
    mockedCreateTopic.mockRejectedValueOnce(new Error('Server error'));

    render(
      <NewLinkModal open handleOpenModal={mockHandleOpenModal} type='topic' />,
    );

    const input = screen.getByLabelText(/name/i);
    await userEvent.type(input, 'New Test Topic');

    const form = screen.getByTestId('resource-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockHandleOpenModal).not.toHaveBeenCalled();
    });
  });

  it('adds a tag when Enter key is pressed', async () => {
    const user = userEvent.setup();

    render(
      <NewLinkModal open handleOpenModal={mockHandleOpenModal} type='link' />,
    );

    const input = screen.getByLabelText(/tags/i);

    await user.type(input, 'TypeScript{enter}');

    expect(await screen.findByText('TypeScript')).toBeInTheDocument();
  });
});
