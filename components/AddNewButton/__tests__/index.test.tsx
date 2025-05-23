import React from 'react';
import { AddNewButton } from '..';
import { render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

const setOpenMock = jest.fn();

describe('AddNewButton', () => {
  it('should show correct content', () => {
    render(<AddNewButton text='topic' setOpen={setOpenMock} />);

    const button = screen.queryByRole('button');
    expect(button).toBeInTheDocument();
  });
  it('should have sr-only element bound to button via aria-describedby attribute', () => {
    const { container } = render(
      <AddNewButton text='test' setOpen={setOpenMock} />
    );

    const button = screen.queryByRole('button');

    expect(button).toHaveAttribute('aria-describedby', 'new-test');

    const srOnlySpan = container.querySelector('.sr-only');
    expect(srOnlySpan).toHaveTextContent(/Opens modal/);
  });
  it('should trigger setOpen with delay on click', async () => {
    jest.useFakeTimers();

    render(<AddNewButton text='timer' setOpen={setOpenMock} />);

    const user = userEvent.setup({
      advanceTimers: () => jest.advanceTimersByTime(3000),
    });

    const button = screen.getByRole('button');

    await user.click(button);

    // Check if setOpen was called with true after the timeout
    expect(setOpenMock).toHaveBeenCalledWith(true);
    expect(setOpenMock).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});
