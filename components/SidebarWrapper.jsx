"use client";
import SidebarDropdown from "./SidebarDropdown";
import { useFetchSubjects } from "@/data/subject";
import NavbarWrapper from "@/components/NavbarWrapper";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/lib/media";
import NotesButton from "@/components/NotesButton";

const SidebarWrapper = ({ children }) => {
  return (
    <div className="sidebar-wrapper w-full min-h-screen bg-base">
      <Sidebar />
      <main className="w-full h-screen min-h-full flex flex-col sm:pl-48">
        <motion.div
          className="w-full bg-secondary h-full min-h-full"
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

function Sidebar() {
  const { data, isLoading, isError, error } = useFetchSubjects();
  const transformedData =
    data &&
    data
      .map((item) => ({
        value: item.name.toLowerCase().replace(/\s/g, "-"),
        label: item.name,
        id: item.id,
      }))
      .sort((a, b) => {
        // Move the "Curriculum" subject to the front of the array
        if (a.label.toLowerCase() === "curriculum") return -1;
        if (b.label.toLowerCase() === "curriculum") return 1;
        return 0;
      });
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
      <div className="w-full h-full flex flex-col gap-4">
        {transformedData?.map((item) => (
          <SidebarDropdown
            key={item.id}
            name={item.label}
            id={item.id}
            subject_slug={item.value}
          />
        ))}
      </div>
    </motion.nav>
  );
}

export default SidebarWrapper;
