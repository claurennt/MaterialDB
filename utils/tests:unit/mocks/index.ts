export const routerMock = jest.mock('next/router', () => {
  const router = {
    replace: jest.fn(),
    push: jest.fn(),
    query: { userId: '777', _id: '1', name: 'topicName' },
    asPath: '/current-path',
  };
  return {
    useRouter: jest.fn().mockReturnValue(router),
  };
});

export const MockedResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
global.ResizeObserver = MockedResizeObserver;
