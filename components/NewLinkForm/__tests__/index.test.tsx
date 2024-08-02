import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import 'utils/client/data';
import { NewLinkForm, NewLinkFormProps } from '..';

import { renderWithSession } from '../../../utils/tests:unit';

import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider/';

const setOpenMock = jest.fn();

const NewLinkFormTest = ({
  type,
  open,
  setOpen,
  individualTopicId = '1',
}: NewLinkFormProps) => (
  <MemoryRouterProvider>
    <NewLinkForm
      type={type}
      setOpen={setOpen}
      open={open}
      individualTopicId={individualTopicId}
    />
  </MemoryRouterProvider>
);
describe('NewLinkForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows/hide the modal according to `open` prop value', () => {
    const { rerender } = renderWithSession(
      <NewLinkFormTest type='topic' open setOpen={setOpenMock} />
    );

    const modal = screen
      .queryAllByRole('dialog')
      .find((dialog) => dialog.getAttribute('aria-modal'));

    expect(modal).toBeInTheDocument();

    rerender(
      <NewLinkFormTest type='topic' open={false} setOpen={setOpenMock} />
    );
    expect(modal).not.toBeInTheDocument();
  });
  // Form renders correctly with all inputs and buttons
  test('should render form with all inputs and buttons when open is true', () => {
    const { getByRole } = renderWithSession(
      <NewLinkFormTest
        individualTopicId='1'
        setOpen={setOpenMock}
        type='link'
        open
      />
    );

    expect(getByRole('dialog')).toBeInTheDocument();
    expect(
      getByRole('button', { name: 'Click to create new link' })
    ).toBeInTheDocument();
  });
});
