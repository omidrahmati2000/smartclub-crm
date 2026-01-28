import { http, HttpResponse } from 'msw';
import { allMockUsers } from '../fixtures/users';

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const user = allMockUsers.find((u) => u.email === body.email);

    if (!user) {
      return HttpResponse.json(
        { error: 'Invalid credentials', message: 'Email or password is incorrect', statusCode: 401 },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      data: {
        token: `mock-token-${user.id}`,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
        },
      },
      success: true,
    });
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;

    return HttpResponse.json({
      data: {
        token: 'mock-token-new-user',
        user: {
          id: 'user-new-1',
          email: body.email,
          firstName: body.firstName,
          lastName: body.lastName,
          userType: 'customer',
        },
      },
      success: true,
    });
  }),

  http.get('/api/auth/me', () => {
    return HttpResponse.json({
      data: allMockUsers[0],
      success: true,
    });
  }),
];
