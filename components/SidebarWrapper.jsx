"use client";
import ReferenceCard from "@/components/ReferenceCard";
import FolderCard from "@/components/FolderCard";
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
          viewport={{ once: true }}
          transition={{ duration: 0.15, ease: "easeInOut", delay: 0.15 }}
        >
          <NavbarWrapper>{children}</NavbarWrapper>
        </motion.div>
      </main>
    </div>
  );
};

const subjectContent = [
  {
    type: "reference",
    link: "/",
  },
  {
    type: "folder",
    name: "main",
    link: "/",
  },
  {
    type: "folder",
    name: "mse qbank",
    link: "/",
  },
];

function Sidebar() {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  return (
    <motion.nav
      className="sm:flex hidden z-10 w-48 h-full flex-1 absolute bg-secondary py-2 px-4 gap-8 flex-col gap-2"
      variants={{
        hidden: { x: -196 },
        visible: { x: 0 },
      }}
      viewport={{ once: true }}
      initial="hidden"
      animate={isSmallScreen ? "hidden" : "visible"}
      transition={{ duration: 0.15, ease: "easeInOut", delay: 0.15 }}
    >
      <NotesButton />
      <div className="w-full h-full flex flex-col gap-2">
        <div className="w-full h-full flex flex-col gap-2">
          <span className="text-sm px-1 font-semibold text-white/50">
            AI IN BUSINESS
          </span>
          <ReferenceCard link="/" />
          <FolderCard link="/" name="main" />
        </div>
      </div>
    </motion.nav>
  );
}

export default SidebarWrapper;
