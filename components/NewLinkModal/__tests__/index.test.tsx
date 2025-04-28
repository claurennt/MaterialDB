import React from 'react';
import { screen } from '@testing-library/react';

import { useSession } from 'next-auth/react';
import { NewLinkModal } from '..';

import { useFormHandler } from '../../../utils/client';
import '@testing-library/jest-dom';
import {
  renderWithSession,
  createMockSession,
  mockUseSession,
} from '../../../utils/tests:unit';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

jest.mock('../../../utils/client', () => ({
  ...jest.requireActual('../../../utils/client'),
  useFormHandler: jest.fn(),
  useLiveRegion: jest.fn(() => 'Live region content'),
}));

jest.mock('../../ModalInput', () => ({
  ModalInput: ({ handleChange, name }) => (
    <input data-testid={`modal-input-${name}`} onChange={handleChange} />
  ),
}));

jest.mock('../../Tag', () => ({
  Tag: ({ tag, onClick }) => (
    <button onClick={() => onClick(tag)}>{tag}</button>
  ),
  LiveRegion: ({ liveRegionContent }) => <div>{liveRegionContent}</div>,
}));

jest.mock('../../SubmitFormButton', () => ({
  SubmitFormButton: ({ onFormSubmit }) => (
    <button onClick={onFormSubmit}>Submit</button>
  ),
}));

const mockDispatch = jest.fn();
const mockHandleSubmitForm = jest.fn();
const mockSetOpen = jest.fn();

const setup = (type = 'link') => {
  (useSession as jest.Mock).mockReturnValue({
    data: { user: { access_token: 'fake-token' } },
  });

  (useFormHandler as jest.Mock).mockReturnValue({
    state: {
      newLink: { url: '', tags: [] },
      newTopic: { name: '', description: '' },
      tagValue: '',
      isError: false,
      isLoading: false,
    },
    dispatch: mockDispatch,
    handleSubmitForm: mockHandleSubmitForm,
    isValidInput: { current: true },
    inputRef: { current: { focus: jest.fn() } },
  });

  renderWithSession(
    <NewLinkModal type={type} setOpen={mockSetOpen} open={true} />
  );
};

describe('NewLinkModal - ModalInput behaviors', () => {
  const mockedSession = createMockSession();
  mockUseSession(mockedSession);

  it('renders modal with correct inputs for type=link', () => {
    setup('link');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveTextContent(
      'Add new article/resource'
    );
    expect(screen.getByTestId('modal-input-url')).toBeInTheDocument();
    expect(screen.getByTestId('modal-input-tags')).toBeInTheDocument();
  });

  it('renders modal with correct inputs for type=topic', () => {
    setup('topic');
    expect(screen.getByRole('heading')).toHaveTextContent('Insert a new topic');
    expect(screen.getByTestId('modal-input-name')).toBeInTheDocument();
    expect(screen.getByTestId('modal-input-description')).toBeInTheDocument();
  });
});
