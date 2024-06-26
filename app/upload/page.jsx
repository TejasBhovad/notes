"use client";
import UploadPage from "@/components/UploadPage";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUserByEmail } from "@/src/queries";
import { useToast } from "@/components/ui/use-toast";
const page = () => {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (session) {
      setEmail(session.user.email);
    }
  }, [session]);
  useEffect(() => {
    if (email) {
      getUserByEmail(email).then((res) => {
        setUser(res[0]);
      });
    }
  }, [email]);
  if (status === "loading" || !user) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center font-medium text-xl">
        <h1>Loading...</h1>
        <p>Please wait while we fetch your user data.</p>
      </div>
    );
  }
  if (!session || status !== "authenticated") {
    return (
      <div className="w-full h-full flex items-center justify-center font-medium text-xl">
        Not authenticated
      </div>
    );
  }
  if (user && user.role !== "admin") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center font-medium text-xl">
        <h1>Unauthorized</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }
  if (status === "authenticated" && !user) {
    return (
      <div className="w-full h-full flex items-center  justify-center font-medium text-xl">
        Loading user...
      </div>
    );
  }
  return (
    <div className="w-full h-full">
      <UploadPage session={session} user={user} />
    </div>
  );
};
export default page;
