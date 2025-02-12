import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Dropdown from "./logo/Dropdown";
import ReferenceCard from "@/components/ReferenceCard";
import FolderCard from "@/components/FolderCard";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
      className="w-full flex flex-col gap-2 rounded-sm"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className="w-full h-8 flex items-center justify-between text-text bg-secondary hover:bg-border/10 transition-colors rounded-md px-2">
        <Link
          href={`/${subject_slug}`}
          className="h-full w-5/6 flex-1 flex items-center"
        >
          <span className="text-xs font-semibold uppercase truncate ">
            {name}
          </span>
        </Link>
        <CollapsibleTrigger className="h-8 w-8 flex items-center justify-center">
          <motion.div
            animate={{
              rotate: isOpen ? 180 : 0,
            }}
            transition={{
              duration: 0.2,
              ease: [0.32, 0.72, 0, 1],
            }}
          >
            <Dropdown dim={20} />
          </motion.div>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="pl-2">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial="collapsed"
              animate="open"
              exit="collapsed"
              className="flex flex-col gap-2 overflow-hidden"
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 },
              }}
              transition={{
                duration: 0.2,
                ease: [0.32, 0.72, 0, 1],
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.2,
                  ease: [0.32, 0.72, 0, 1],
                }}
              >
                <ReferenceCard link={`/${subject_slug}/reference`} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.2,
                  delay: 0.05,
                  ease: [0.32, 0.72, 0, 1],
                }}
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
        <div className=" border-b border-util/50 w-full"></div>
      )}
    </Collapsible>
  );
};

export default SidebarDropdown;
