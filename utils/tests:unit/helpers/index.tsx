import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { SessionProvider } from 'next-auth/react';

import { createMockSession } from '../mocks';

const session = createMockSession();

const WithSession = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider session={session}>{children}</SessionProvider>
);

const renderWithSession = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: WithSession, ...options });

const WithoutSession = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider session={null}>{children}</SessionProvider>
);

const renderWithoutSession = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: WithoutSession, ...options });

export * from '@testing-library/react';
export { renderWithSession, renderWithoutSession };
