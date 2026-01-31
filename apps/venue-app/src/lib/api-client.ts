/**
 * Centralized API client for all fetch requests.
 *
 * MSW initialization is handled by MSWProvider (src/providers/msw-provider.tsx).
 * The provider blocks rendering until MSW is ready, so there is no need
 * to initialize MSW here.
 *
 * IMPORTANT: The base URL MUST be a relative path ("/api"), NOT an absolute
 * URL like "http://localhost:3011/api". MSW's service worker can only
 * intercept same-origin requests. If the user accesses the app via
 * 127.0.0.1 but API calls go to "localhost", the browser treats them as
 * different origins and MSW cannot intercept — causing 404s on OPTIONS
 * preflight requests.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface ApiResponse<T = any> {
  data?: T;
  success: boolean;
  message?: string;
  error?: string;
  statusCode?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {

    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Check if we got HTML instead of JSON (MSW not intercepting)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        console.error('[API Client] Received HTML instead of JSON. MSW may not be intercepting requests.');
        return {
          success: false,
          error: 'Invalid response type',
          message: 'Server returned HTML instead of JSON. Check if MSW is working.',
        };
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Request failed',
          message: data.message,
          statusCode: response.status,
        };
      }

      return data;
    } catch (error) {
      console.error('[API Client] Request failed:', { url, error });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
