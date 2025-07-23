import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        id: { label: 'ID', type: 'text' },
        token: { label: 'ID', type: 'text' },
        userName: { label: 'ID', type: 'text' },
        fatherName: { label: 'ID', type: 'text' },
        rollNo: { label: 'ID', type: 'text' },
        email: { label: 'Email', type: 'email' },
        departmentName: { label: 'ID', type: 'text' },
        semester: { label: 'ID', type: 'text' },
        type: { label: 'Type', type: 'text', placeholder: 'user' },
      },
      async authorize(credentials: any) {
        const {
          id,
          token,
          userName,
          fatherName,
          rollNo,
          email,
          departmentName,
          semester,
          type,
        } = credentials;

        console.log('-->', credentials);

        try {
          // If success is true, return the user data
          return Promise.resolve({
            id: id,
            token: token,
            userName: userName,
            fatherName: fatherName,
            rollNo: rollNo,
            email: email,
            departmentName: departmentName,
            semester: semester,
            type: type,
          });
        } catch (error: any) {
          console.error('Login Error:', error.message);
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }: any) => {
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      session.user = token;
      return session;
    },
    authorized: async ({ auth }: any) => {
      return !!auth?.user; // Return true if user is authenticated
    },
  },
  pages: {
    signIn: '/login', // Redirect to this page if not authenticated
    signOut: '/login', // Redirect to this page after sign out
  },
  secret: process.env.NEXTAUTH_SECRET, // Must be set in .env
  session: {
    strategy: 'jwt', // Use JWT for session strategy
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug logs in development
});

export default NextAuth;
