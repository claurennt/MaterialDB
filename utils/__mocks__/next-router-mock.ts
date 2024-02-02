jest.mock('next/router', () => {
  const router = {
    push: jest.fn(),
    query: { userId: 'randomId' },
  };
  return {
    useRouter: jest.fn().mockReturnValue(router),
  };
});
