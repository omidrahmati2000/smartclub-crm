import type { DefaultSession } from 'next-auth';
import type { JWT as DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      userType: string;
      role: string;
    } & DefaultSession['user'];
  }

  interface User {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    userType: string;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    userType: string;
    role: string;
  }
}
