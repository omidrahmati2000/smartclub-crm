/**
 * Creates a fetch wrapper that automatically includes locale headers.
 * Use this for API calls that need locale-aware responses.
 */
export function localizedFetch(url: string | URL | Request, init?: RequestInit): Promise<Response> {
  let locale = 'fa';

  // Read locale from cookie (works in both client and server contexts)
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]*)/);
    if (match) {
      locale = match[1];
    }
  }

  const headers = new Headers(init?.headers);
  if (!headers.has('Accept-Language')) {
    headers.set('Accept-Language', locale);
  }
  if (!headers.has('X-Locale')) {
    headers.set('X-Locale', locale);
  }

  return fetch(url, { ...init, headers });
}
