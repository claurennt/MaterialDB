import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

const session: Session = {
  user: {
    id: '777',
    name: 'Claudia',
    email: 'claudia@gmail.com',
    image: null,
    topics: [],
  },
  expires: '3000-01-01T00:00:00.000Z',
};

const WithSession: React.FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};
const renderWithSession = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: WithSession, ...options });

const WithoutSession: React.FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => (
  <SessionProvider session={null}>{children}</SessionProvider>
);

const renderWithoutSession = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: WithoutSession, ...options });

export * from '@testing-library/react';
export { renderWithSession, renderWithoutSession };
