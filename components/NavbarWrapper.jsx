"use client";
import posthog from "posthog-js";
import ThemeSwitcher from "./ThemeSwitcher";
import Profile from "@/components/auth/Profile";
import SignIn from "@/components/auth/SignIn";
import { getUserByEmail } from "@/src/queries";
import { useState, useEffect } from "react";
import PageSelector from "@/components/PageSelector";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import { useMediaQuery } from "@/lib/media";
import NotesButton from "./NotesButton";
import Link from "next/link";
const NavbarWrapper = ({ children }) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
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
      getUserByEmail(email).then((data) => {
        setUser(data[0]);
      });
    }
  }, [email]);
  // identify user in posthog acc to user state
  useEffect(() => {
    if (user) {
      posthog.identify(user.id, {
        email: user.email,
        name: user.name,
        role: user.role,
      });
    }
  }, [user]);

  return (
    <div
      className="w-full h-full flex flex-col bg-base rounded-2xl"
      style={{
        height: "100%",
      }}
    >
      {/* if isMobile render mobile nav else nav */}
      {isMobile ? (
        <MobileNavbar session={session} status={status} user={user} />
      ) : (
        <Navbar session={session} status={status} user={user} />
      )}
      {/* <Navbar session={session} status={status} user={user} />
      <MobileNavbar session={session} status={status} user={user} /> */}
      <main className="w-full h-full flex flex-col pb-10">{children}</main>
    </div>
  );
};

function Navbar({ session, status, user }) {
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
      <div className="flex gap-3">
        <Link
          href="https://tejasbhovad.github.io/docs/"
          className="w-auto px-4 h-full flex items-center justify-center bg-secondary text-text/85 font-semibold rounded-md hover:util hover:text-text/100 transition-all duration-200 ease-in-out border-[1.5px] border-border"
        >
          &lt;docs&gt;
        </Link>
        <ThemeSwitcher />
        {status === "loading" && <span>Loading...</span>}
        {session && status === "authenticated" && (
          <>
            {/* <span>Welcome, {session.user.name}</span>
            <SignOut /> */}
            <Profile
              name={session.user.name}
              role={user?.role}
              image={session?.user?.image}
            />
          </>
        )}
        {!session && status !== "loading" && <SignIn />}
      </div>
    </motion.nav>
  );
}

function MobileNavbar({ session, status, user }) {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  return (
    <motion.nav
      className="flex sm:hidden h-28 w-full bg-secondary items-center px-4 gap-3 py-2 flex-col"
      variants={{
        hidden: { y: -60 },
        visible: { y: 0 },
      }}
      initial="hidden"
      animate={isSmallScreen ? "visible" : "hidden"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="h-1/2 w-full flex justify-between">
        <div className="w-auto">
          <NotesButton />
        </div>
        <div className="w-auto">
          <PageSelector />
        </div>
      </div>
      <div className="h-1/2 gap-1 w-full flex items-center justify-between">
        <SearchBar />
        {session && status === "authenticated" && (
          <Profile
            name={session?.user.name}
            role={user?.role}
            image={session?.user?.image}
            isMobile="true"
          />
        )}
        {!session && status !== "loading" && <SignIn />}
      </div>
    </motion.nav>
  );
}

export default NavbarWrapper;
