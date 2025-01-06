import Dropdown from "./logo/Dropdown";
import { motion, AnimatePresence } from "framer-motion";
import ReferenceCard from "@/components/ReferenceCard";
import FolderCard from "@/components/FolderCard";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { useFetchFolders } from "@/data/folder";
const SidebarDropdown = ({ name, id, subject_slug, folders }) => {
  const [isOpen, setIsOpen] = useState(false);
  const transformedFolders = folders?.map((folder) => ({
    name: folder.name,
    slug: folder.name.toLowerCase().replace(/\s+/g, "-"),
    id: folder.id,
  }));

  return (
    <Collapsible
      key={id}
      className="w-full h-auto flex flex-col gap-2 bg-util/15 rounded-sm p-1"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className="w-full text-left text-xs pl-1 font-semibold uppercase text-text flex gap-2 items-center">
        <Link
          href={`/${subject_slug}`}
          className="h-full flex items-center w-full truncate"
        >
          <span className="w-full text-nowrap">{name}</span>
        </Link>
        <CollapsibleTrigger className="h-full aspect-square">
          <motion.div
            animate={{
              rotate: isOpen ? 180 : 0,
            }}
            transition={{
              duration: 0.3,
            }}
          >
            <Dropdown dim={20} />
          </motion.div>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="gap-2 flex flex-col">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="collapsed"
              animate="open"
              exit="collapsed"
              className="gap-1 flex flex-col w-full overflow-hidden"
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 },
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ReferenceCard link={`/${subject_slug}/reference`} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex flex-col gap-2"
              >
                {transformedFolders?.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    folder_slug={folder.slug}
                    name={folder.name}
                    subject_slug={subject_slug}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CollapsibleContent>
      {name === "Curriculum" && (
        <div className="my-0 border-b border-border w-full"></div>
      )}
    </Collapsible>
  );
};

export default SidebarDropdown;
