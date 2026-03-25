export const getNormalizedUrl = (url: string): string | null => {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();
  const hasProtocol = /^[a-z]+:\/\//i.test(trimmed);
  const urlToTest = hasProtocol ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(urlToTest);
    const hostname = parsed.hostname;

    // 1. Split hostname by dots: "google.com" -> ["google", "com"]
    const parts = hostname.split('.');

    // 2. Guard: Must have at least two parts AND the TLD must be at least 2 chars
    // This kills "...", "google.", and ".com"
    const hasValidTld =
      parts.length >= 2 && parts[parts.length - 1].length >= 2;

    if (!hasValidTld) return null;

    return parsed.toString();
  } catch {
    return null;
  }
};

// Keep this for simple boolean checks
export const isValidUrl = (url: string): boolean => !!getNormalizedUrl(url);
