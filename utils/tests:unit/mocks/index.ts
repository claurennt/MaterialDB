// __mocks__/nextMocks.ts

import { useRouter, NextRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { useSearchParams } from 'next/navigation';

// Create the mock implementations
export const mockUseRouter = (overrides: Partial<NextRouter> = {}) => {
  (useRouter as jest.Mock).mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    ...overrides,
  });
};

export const mockUseSession = (sessionData: Session | null = null) => {
  (useSession as jest.Mock).mockImplementation(() => ({
    data: sessionData,
    status: sessionData ? 'authenticated' : 'unauthenticated',
  }));
};

export const mockUseSearchParams = (params: Record<string, string> = {}) => {
  (useSearchParams as jest.Mock).mockImplementation(() => ({
    get: (key: string) => params[key] || null,
  }));
};

export const resetMocks = () => {
  jest.resetAllMocks();
};

export const mockDefaultSetup = () => {
  mockUseRouter();
  mockUseSession();
  mockUseSearchParams();
};

export const TEST_USER_ID = '777';

export const createMockSession = (
  overrides: Partial<Session> = {}
): Session => ({
  user: {
    id: TEST_USER_ID,
    name: 'Claudia',
    email: 'claudia@gmail.com',
    image: null,
    topics: [],
  },
  expires: '3000-01-01T00:00:00.000Z',
  ...overrides,
});
