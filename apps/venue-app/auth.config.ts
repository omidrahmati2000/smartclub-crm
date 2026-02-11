import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { allMockUsers } from '@smartclub/mock-data/fixtures';
import { UserType } from '@smartclub/types';
import './auth.types';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard =
        nextUrl.pathname.match(/^(\/[a-z]{2})?\/(overview|calendar|bookings|assets|customers|staff|finance|pricing|reports|settings|automation|scoreboard|shop|pos|valet|memberships|wallet|marketing|tournaments|coaches|social)(\/|$)/);

      const isVenueStaff = auth?.user?.userType === UserType.VENUE_STAFF;

      if (isOnDashboard) {
        if (isLoggedIn && isVenueStaff) return true;
        return false; // Redirect non-venue-staff users to login
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? '';
        token.userType = user.userType;
        token.role = user.role;
        token.venueId = user.venueId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.userType = token.userType as string;
        session.user.role = token.role as string;
        session.user.venueId = token.venueId as string | undefined;
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

        // Mock authentication - find venue staff user by email
        const user = allMockUsers.find(
          (u) => u.email === email && u.userType === UserType.VENUE_STAFF,
        );

        if (!user) {
          return null;
        }

        // In mock mode, accept any password
        // In production, you would verify password hash here
        if (password) {
          const name = `${user.firstName} ${user.lastName}`;
          const role = 'role' in user ? user.role : '';
          const venueId = 'venueId' in user ? user.venueId : undefined;

          return {
            id: user.id,
            name,
            email: user.email,
            image: user.avatarUrl,
            userType: user.userType,
            role,
            venueId,
          };
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
