import { isValidUrl } from '../../client';
describe('isValidUrl', () => {
  it('should return true for valid absolute URLs', () => {
    expect(isValidUrl('https://google.com')).toBe(true);
  });

  it('should return true for domains without protocols', () => {
    // This now passes!
    expect(isValidUrl('google.com')).toBe(true);
    expect(isValidUrl('www.dev.to')).toBe(true);
  });

  it('should return false for strings that cannot be domains', () => {
    expect(isValidUrl('not-a-domain')).toBe(false);
    expect(isValidUrl('...')).toBe(false);
    expect(isValidUrl('http://')).toBe(false);
  });
});
