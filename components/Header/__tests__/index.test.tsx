import React from 'react';
import { Header } from '..';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  renderWithSession,
  renderWithoutSession,
  mockUseRouter,
  mockUseSession,
  mockUseSearchParams,
  resetMocks,
  TEST_USER_ID,
  createMockSession,
} from '../../../utils/tests:unit';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  SessionProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('Header', () => {
  beforeEach(() => {
    resetMocks();
    mockUseRouter({ pathname: '/nodeJS', query: { userId: TEST_USER_ID } });
  });

  it('should render LogoutButton when session exists and pathname does not include `auth`', () => {
    const mockedSession = createMockSession();
    mockUseSession(mockedSession);

    renderWithSession(<Header />);
    const logoutButton = screen.queryByRole('button', { name: 'Logout' });
    expect(logoutButton).toBeInTheDocument();
  });

  it('shows Home button if pathname is not "/" and userId param is in url, no session', () => {
    mockUseSearchParams({ userId: TEST_USER_ID });
    mockUseSession(null);

    renderWithoutSession(<Header />);

    const homeLink = screen.queryByRole('link', { name: 'Home' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', `/?userId=${TEST_USER_ID}`);

    const authLinks = screen
      .queryAllByRole('link')
      .filter((link) => ['Register', 'Login'].includes(link.innerText));
    expect(authLinks).toHaveLength(0);

    const logoutButton = screen.queryByRole('button', { name: 'Logout' });
    expect(logoutButton).toBeNull();
  });

  it('does not show Auth links/buttons when path includes "auth"', () => {
    mockUseSearchParams(null);
    mockUseSession(null);

    renderWithoutSession(<Header />);

    const logoutButton = screen.queryByRole('button', { name: 'Logout' });
    const authLinks = screen
      .queryAllByRole('link')
      .filter((link) => ['Register', 'Login'].includes(link.innerText));
    expect(logoutButton).toBeNull();
    expect(authLinks).toHaveLength(0);
  });
});
