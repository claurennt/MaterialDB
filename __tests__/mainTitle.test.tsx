import React from 'react';

import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { renderWithSession, renderWithoutSession } from '../utils/helpers-test';

import MainTitle from '../components/MainTitle';

describe('MainTitle', () => {
  it('should render the user name when there is a session', () => {
    // session is defined
    renderWithSession(<MainTitle />);

    const mainTitle = screen.queryByText('Claudia!', {
      selector: 'h1',
      exact: false,
    });

    expect(mainTitle).not.toBeNull();
  });
});

it('should only say hello without a session', () => {
  // session is null
  renderWithoutSession(<MainTitle />);

  const mainTitle = screen.queryByText('Claudia!', {
    selector: 'h1',
    exact: false,
  });

  expect(mainTitle).toBeNull();
});
