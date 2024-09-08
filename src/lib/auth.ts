import type { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "./db";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (!user) {
          return null;
        }
        if (user.password === null) return null;

        if (user.password) {
          const isValid = await compare(credentials.password, user.password!);
          if (!isValid) {
            return null;
          }
        }

        return {
          id: `${user.id}`,
          username: user.username,
          email: user.email,
        };
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
    // signOut: "/signout",
  },
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id + "",
          name: token.name,
          email: token.email,
          image: token.picture,
        };
      }

      return session;
    },
    async jwt({ token, user }) {
      if (token.email !== null) {
        const dbUser = await db.user.findUnique({
          where: { email: token.email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        });

        if (!dbUser) {
          if (user) {
            token.id = user?.id;
          }
          // Ensure that token always has an id property
          if (!token.id) {
            throw new Error("User id is missing");
          }
          return token;
        }
        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          picture: dbUser.image,
        };
      }
      // If token.email is null, throw an error instead of returning undefined
      throw new Error("Token email is null");
    },
  },
};
