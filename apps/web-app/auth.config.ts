import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { allMockUsers } from '@smartclub/mock-data';
import './auth.types';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnCustomerArea = nextUrl.pathname.startsWith('/my-bookings') ||
        nextUrl.pathname.startsWith('/profile') ||
        nextUrl.pathname.startsWith('/wallet') ||
        nextUrl.pathname.startsWith('/matches') ||
        nextUrl.pathname.startsWith('/chat') ||
        nextUrl.pathname.startsWith('/feed') ||
        nextUrl.pathname.startsWith('/leaderboard') ||
        nextUrl.pathname.startsWith('/notifications');

      if (isOnCustomerArea) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? '';
        token.userType = user.userType;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.userType = token.userType as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        // Mock authentication - find user by email
        const user = allMockUsers.find((u) => u.email === email);

        if (!user) {
          return null;
        }

        // In mock mode, accept any password
        // In production, you would verify password hash here
        if (password) {
          const name = `${user.firstName} ${user.lastName}`;
          const role = 'role' in user ? user.role : '';

          return {
            id: user.id,
            name,
            email: user.email,
            image: user.avatarUrl,
            userType: user.userType,
            role,
          };
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
