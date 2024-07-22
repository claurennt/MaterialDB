import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'utils/test/mocks';
import 'utils/client/data';
import { NewLinkForm } from '..';
import userEvent from '@testing-library/user-event';
import { renderWithSession } from '../../../utils/tests:unit';

import axios from 'axios';
import { useRouter } from 'next/router';

// Mocks
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const setOpenMock = jest.fn();

const individualTopicId = '1';
const path = '/current-path';

describe('NewLinkForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows the modal to add a new topic when `open` prop is true', () => {
    renderWithSession(<NewLinkForm type='topic' setOpen={setOpenMock} open />);

    const modal = screen
      .queryAllByRole('dialog')
      .find((dialog) => dialog.getAttribute('aria-modal'));

    expect(modal).not.toBeNull();
  });

  test('does not show the modal to add a new topic when `open` prop is false', () => {
    renderWithSession(
      <NewLinkForm type='topic' setOpen={setOpenMock} open={false} />
    );

    const topicFormTitle = screen.queryByRole('dialog');
    expect(topicFormTitle).toBeNull();
  });

  test('successful POST request flow', async () => {
    const mockName = 'test';
    const mockDescription = 'test-description';
    const {
      query: { userId },
    } = useRouter();

    const payload = {
      newTopic: { name: mockName, description: mockDescription },
      creatorId: userId,
    };

    mockedAxios.put.mockResolvedValue(payload);

    renderWithSession(
      <NewLinkForm type='topic' setOpen={setOpenMock} open={true} />
    );

    const nameInput = screen.queryByLabelText('name') as HTMLInputElement;

    const descriptionInput = screen.queryByLabelText(
      'description'
    ) as HTMLInputElement;

    const addButton = screen.queryByRole('button', {
      name: /Click to create new topic/,
    });

    fireEvent.change(nameInput, { target: { value: mockName } });

    // simulates typen and pressing ENTER key to save the tag
    fireEvent.change(descriptionInput, { target: { value: mockDescription } });

    fireEvent.click(addButton!);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/topics', payload);
      expect(useRouter().replace).toHaveBeenCalledWith(path);

      expect(setOpenMock).toHaveBeenCalledWith(false);
    });
  });

  test('failed POST request flow', async () => {
    mockedAxios.post.mockRejectedValue({
      status: 400,
    });

    renderWithSession(
      <NewLinkForm type='topic' setOpen={setOpenMock} open={true} />
    );

    const addButton = screen.queryByRole('button', {
      name: /Click to create new topic/,
    });

    fireEvent.click(addButton!);

    const toast = document.querySelector('.Toastify');
    expect(toast).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/topics',
        expect.anything()
      );
      expect(useRouter().replace).not.toHaveBeenCalled();

      expect(setOpenMock).not.toHaveBeenCalled();
    });
  });
  test('successful PUT request flow', async () => {
    const user = userEvent.setup();
    const mockUrl = 'https//:mockurl';
    const mockTag1 = 'mockTag1';
    const mockTag2 = 'mockTag2';
    const category = 'article';
    const {
      query: { _id },
    } = useRouter();

    const payload = {
      _topic: _id,
      category,
      tags: [mockTag1, mockTag2],
      url: mockUrl,
    };

    mockedAxios.put.mockResolvedValue(payload);

    renderWithSession(
      <NewLinkForm
        type='link'
        setOpen={setOpenMock}
        open={true}
        individualTopicId={individualTopicId}
      />
    );

    const urlInput = screen.queryByLabelText('url') as HTMLInputElement;
    const tagsInput = screen.queryByLabelText(
      /Type in your tag and press enter to save/
    ) as HTMLInputElement;
    const categoryInput = screen.queryByLabelText(
      'article'
    ) as HTMLInputElement;

    const addButton = screen.queryByRole('button', {
      name: /Click to create new link/,
    });

    fireEvent.change(urlInput, { target: { value: mockUrl } });

    // simulates typen and pressing ENTER key to save the tag
    await user.type(tagsInput, `${mockTag1}{enter}${mockTag2}{enter}`);

    fireEvent.click(categoryInput);

    fireEvent.click(addButton!);

    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `/api/topics/${individualTopicId}`,
        payload
      );
      expect(useRouter().replace).toHaveBeenCalledWith(path);

      expect(setOpenMock).toHaveBeenCalledWith(false);
    });

    const savedTag1 = screen.queryByText(mockTag1);

    // simulates tag removal from list once clicked
    fireEvent.click(savedTag1!);
    // sends the PUT request again
    fireEvent.click(addButton!);
    await waitFor(() => {
      expect(savedTag1).not.toBeInTheDocument();

      expect(mockedAxios.put).toHaveBeenCalledWith(
        `/api/topics/${individualTopicId}`,
        { ...payload, tags: [mockTag2] }
      );
    });
  });

  test('failed PUT request flow', async () => {
    mockedAxios.put.mockRejectedValue({
      status: 400,
    });

    renderWithSession(
      <NewLinkForm
        type='link'
        setOpen={setOpenMock}
        open={true}
        individualTopicId={individualTopicId}
      />
    );

    const addButton = screen.queryByRole('button', {
      name: /Click to create new link/,
    });

    fireEvent.click(addButton!);

    const toast = document.querySelector('.Toastify');

    expect(toast).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `/api/topics/${individualTopicId}`,
        expect.anything()
      );
      expect(useRouter().replace).not.toHaveBeenCalled();

      expect(setOpenMock).not.toHaveBeenCalled();
    });
  });
});
