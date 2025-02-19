"use client";
import UploadPage from "@/components/UploadPage";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUserByEmail } from "@/src/queries";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, ShieldAlert, Lock, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const LoadingState = ({ message = "Loading..." }) => (
  <div className="w-full h-[80vh] flex flex-col items-center justify-center space-y-6">
    <Loader2 className="h-12 w-12 animate-spin text-primary/60" />
    <div className="space-y-2 text-center">
      <h1 className="text-2xl font-semibold text-primary/80">{message}</h1>
      <p className="text-muted-foreground text-sm max-w-sm">
        Please wait while we fetch your user data
      </p>
    </div>
  </div>
);

const UnauthenticatedState = () => (
  <div className="w-full h-[80vh] flex flex-col items-center justify-center space-y-6">
    <UserX className="h-12 w-12 text-destructive/60" />
    <div className="space-y-2 text-center">
      <h1 className="text-2xl font-semibold text-destructive/80">
        Not Authenticated
      </h1>
      <p className="text-muted-foreground text-sm max-w-sm">
        Please sign in to access this page
      </p>
    </div>
    <Button
      onClick={() => signIn()}
      className="bg-primary/20 hover:bg-primary/30 text-white"
    >
      Sign In
    </Button>
  </div>
);

const UnauthorizedState = () => (
  <div className="w-full h-[80vh] flex flex-col items-center justify-center space-y-6">
    <Lock className="h-12 w-12 text-yellow-500/60" />
    <div className="space-y-2 text-center">
      <h1 className="text-2xl font-semibold text-yellow-500/80">
        Unauthorized Access
      </h1>
      <p className="text-muted-foreground text-sm max-w-sm">
        You do not have sufficient permissions to access this page
      </p>
      <p className="text-xs text-muted-foreground">
        Please contact an administrator if you believe this is an error
      </p>
    </div>
  </div>
);

const ErrorState = ({ error, retry }) => (
  <div className="w-full h-[80vh] flex flex-col items-center justify-center space-y-6">
    <ShieldAlert className="h-12 w-12 text-destructive/60" />
    <div className="space-y-2 text-center">
      <h1 className="text-2xl font-semibold text-destructive/80">Error</h1>
      <p className="text-muted-foreground text-sm max-w-sm">
        {error || "An error occurred while fetching your data"}
      </p>
    </div>
    {retry && (
      <Button
        onClick={retry}
        className="bg-primary/20 hover:bg-primary/30 text-white"
      >
        Try Again
      </Button>
    )}
  </div>
);

const Page = () => {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (session) {
      setEmail(session.user.email);
    }
  }, [session]);

  useEffect(() => {
    const fetchUser = async () => {
      if (email) {
        try {
          const res = await getUserByEmail(email);
          if (res && res[0]) {
            setUser(res[0]);
          } else {
            setError("User data not found");
            toast({
              variant: "destructive",
              title: "Error",
              description: "Failed to fetch user data",
            });
          }
        } catch (err) {
          setError(err.message);
          toast({
            variant: "destructive",
            title: "Error",
            description: "An error occurred while fetching user data",
          });
        }
      }
    };

    fetchUser();
  }, [email, toast]);

  if (status === "loading") {
    return <LoadingState message="Initializing..." />;
  }

  if (!user && status === "authenticated") {
    return <LoadingState message="Loading User Data..." />;
  }

  if (error) {
    return (
      <ErrorState
        error={error}
        retry={() => {
          setError(null);
          setUser(null);
          if (email) {
            getUserByEmail(email).then((res) => {
              setUser(res[0]);
            });
          }
        }}
      />
    );
  }

  if (!session || status !== "authenticated") {
    return <UnauthenticatedState />;
  }

  if (user && user.role !== "admin") {
    return <UnauthorizedState />;
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <UploadPage session={session} user={user} />
      </div>
    </div>
  );
};

export default Page;
