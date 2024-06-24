"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
const SignOut = () => {
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <Button
      className="w-full bg-red-800/50 border-[1.5px] border-white/10 hover:bg-red-500/50 font-semibold text-md "
      onClick={handleSignOut}
    >
      Sign out
    </Button>
  );
};

export default SignOut;
