import { getServerSession, NextAuthOptions } from "next-auth"
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
          role: existingUser.role,
          create_at:existingUser.create_at
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, profile ,trigger}) {

        if (account?.provider === 'google' && profile?.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: profile.email },
          });


          if (dbUser) {
            token.id = dbUser.id; // ใช้ id จากฐานข้อมูลแทน Google ID
            token.username = dbUser.name;
            token.email = dbUser.email;
            token.role = dbUser.role;
            token.provider = "google"
            token.createdDate = dbUser.create_at

          }
        } else {
          if (user) {
            console.log(user)
            token.id = user.id// ใช้ id จากฐานข้อมูล
            token.username = user.name;
            token.email = user.email;
            token.role = user.role;
            token.provider = "credentials"
            token.createdDate = user.create_at
        }
        }

        if (trigger === 'update') {
          const refreshedUser = await prisma.user.findUnique({
            where: { id: Number(token.id )},
          });
        
          if (refreshedUser) {
            token.id = token.id;
            token.username = refreshedUser.name;
            token.email = refreshedUser.email;
            token.role = refreshedUser.role;
            token.createdDate = refreshedUser.create_at;
        
            // เก็บข้อมูลบางอย่างจาก token เดิม
            token.image = token.image;
            token.provider = token.provider;
          }
        }
      return token;
    },

    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.id = token.id || null; // ดึง id จาก token
        session.user.name = token.username;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.provider = token.provider;
        session.user.createDate = token.createdDate
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
      }
      return true;
    },
  },

  secret: process.env.NEXTAUTH_SECRET, // กำหนด secret สำหรับ JWT
};

export const authSession = async () =>{
  return getServerSession(authOptions);
}
