"use client";
import Profile from "@/components/auth/Profile";
import SignIn from "@/components/auth/SignIn";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import { useMediaQuery } from "@/lib/media";
const NavbarWrapper = ({ children }) => {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  useEffect(() => {
    if (session) {
      setEmail(session.user.email);
    }
  }, [session]);
  return (
    <div className="w-full h-full flex flex-col bg-base rounded-2xl">
      <Navbar session={session} status={status} />
      <MobileNavbar />
      <main className="w-full h-full flex flex-col">{children}</main>
    </div>
  );
};

function Navbar({ session, status }) {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  return (
    <motion.nav
      className="hidden sm:flex h-14 w-full bg-transparent py-2 gap-3 px-3"
      variants={{
        hidden: { y: -60 },
        visible: { y: 0 },
      }}
      initial="hidden"
      animate={isSmallScreen ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="w-full">
        <SearchBar />
      </div>
      <div className="">
        {status === "loading" && <span>Loading...</span>}
        {session && status === "authenticated" && (
          <>
            {/* <span>Welcome, {session.user.name}</span>
            <SignOut /> */}
            <Profile
              name={session.user.name}
              role={"student"}
              image={session?.user?.image}
            />
          </>
        )}
        {!session && status !== "loading" && <SignIn />}
      </div>
    </motion.nav>
  );
}

function MobileNavbar() {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  return (
    <motion.nav
      className="flex sm:hidden h-14 w-full bg-secondary"
      variants={{
        hidden: { y: -60 },
        visible: { y: 0 },
      }}
      initial="hidden"
      animate={isSmallScreen ? "visible" : "hidden"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      mobile nav
    </motion.nav>
  );
}

export default NavbarWrapper;
