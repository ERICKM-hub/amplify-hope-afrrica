import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            console.log('❌ Missing credentials');
            return null;
          }

          console.log('🔍 Looking for user:', credentials.username);
          await connectToDatabase();
          
          const user = await User.findOne({ username: credentials.username });
          if (!user) {
            console.log('❌ User not found:', credentials.username);
            return null;
          }

          console.log('✅ User found:', user.username);
          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            console.log('❌ Invalid password for:', credentials.username);
            return null;
          }

          console.log('✅ Authentication successful for:', user.username);
          return { 
            id: user._id.toString(), 
            username: user.username,
            email: user.email, 
            name: user.name,
            role: user.role 
          };
        } catch (error) {
          console.error('❌ Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler for GET and POST
export const GET = handler;
export const POST = handler;
