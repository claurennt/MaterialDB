import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LogoutButton } from '..';
import { signOut } from 'next-auth/react';

jest.mock('next-auth/react');

describe('LogoutButton', () => {
  it('calls signOut with correct parameters when clicked', async () => {
    const mockedSignOut = jest.mocked(signOut);

    render(<LogoutButton />);

    const logoutLink = screen.getByText('Logout', { selector: 'a' });
    expect(logoutLink).toBeInTheDocument();

    fireEvent.click(logoutLink);

    expect(mockedSignOut).toHaveBeenCalledWith({
      redirect: true,
      callbackUrl: '/',
    });
  });
});
