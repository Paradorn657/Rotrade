import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role:string
    };
  }

  interface User extends DefaultUser {
    role?: string; // ทำให้ role เป็น optional
  }
}