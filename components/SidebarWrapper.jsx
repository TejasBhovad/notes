"use client";
import SidebarDropdown from "./SidebarDropdown";
import NavbarWrapper from "@/components/NavbarWrapper";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/lib/media";
import NotesButton from "@/components/NotesButton";
import { NotesContext } from "@/providers/NotesContext";
import { useContext } from "react";

const SidebarWrapper = ({ children }) => {
  return (
    <div className="sidebar-wrapper w-full min-h-screen bg-base">
      <Sidebar />
      <main className="w-full h-screen min-h-full flex flex-col sm:pl-52">
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
  const {
    data: notes,
    isLoading: notesLoading,
    isError: notesIsError,
    error: notesError,
  } = useContext(NotesContext);

  // if (notesLoading) return <div>Loading...</div>;
  // if (notesIsError) return <div>Error: {error.message}</div>;
  const transformedData =
    notes &&
    notes
      .map((item) => {
        const transformedFolders = item.folders?.map((folder) => ({
          name: folder.name,
          slug: folder.name.toLowerCase().replace(/\s+/g, "-"),
          id: folder.id,
        }));

        return {
          name: item.subject.name,
          slug: item.subject.name.toLowerCase().replace(/\s+/g, "-"),
          id: item.subject.id,
          last_updated: item.subject.updated_at,
          folders: transformedFolders,
        };
      })
      .sort((a, b) => {
        // Move the "Curriculum" subject to the front of the array
        if (a.name.toLowerCase() === "curriculum") return -1;
        if (b.name.toLowerCase() === "curriculum") return 1;
        return 0;
      });
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  return (
    <motion.nav
      className="sm:flex hidden z-10 w-52 h-full flex-1 absolute bg-secondary py-2 px-4 gap-8 flex-col gap-2"
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
            name={item.name}
            id={item.id}
            subject_slug={item.slug}
            folders={item.folders}
          />
        ))}
      </div>
      {/* {JSON.stringify(transformedData)} */}
    </motion.nav>
  );
}

export default SidebarWrapper;
