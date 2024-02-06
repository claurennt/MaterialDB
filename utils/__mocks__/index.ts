jest.mock('next/router', () => {
  const router = {
    replace: jest.fn(),
    push: jest.fn(),
    query: { userId: '777', _id: '1' },
    asPath: '/current-path',
  };
  return {
    useRouter: jest.fn().mockReturnValue(router),
  };
});

const MockedResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
global.ResizeObserver = MockedResizeObserver;
