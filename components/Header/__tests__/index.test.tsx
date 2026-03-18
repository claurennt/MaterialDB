import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '../index';

import {
  mockUsePathname,
  mockUseSearchParams,
  resetMocks,
  TEST_USER_ID,
  createMockSession,
  mockUseSession,
} from '../../../utils/tests-unit';

jest.mock('next/navigation');
jest.mock('next-auth/react');

jest.mock('@components/LogoutButton', () => ({
  LogoutButton: () => <a href='test'>Logout</a>,
}));

jest.mock('@components/AuthLinks', () => ({
  AuthLinks: () => <a href='auth'>Auth Links</a>,
}));

describe('Header', () => {
  beforeEach(() => {
    resetMocks();
    mockUseSession(null);
    mockUsePathname('/');
    mockUseSearchParams({});
  });

  it('renders LogoutButton when session exists and not on an auth page', () => {
    const mockedSession = createMockSession();

    mockUseSession(mockedSession);

    render(<Header />);

    expect(screen.getByRole('link', { name: /logout/i })).toBeInTheDocument();
  });

  it('shows Home link with userId query when on a subpage without session', () => {
    mockUsePathname('/some-topic');
    // Simulate ?userId=123
    const params = { userId: TEST_USER_ID };
    mockUseSearchParams(params);

    render(<Header />);

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();

    // Check the href (Next/Link handles object-to-string conversion)
    expect(homeLink).toHaveAttribute('href', `/?userId=${TEST_USER_ID}`);

    const logoutLink = screen.queryByRole('link', { name: /logout/i });
    expect(logoutLink).not.toBeInTheDocument();
  });

  it('does not show Home link when on the root path "/"', () => {
    render(<Header />);

    expect(
      screen.queryByRole('link', { name: /home/i }),
    ).not.toBeInTheDocument();
  });

  it('hides auth-related UI when on an auth page', () => {
    mockUsePathname('/auth/login');

    render(<Header />);

    expect(
      screen.queryByRole('link', { name: /logout/i }),
    ).not.toBeInTheDocument();

    const authLinks = screen.queryByRole('link', { name: /auth links/i });
    expect(authLinks).not.toBeInTheDocument();
  });
});
