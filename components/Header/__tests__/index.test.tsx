import React from 'react';
import { Header } from '..';
import { useRouter } from 'next/router';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { renderWithSession } from '../../../utils/tests:unit';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));
describe('Header', () => {
  const mockUseRouter = useRouter as jest.Mock;

  beforeEach(() => {
    // Reset the mock before each test
    mockUseRouter.mockReset();
  });
  it('shows Home link and Logout button if pathname is not "/" and session is active', () => {
    mockUseRouter.mockReturnValue({
      pathname: '/nodeJS',
      query: {},
    });
    renderWithSession(<Header />);

    const homeLink = screen.queryByRole('link', { name: 'Home' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
    const logoutBtn = screen.queryByRole('button', { name: 'Logout' });
    expect(logoutBtn).toBeInTheDocument();
  });
  it('shows Home button if pathname is not "/" and userId param is in url, no session', () => {
    const mockUseSession = useRouter as jest.Mock;
    mockUseSession.mockReturnValue(undefined);

    mockUseRouter.mockReturnValue({
      pathname: '/nodeJS',
      query: { userId: '123' },
    });

    render(<Header />);

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
    renderWithSession(<Header />);

    const logoutButton = screen.queryByRole('button', { name: 'Logout' });
    const authLinks = screen
      .queryAllByRole('link')
      .filter((link) => ['Register', 'Login'].includes(link.innerText));
    expect(logoutButton).toBeNull();
    expect(authLinks).toHaveLength(0);
  });
});
