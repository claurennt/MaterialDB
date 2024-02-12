import React from 'react';
import { Category } from '..';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('Category', () => {
  it('should check the radio input on click', async () => {
    const handleChangeMock = jest.fn();

    render(<Category type='dummy category' handleChange={handleChangeMock} />);

    const radio = screen.getByLabelText('dummy category');

    expect(radio).not.toBeChecked();

    await userEvent.click(radio);

    expect(radio).toBeChecked();
  });
});
