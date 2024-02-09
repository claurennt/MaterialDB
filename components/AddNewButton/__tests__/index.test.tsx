import React from 'react';
import { AddNewButton } from '..';
import { render, screen, fireEvent } from '@testing-library/react';

import '@testing-library/jest-dom';

const setOpenMock = jest.fn();

describe('AddNewButton', () => {
  it('should show correct content', () => {
    render(<AddNewButton text='topic' setOpen={setOpenMock} />);

    const button = screen.queryByRole('button');
    expect(button).not.toBeNull();
  });
  it('should have sr-only element bound to button via aria-labelledby attribute', () => {
    const { container } = render(
      <AddNewButton text='test' setOpen={setOpenMock} />
    );

    const button = screen.queryByRole('button');

    expect(button).not.toBeNull();
    expect(button).toHaveAttribute('aria-labelledby', 'new-test');

    const srOnlySpan = container.querySelector('.sr-only');
    expect(srOnlySpan).toHaveTextContent(
      /Open modal with form to add new test/
    );
  });
  it('should trigger setOpen with delay on click', async () => {
    render(<AddNewButton text='timer' setOpen={setOpenMock} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // setOpen should not be called without delay
    expect(setOpenMock).not.toHaveBeenCalled();

    // then
    jest.useFakeTimers();

    fireEvent.click(button);

    // Fast-forward time by 500ms
    jest.advanceTimersByTime(500);

    // Check if setOpen was called with true after the timeout
    expect(setOpenMock).toHaveBeenCalledWith(true);
    expect(setOpenMock).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});
