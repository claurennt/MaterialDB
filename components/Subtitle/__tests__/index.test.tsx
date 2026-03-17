import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Subtitle } from '..';
import { mockUseSearchParams, resetMocks } from '../../../utils/tests:unit';

jest.mock('next/navigation');

describe('Subtitle', () => {
  beforeEach(() => {
    resetMocks();
    // Default to no search params
    mockUseSearchParams(null);
  });

  it('renders public landing message when not authenticated and no userId in URL', () => {
    render(<Subtitle isAuthenticated={false} isOwner={false} totalCount={0} />);

    expect(
      screen.getByText(/MaterialDB helps you become a better/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Register or login to create/i),
    ).toBeInTheDocument();
  });

  it('renders empty state message for owner when they have 0 topics', () => {
    render(<Subtitle isAuthenticated={true} isOwner={true} totalCount={0} />);

    expect(
      screen.getByText(/You do not have any topics yet/i),
    ).toBeInTheDocument();
  });

  it('renders nothing (null) for owner when they have topics', () => {
    const { container } = render(
      <Subtitle isAuthenticated={true} isOwner={true} totalCount={5} />,
    );

    // When a component returns null, the container is empty
    expect(container).toBeEmptyDOMElement();
  });

  it('renders "Pick a topic" when viewing someone else profile with topics', () => {
    // Simulate being on ?userId=some-other-id
    mockUseSearchParams({ userId: 'other-user-123' });

    render(<Subtitle isAuthenticated={true} isOwner={false} totalCount={10} />);

    expect(screen.getByText(/Pick a/i)).toBeInTheDocument();
    expect(screen.getByText(/topic/i)).toBeInTheDocument();
  });

  it('renders specific message when viewing someone else profile with 0 topics', () => {
    mockUseSearchParams({ userId: 'other-user-123' });

    render(<Subtitle isAuthenticated={true} isOwner={false} totalCount={0} />);

    expect(
      screen.getByText(/The user does not have any topics yet/i),
    ).toBeInTheDocument();
  });
});
