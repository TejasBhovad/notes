"use client";
import ManagePage from "@/components/ManagePage";
import { useSession } from "next-auth/react";
import { getUserByEmail } from "@/src/queries";
import { useEffect, useState } from "react";

const page = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (session) {
      getUserByEmail(session.user.email).then((res) => {
        setUser(res[0]);
      });
    }
  }, [session]);

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

  return (
    <div className="w-full h-full">
      <ManagePage session={session} user={user} />
    </div>
  );
};

export default page;
