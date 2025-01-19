import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../../../lib/prisma";
import { authOptions } from "../../../../../lib/authOptions";

const handler = NextAuth(authOptions)
export {handler as GET,handler as POST}