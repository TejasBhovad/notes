"use client";
import NavbarWrapper from "@/components/NavbarWrapper";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/lib/media";
const SidebarWrapper = ({ children }) => {
  return (
    <div className="w-full h-full">
      <Sidebar />
      <main className="w-full h-full flex flex-col">
        <NavbarWrapper>{children}</NavbarWrapper>
      </main>
    </div>
  );
};

function Sidebar() {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  return (
    <motion.nav
      className="sm:flex hidden z-10 w-48 h-full flex-1 absolute bg-slate-900"
      variants={{
        hidden: { x: -196 },
        visible: { x: 0 },
      }}
      initial="hidden"
      animate={isSmallScreen ? "hidden" : "visible"}
      transition={{ duration: 0.15, ease: "easeInOut", delay: 0.15 }}
    >
      Sidebar
    </motion.nav>
  );
}

export default SidebarWrapper;
