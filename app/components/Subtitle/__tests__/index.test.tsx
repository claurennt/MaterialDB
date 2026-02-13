import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'utils/test/mocks';

import {
  renderWithSession,
  renderWithoutSession,
} from '../../../utils/tests:unit/helpers';

import { Subtitle } from '..';
import { mockUseRouter, TEST_USER_ID } from '../../../utils/tests:unit';

const setOpenMock = jest.fn();
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Subtitle', () => {
  beforeEach(() => {
    setOpenMock.mockReset();
  });
  it('should render correct text with session', () => {
    mockUseRouter({ query: { userId: TEST_USER_ID } });
    //session is defined
    renderWithSession(<Subtitle setOpen={setOpenMock} />);

    const subtitle = screen.queryByText(/Start adding new/);

    expect(subtitle).toBeInTheDocument();

    const subtitleWithUserId = screen.queryByText(
      /If you wanna see a list of resources/
    );

    expect(subtitleWithUserId).not.toBeInTheDocument();
  });

  it('should render correct text without session', () => {
    mockUseRouter({ query: { userId: TEST_USER_ID } });
    // session is not defined
    renderWithoutSession(<Subtitle setOpen={setOpenMock} />);

    const subtitle = screen.queryByText(/MaterialDB is an app/);
    expect(subtitle).toBeInTheDocument();
  });

  it('should render correct text with userId and no session', () => {
    mockUseRouter({ query: { userId: TEST_USER_ID } });
    // session is not defined
    renderWithoutSession(<Subtitle setOpen={setOpenMock} />);

    const subtitleWithUserId = screen.queryByText(
      /If you wanna see a list of resources/
    );

    expect(subtitleWithUserId).toBeInTheDocument();

    const subtitle = screen.queryByText(/Start adding new/);

    expect(subtitle).not.toBeInTheDocument();
  });
});
