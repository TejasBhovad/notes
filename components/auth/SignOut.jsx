"use client";
import { Button } from "@/components/ui/Button";
import { signOut } from "next-auth/react";
const SignOut = () => {
  const handleSignOut = async () => {
    await signOut();
  };
  return (
    <Button
      className="w-full bg-secondary border-[1.5px] border-white/10 hover:bg-white/5 font-semibold text-md "
      onClick={handleSignOut}
    >
      Sign out
    </Button>
  );
};

export default SignOut;
