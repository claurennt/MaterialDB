import React from 'react';
import Category from '../components/Category';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('<Category />', () => {
  it('should check the radio input on click', () => {
    const handleChangeMock = jest.fn();

    render(<Category type='dummy category' handleChange={handleChangeMock} />);

    const radio = screen.getByLabelText('dummy category');

    expect(radio).not.toBeChecked();

    fireEvent.click(radio);

    expect(radio).toBeChecked();
  });
});
