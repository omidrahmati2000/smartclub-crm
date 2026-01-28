const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class ApiRequestError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

export const apiClient = {
  get: async <T>(path: string, params?: Record<string, string>): Promise<T> => {
    const url = new URL(`${BASE_URL}${path}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    const res = await fetch(url.toString());
    if (!res.ok) throw new ApiRequestError(res.status, await res.text());
    return res.json();
  },

  post: async <T>(path: string, body: unknown): Promise<T> => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new ApiRequestError(res.status, await res.text());
    return res.json();
  },

  put: async <T>(path: string, body: unknown): Promise<T> => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new ApiRequestError(res.status, await res.text());
    return res.json();
  },

  delete: async <T>(path: string): Promise<T> => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new ApiRequestError(res.status, await res.text());
    return res.json();
  },
};
