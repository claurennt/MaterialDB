import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';

import { MainTitle } from '../index';
import { createMockSession, mockUseSession } from '../../../utils/tests-unit';

jest.mock('next-auth/react');

describe('MainTitle', () => {
  it('should render the user name when there is a session', () => {
    const mockedSession = createMockSession();
    mockUseSession(mockedSession);
    render(<MainTitle />);

    const mainTitle = screen.queryByText('Claudia!', {
      selector: 'h1',
      exact: false,
    });

    expect(mainTitle).not.toBeNull();
  });
});

it('should only say hello without a session', () => {
  mockUseSession(null);
  // session is null
  render(<MainTitle />);

  const mainTitle = screen.queryByText('Claudia!', {
    selector: 'h1',
    exact: false,
  });

  expect(mainTitle).toBeNull();
});
