class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;
import { TextEncoder, TextDecoder } from 'util';

// This polyfills the environment for whatwg-url and mongodb
global.TextEncoder = TextEncoder;
// @ts-expect-error - TextDecoder types can be finicky in global
global.TextDecoder = TextDecoder;

if (typeof HTMLDialogElement !== 'undefined') {
  HTMLDialogElement.prototype.showModal = jest.fn();
  HTMLDialogElement.prototype.close = jest.fn();
}
