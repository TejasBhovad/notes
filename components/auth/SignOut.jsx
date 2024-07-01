"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
const SignOut = () => {
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <Button
      className="w-full bg-danger border-[1.5px] border-dangerMuted hover:bg-dangerMuted font-semibold text-md text-white"
      onClick={handleSignOut}
    >
      Sign out
    </Button>
  );
};

export default SignOut;
