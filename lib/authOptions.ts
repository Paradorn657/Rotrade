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
          id: existingUser.id + '',
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
    // การจัดการ JWT token
    async jwt({ token, user }) {
      if (user) {
        // กำหนดข้อมูลที่จำเป็นใน token
        token.username = user.username || user.name;  // ใช้ชื่อผู้ใช้จาก user หรือ name
        token.email = user.email;
        token.role = user.role || 'user';  // กำหนด role เริ่มต้นเป็น 'user'
      }
    
      return token;  // ส่งคืน token ที่อัปเดต
    }
    ,
    // การจัดการ session
    async session({ session, token }: { session: any; token: JWT }) {
      // กำหนดข้อมูลใน session.user จาก token
      if (session.user) {
        session.user.name = token.username;
        session.user.email = token.email;
        session.user.role = token.role;
      }
    
      return session;  // ส่งคืน session ที่อัปเดต
    },

    // การจัดการการ signIn
    async signIn({ profile }) {
      if (profile?.email) {
        await prisma.user.upsert({
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
      }
      return true; // อนุญาตให้ sign in
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET, // กำหนด secret สำหรับ JWT
};
