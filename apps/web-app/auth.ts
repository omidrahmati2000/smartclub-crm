import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import './auth.types';

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
