import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      role:string
      image:string
      provider:string
      createDate:DateTime
    };
  }

  interface User extends DefaultUser {
    role?: string; // ทำให้ role เป็น optional
    create_at:DateTime
  }

}