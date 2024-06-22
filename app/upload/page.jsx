"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUserByEmail } from "@/src/queries";
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
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (!session || status !== "authenticated") {
    return <div>Not authenticated</div>;
  }
  if (user && user.role !== "admin") {
    return (
      <div>
        <h1>Unauthorized</h1>
        <p>You do not have permission to view this page</p>
        {JSON.stringify(user)}
      </div>
    );
  }
  if (status === "authenticated" && !user) {
    return <div>Loading user...</div>;
  }
  return <div>Admin only</div>;
};

export default page;
