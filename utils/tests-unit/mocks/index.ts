import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export const mockUsePathname = (pathname: string) => {
  const mockedPathname = jest.mocked(usePathname);

  if (mockedPathname.mockReturnValue) {
    mockedPathname.mockReturnValue(pathname);
  } else {
    // Fallback if the mock wasn't initialized correctly at the top level
    throw new Error(
      "usePathname is not a mock. Ensure jest.mock('next/navigation') is called at the top of your test or in jest.setup.js",
    );
  }
};

export const mockUseSearchParams = (params: Record<string, string> | null) => {
  (useSearchParams as jest.Mock).mockReturnValue({
    get: (key: string) => params?.[key] || null,
    has: (key: string) => !!params?.[key],
    forEach: jest.fn(),
  });
};

export const mockUseRouter = (overrides: any = {}) => {
  (useRouter as jest.Mock).mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    pathname: '/',
    query: {},
    ...overrides,
  });
};

export const mockUseSession = (sessionData: Session | null) => {
  const mockedUseSession = jest.mocked(useSession);

  mockedUseSession.mockReturnValue({
    data: sessionData,
    status: sessionData ? 'authenticated' : 'unauthenticated',
    update: jest.fn().mockResolvedValue(null),
  } as any);
};

export const resetMocks = () => {
  jest.clearAllMocks(); // Use clearAllMocks to keep implementations but reset call counts
};

export const TEST_USER_ID = '777';

export const createMockSession = (
  overrides: Partial<Session> = {},
): Session => ({
  user: {
    id: TEST_USER_ID,
    username: 'Claudia',
    email: 'claudia@gmail.com',
    image: null,
  },
  expires: '3000-01-01T00:00:00.000Z',
  ...overrides,
});
