import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import 'utils/client/data';
import { NewLinkModal, NewLinkModalProps } from '..';

import { renderWithSession } from '../../../utils/tests:unit';

import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider/';

const setOpenMock = jest.fn();

const NewLinkModalTest = ({
  type,
  open,
  setOpen,
  individualTopicId = '1',
}: NewLinkModalProps) => (
  <MemoryRouterProvider>
    <NewLinkModal
      type={type}
      setOpen={setOpen}
      open={open}
      individualTopicId={individualTopicId}
    />
  </MemoryRouterProvider>
);

describe('NewLinkModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows/hide the modal according to `open` prop value', () => {
    const { rerender } = renderWithSession(
      <NewLinkModalTest type='topic' open setOpen={setOpenMock} />
    );

    const modal = screen
      .queryAllByRole('dialog')
      .find((dialog) => dialog.getAttribute('aria-modal'));

    expect(modal).toBeInTheDocument();

    rerender(
      <NewLinkModalTest type='topic' open={false} setOpen={setOpenMock} />
    );
    expect(modal).not.toBeInTheDocument();
  });
  // Form renders correctly with all inputs and buttons
  test('should render form with all inputs and buttons when open is true', () => {
    const { getByRole } = renderWithSession(
      <NewLinkModalTest
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
