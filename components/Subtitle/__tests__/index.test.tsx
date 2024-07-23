import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import 'utils/test/mocks';

import {
  renderWithSession,
  renderWithoutSession,
} from '../../../utils/tests:unit/helpers';

import { Subtitle } from '..';

const setOpenMock = jest.fn();

beforeEach(() => {
  setOpenMock.mockReset();
});

describe('Subtitle', () => {
  it('should render correct text with session', () => {
    //session is defined
    renderWithSession(<Subtitle setOpen={setOpenMock} />);

    const subtitle = screen.queryByText(/Start adding new/);

    expect(subtitle).not.toBeNull();

    const subtitleWithUserId = screen.queryByText(
      /If you wanna see a list of resources/
    );

    expect(subtitleWithUserId).toBeNull();
  });
  it('should render correct text without session', () => {
    // session is not defined
    renderWithoutSession(<Subtitle setOpen={setOpenMock} />);

    const subtitle = screen.queryByText(/MaterialDB is an app/);
    expect(subtitle).not.toBeNull();
  });

  it('should render correct text with userId', () => {
    // session is not defined
    renderWithoutSession(<Subtitle setOpen={setOpenMock} />);

    const subtitleWithUserId = screen.queryByText(
      /If you wanna see a list of resources/
    );

    expect(subtitleWithUserId).not.toBeNull();
  });
});
