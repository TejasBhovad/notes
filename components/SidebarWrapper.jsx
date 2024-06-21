"use client";
import NavbarWrapper from "@/components/NavbarWrapper";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/lib/media";
import NotesButton from "@/components/NotesButton";
const SidebarWrapper = ({ children }) => {
  return (
    <div className="w-full h-full bg-base">
      <Sidebar />
      <main className="w-full h-full flex flex-col sm:pl-48">
        <motion.div
          className="w-full h-full bg-secondary"
          variants={{
            hidden: { x: -196 },
            visible: { x: 0 },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.15, ease: "easeInOut", delay: 0.15 }}
        >
          <NavbarWrapper>{children}</NavbarWrapper>
        </motion.div>
      </main>
    </div>
  );
};

function Sidebar() {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  return (
    <motion.nav
      className="sm:flex hidden z-10 w-48 h-full flex-1 absolute bg-secondary py-2 px-4"
      variants={{
        hidden: { x: -196 },
        visible: { x: 0 },
      }}
      initial="hidden"
      animate={isSmallScreen ? "hidden" : "visible"}
      transition={{ duration: 0.15, ease: "easeInOut", delay: 0.15 }}
    >
      <NotesButton />
    </motion.nav>
  );
}

export default SidebarWrapper;
