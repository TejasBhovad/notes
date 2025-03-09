import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
const SignIn = () => {
  // create async function to handle sign in
  const handleSignIn = async () => {
    // call signIn function from next-auth/react
    await signIn("google", {
      callbackUrl: "/",
      redirect: true,
      redirectTo: "/",
    });
  };
  return (
    <Button
      className="sm:w-full w-24 bg-secondary border-[1.5px] border-border hover:bg-utility font-semibold text-md "
      onClick={handleSignIn}
    >
      Sign in
    </Button>
  );
};

export default SignIn;
