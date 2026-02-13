import React from 'react';
import { LogoutButton } from '..';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { mockUseRouter } from '../../../utils/tests:unit';
import { signOut } from 'next-auth/react';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  signOut: jest.fn(() => Promise.resolve({ url: '/' })),
}));

describe('LogoutButton', () => {
  it('calls signOut and redirects correctly on button click', async () => {
    const pushMock = jest.fn();

    const mockUrl = '/';

    mockUseRouter({ pathname: '/nodeJS', push: pushMock });
    (signOut as jest.Mock).mockResolvedValue({ url: mockUrl });

    render(<LogoutButton />);
    const logoutButton = screen.getByText('Logout');
    expect(logoutButton).toBeInTheDocument();

    fireEvent.click(logoutButton);

    await Promise.resolve();

    expect(signOut).toHaveBeenCalledWith({
      redirect: false,
      callbackUrl: '/',
    });

    // Ensure the user is redirected to the correct URL after signOut
    expect(pushMock).toHaveBeenCalledWith('/');
  });
});
