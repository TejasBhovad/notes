"use client";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/lib/media";
const NavbarWrapper = ({ children }) => {
  return (
    <div className="w-full h-full">
      <Navbar />
      <MobileNavbar />
      <main className="w-full h-full pt-14 sm:pl-48 flex flex-col">
        {children}
      </main>
    </div>
  );
};

function Navbar() {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  return (
    <motion.nav
      className="hidden sm:flex pl-48 absolute h-14 w-full bg-slate-700"
      variants={{
        hidden: { y: -60 },
        visible: { y: 0 },
      }}
      initial="hidden"
      animate={isSmallScreen ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      dekstop nav
    </motion.nav>
  );
}

function MobileNavbar() {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  return (
    <motion.nav
      className="flex sm:hidden h-14 w-full bg-slate-700 absolute"
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
