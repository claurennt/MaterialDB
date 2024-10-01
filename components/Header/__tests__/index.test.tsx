import React from 'react';
import { Header } from '..';
import { useRouter } from 'next/router';
import { screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import {
  renderWithoutSession,
  renderWithSession,
} from '../../../utils/tests:unit';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

jest.mock('next/router', () => {
  const originalModule = jest.requireActual('next-auth/react');

  return {
    ...originalModule,
    useRouter: jest.fn(),
  };
});
jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react');

  return {
    ...originalModule,
    useSession: jest.fn(),
  };
});

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    useSearchParams: jest.fn(),
  };
});
describe('Header', () => {
  const mockUseRouter = useRouter as jest.Mock;
  const mockUseSession = useSession as jest.Mock;
  const mockUseSearchParams = useSearchParams as jest.Mock;
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('should render LogoutButton when session exists and pathname does not include `auth`', () => {
    mockUseRouter.mockImplementation(() => ({
      pathname: '/nodeJS',
      query: { userId: undefined },
    }));

    mockUseSession.mockImplementation(() => ({ data: { user: 'John Doe' } }));

    renderWithSession(<Header />);
    const logoutButton = screen.queryByRole('button', { name: 'Logout' });
    expect(logoutButton).toBeInTheDocument();
  });
  it('shows Home button if pathname is not "/" and userId param is in url, no session', () => {
    mockUseSession.mockReturnValue(() => undefined);

    mockUseRouter.mockReturnValue({
      pathname: '/nodeJS',
      query: { userId: '123' },
    });
    mockUseSearchParams.mockReturnValue({
      get: (key: string) => {
        if (key === 'userId') return '123';
        return null;
      },
    });

    renderWithoutSession(<Header />);

    const homeLink = screen.queryByRole('link', { name: 'Home' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/?userId=123');

    const authLinks = screen
      .queryAllByRole('link')
      .filter((link) => ['Register', 'Login'].includes(link.innerText));
    expect(authLinks).toHaveLength(0);

    const logoutButton = screen.queryByRole('button', { name: 'Logout' });
    expect(logoutButton).toBeNull();
  });

  it('does not show Auth links/buttons when path includes "auth"', () => {
    mockUseRouter.mockReturnValue({
      pathname: '/auth',
      query: {},
    });
    mockUseSession.mockReturnValue(() => undefined);
    renderWithoutSession(<Header />);

    const logoutButton = screen.queryByRole('button', { name: 'Logout' });
    const authLinks = screen
      .queryAllByRole('link')
      .filter((link) => ['Register', 'Login'].includes(link.innerText));
    expect(logoutButton).toBeNull();
    expect(authLinks).toHaveLength(0);
  });
});
