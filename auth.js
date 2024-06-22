import NextAuth from "next-auth";
import { getUserByEmail, createUser } from "@/src/queries";
import Google from "next-auth/providers/google";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user }) {
      try {
        console.log("USER", user);
        // Attempt to get the user by email
        const existingUser = await getUserByEmail(user.email);
        console.log("existingUser", existingUser);
        if (
          existingUser === undefined ||
          existingUser === null ||
          !existingUser ||
          existingUser.length === 0
        ) {
          console.log("User does not exist, adding user");
          await createUser({
            name: user.name,
            email: user.email,
            image: user.image,
          });
        }
        // Return true to continue the sign-in process
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        throw new Error("Failed to execute database operations");
      }
    },
  },
});
