import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const existingUser = await prisma.user.findUnique({
          where: { email: credentials?.email }
        });
        if (!existingUser) {
          return null;
        }

        const passwordMatch = await compare(credentials.password, existingUser.password as string)
        if (!passwordMatch) {
          return null;
        }
        return {
          id: existingUser.id.toString(),
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || token.id; // ใช้ id จากฐานข้อมูล
        token.username = user.username || user.name;
        token.email = user.email;
        token.role = user.role || 'user';
      }
      return token;
    },

    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.id = token.id || null; // ดึง id จาก token
        session.user.name = token.username;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },

    async signIn({ profile }) {
      if (profile?.email) {
        const user = await prisma.user.upsert({
          where: {
            email: profile.email,
          },
          create: {
            email: profile.email,
            name: profile.name ?? "Unknown",
            password: '',
          },
          update: {
            name: profile.name ?? "Unknown",
          },
        });

        profile.id = user.id.toString(); // เพิ่ม id จากฐานข้อมูลใน profile
      }
      return true;
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET, // กำหนด secret สำหรับ JWT
};
