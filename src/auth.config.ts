import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthRoute = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/signup');
      
      const isProtected = 
        nextUrl.pathname.startsWith('/dashboard') || 
        nextUrl.pathname.startsWith('/strategy') ||
        nextUrl.pathname.startsWith('/leads') ||
        nextUrl.pathname.startsWith('/onboarding');

      if (isAuthRoute) {
        if (isLoggedIn) return Response.redirect(new URL('/dashboard', nextUrl));
        return true;
      }

      if (isProtected && !isLoggedIn) {
        return false; // Redirects to signIn page automatically
      }
      return true;
    },
    async jwt({ token, user }) {
        if (user) {
            token.id = user.id;
        }
        return token;
    },
    async session({ session, token }) {
        if (token?.id) {
            session.user.id = token.id as string;
        }
        return session;
    }
  },
  session: {
      strategy: "jwt",
  },
  providers: [], // Handled in auth.ts
} satisfies NextAuthConfig;
