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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const LoadingSkeleton = ({ isMobile = false }) => (
  <Popover>
    <PopoverTrigger>
      <div
        className={`flex h-full ${
          isMobile
            ? "w-14 flex items-center justify-center"
            : "w-40 bg-util px-2 py-1"
        } rounded-md items-center`}
      >
        <div className="h-9 w-9 bg-secondary rounded-full animate-pulse" />
        {!isMobile && (
          <div className="flex flex-col gap-1 px-2 w-full">
            <div className="h-3 w-20 bg-secondary rounded animate-pulse" />
            <div className="h-3 w-16 bg-secondary rounded animate-pulse" />
          </div>
        )}
      </div>
    </PopoverTrigger>
    <PopoverContent className="text-sm bg-secondary text-text border-border flex flex-col gap-2 w-auto">
      <div className="h-10 w-full bg-util rounded animate-pulse" />
      <div className="h-10 w-full bg-util rounded animate-pulse" />
    </PopoverContent>
  </Popover>
);

const NavbarWrapper = ({ children }) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session) {
      setEmail(session.user.email);
    }
  }, [session]);

  useEffect(() => {
    if (email) {
      getUserByEmail(email)
        .then((data) => {
          setUser(data[0]);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else if (status !== "loading") {
      setIsLoading(false);
    }
  }, [email, status]);

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
      {isMobile ? (
        <MobileNavbar
          session={session}
          status={status}
          user={user}
          isLoading={isLoading}
        />
      ) : (
        <Navbar
          session={session}
          status={status}
          user={user}
          isLoading={isLoading}
        />
      )}
      <main className="w-full h-full flex flex-col pb-10">{children}</main>
    </div>
  );
};

function Navbar({ session, status, user, isLoading }) {
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
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {session && status === "authenticated" && (
              <Profile
                name={session.user.name}
                role={user?.role}
                image={session?.user?.image}
              />
            )}
            {!session && status !== "loading" && <SignIn />}
          </>
        )}
      </div>
    </motion.nav>
  );
}

function MobileNavbar({ session, status, user, isLoading }) {
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
        {isLoading ? (
          <LoadingSkeleton isMobile={true} />
        ) : (
          <>
            {session && status === "authenticated" && (
              <Profile
                name={session?.user.name}
                role={user?.role}
                image={session?.user?.image}
                isMobile={true}
              />
            )}
            {!session && status !== "loading" && <SignIn />}
          </>
        )}
      </div>
    </motion.nav>
  );
}

export default NavbarWrapper;
