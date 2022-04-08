import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../models/user";
import dbConnect from "../../../config/dbConnect";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      async authorize(credentials, req) {
        dbConnect();

        const { email, password } = credentials;

        if (!email || !password) {
          throw new Error("Please enter email or password");
        }

        const user = await User.findOne({ email }, "password name email role");

        console.log(user);

        if (!user) {
          throw new Error("Invalid Email or Password");
        }

        const isPasswordMached = await user.comparePassword(password);

        if (!isPasswordMached) {
          throw new Error("Invalid Email or Password");
        }

        return Promise.resolve(user);
      },
    }),
  ],
  callbacks: {
    // async signIn({ user, account, profile, email, credentials }) {
    //   return true;
    // },
    // async redirect({ url, baseUrl }) {
    //   return baseUrl;
    // },
    async session({ session, user, token }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      user && (token.user = user);
      return token;
    },
  },
});
