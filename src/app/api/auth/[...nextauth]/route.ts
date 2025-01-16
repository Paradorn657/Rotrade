import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../../../../lib/prisma";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

const authOption: NextAuthOptions = {
    session:{
        strategy: 'jwt'
    },
    providers:[
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks:{
        async signIn({account,profile}) {
            if (!profile?.email){
                throw new Error("No profile")
            }

            await prisma.user.upsert({
                where:{
                    email:profile.email,
                },
                create:{
                    email:profile.email,
                    name:profile.name
                },
                update:{
                    name:profile.name
                }
            })
            if (!user) {
                throw new Error('No user found')
            }
            token.id = user.id
            return token
        }
    }
}