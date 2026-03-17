import { AddNewButton } from '../index';
import { fireEvent, render, screen } from '@testing-library/react';

import '@testing-library/jest-dom';

describe('AddNewButton', () => {
  const mockHandleOpenModal = jest.fn();
  it('should show correct content', () => {
    render(
      <>
        <AddNewButton text='topic' handleOpenModal={mockHandleOpenModal} />
        <AddNewButton text='link' handleOpenModal={mockHandleOpenModal} />
      </>,
    );
    const topicButton = screen.getByRole('button', {
      name: 'Add new topic',
    });
    expect(topicButton).toBeInTheDocument();
    fireEvent.click(topicButton);
    expect(mockHandleOpenModal).toHaveBeenNthCalledWith(1, true);

    const linkButton = screen.getByRole('button', {
      name: 'Add new link',
    });

    expect(linkButton).toBeInTheDocument();
    fireEvent.click(linkButton);
    expect(mockHandleOpenModal).toHaveBeenNthCalledWith(1, true);
  });
});
