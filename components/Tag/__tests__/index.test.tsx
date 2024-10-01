import React from 'react';
import { Tag } from '..';
import { render, screen, fireEvent } from '@testing-library/react';

import '@testing-library/jest-dom';
const onClickMock = jest.fn();
describe('Tag', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render a button with the correct tag text and accessibility attributes when tag is provided', () => {
    const id = 'id1';

    const { container } = render(
      <Tag tag='TestTag' onClick={() => {}} id={id} />
    );
    const tagButton = screen.getByRole('button', {
      name: 'Remove tag TestTag from list',
    });
    expect(tagButton).toBeInTheDocument();
    expect(tagButton).toHaveAttribute('aria-labelledby', id);
    expect(container.querySelector(`#${id}`)).toBeInTheDocument();
  });

  it('should trigger onClick if it`s filtering tag', () => {
    render(<Tag tag='TestTag2' onClick={onClickMock} id='id2' />);
    const tagButton = screen.getByRole('button', {
      name: 'Remove tag TestTag2 from list',
    });
    fireEvent.click(tagButton);
    expect(onClickMock).toHaveBeenCalledWith('TestTag2');
  });
  it('should trigger onClick it`s form tag', () => {
    render(
      <Tag
        tag='TestTag4'
        onClick={onClickMock}
        id='id4'
        filteringTags={['TestTag4']}
      />
    );
    const tagButton = screen.getByRole('button', {
      name: 'Remove tag TestTag4 from list',
    });
    fireEvent.click(tagButton);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
