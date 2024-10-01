import React from 'react';
import { LogoutButton } from '..';
import { render, screen, fireEvent } from '@testing-library/react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import '@testing-library/jest-dom';
// Mock the necessary modules
jest.mock('next-auth/react', () => ({
  signOut: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('LogoutButton', () => {
  const mockSignOut = signOut as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;
  const mockPush = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    mockSignOut.mockReset();
    mockUseRouter.mockReturnValue({
      push: mockPush, // Mock the `router.push` function
    });
    mockPush.mockReset();
  });

  test('calls signOut and redirects correctly on button click', async () => {
    // Set up signOut to return the expected URL
    mockSignOut.mockResolvedValueOnce({ url: '/' });

    render(<LogoutButton />);

    const logoutButton = screen.getByText('Logout');
    expect(logoutButton).toBeInTheDocument();

    // Simulate a click on the logout button
    fireEvent.click(logoutButton);

    // Wait for async events
    await screen.findByText('Logout');

    // Check if signOut was called with the expected parameters
    expect(mockSignOut).toHaveBeenCalledWith({
      redirect: false,
      callbackUrl: '/',
    });

    // Ensure the user is redirected to the correct URL after signOut
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
