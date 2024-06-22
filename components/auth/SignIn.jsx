"use client";
import { Button } from "@/components/ui/Button";
import { signIn } from "next-auth/react";
const SignIn = () => {
  // create async function to handle sign in
  const handleSignIn = async () => {
    // call signIn function from next-auth/react
    await signIn("google", { callbackUrl: "/" });
  };
  return (
    <Button
      className="w-full bg-secondary border-[1.5px] border-white/10 hover:bg-white/5 font-semibold text-md "
      onClick={handleSignIn}
    >
      Sign in
    </Button>
  );
};

export default SignIn;
