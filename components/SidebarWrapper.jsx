"use client";
import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "@/lib/media";
import SidebarDropdown from "./SidebarDropdown";
import NavbarWrapper from "@/components/NavbarWrapper";
import NotesButton from "@/components/NotesButton";
import { NotesContext } from "@/providers/NotesContext";

const SidebarSkeleton = () => (
  <div className="flex flex-col gap-4 w-full animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="w-full">
        <div className="h-8 bg-border/30 rounded-md mb-2"></div>
      </div>
    ))}
  </div>
);

const sidebarVariants = {
  hidden: {
    x: -196,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "easeInOut",
      stiffness: 400,
      damping: 20,
      mass: 1,
    },
  },
  exit: {
    x: -196,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const contentVariants = {
  hidden: {
    x: -50,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 1,
      staggerChildren: 0.1,
    },
  },
};

const Sidebar = () => {
  const { data: notes, isLoading } = useContext(NotesContext);
  const isSmallScreen = useMediaQuery("(max-width: 640px)");

  const transformedData = notes
    ?.map((item) => ({
      name: item.subject.name,
      slug: item.subject.name.toLowerCase().replace(/\s+/g, "-"),
      id: item.subject.id,
      last_updated: item.subject.updated_at,
      folders: item.folders?.map((folder) => ({
        name: folder.name,
        slug: folder.name.toLowerCase().replace(/\s+/g, "-"),
        id: folder.id,
      })),
    }))
    .sort((a, b) => {
      if (a.name.toLowerCase() === "curriculum") return -1;
      if (b.name.toLowerCase() === "curriculum") return 1;
      return 0;
    });

  return (
    <AnimatePresence>
      {!isSmallScreen && (
        <motion.nav
          className="sm:flex hidden z-10 w-52 h-full flex-1 fixed left-0 bg-secondary py-2 px-4 gap-8 flex-col border-r border-border/0"
          variants={sidebarVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <NotesButton />
            </motion.div>

            <motion.div
              className="w-full h-full flex flex-col gap-4"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              {isLoading ? (
                <SidebarSkeleton />
              ) : (
                transformedData?.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <SidebarDropdown
                      name={item.name}
                      id={item.id}
                      subject_slug={item.slug}
                      folders={item.folders}
                    />
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

const SidebarWrapper = ({ children }) => {
  return (
    <div className="sidebar-wrapper w-full min-h-screen bg-base">
      <Sidebar />
      <main className="w-full h-screen min-h-full flex flex-col sm:pl-52">
        <motion.div
          className="w-full bg-secondary h-full min-h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <NavbarWrapper>{children}</NavbarWrapper>
        </motion.div>
      </main>
    </div>
  );
};

export default SidebarWrapper;
