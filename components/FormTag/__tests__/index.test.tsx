// Renders a button with the correct tag text
import React from 'react';
import { FormTag } from '..';
import { render, screen, fireEvent } from '@testing-library/react';

import '@testing-library/jest-dom';
const onClickMock = jest.fn();
describe('FormTag', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should render a button with the correct tag text when tag is provided', () => {
    render(<FormTag tag='TestTag' index={0} onClick={() => {}} />);
    const tagButton = screen.getByRole('button', {
      name: 'Remove tag TestTag from list',
    });
    expect(tagButton).toBeInTheDocument();
  });

  it('should trigger onClick', () => {
    render(<FormTag tag='TestTag2' index={0} onClick={onClickMock} />);
    const tagButton = screen.getByRole('button', {
      name: 'Remove tag TestTag2 from list',
    });
    fireEvent.click(tagButton);
    expect(onClickMock).toHaveBeenCalledWith('TestTag2');
  });
});
