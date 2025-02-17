import Image from "next/image";
import SignOut from "@/components/auth/SignOut";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Upload from "../logo/Upload";
import Manage from "../logo/Manage";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Profile = ({ image, name, role = "student", isMobile = false }) => {
  const adminButtons = [
    { href: "/upload", icon: <Upload />, text: "Upload" },
    { href: "/manage", icon: <Manage />, text: "Manage" },
  ];

  return (
    <Popover>
      <PopoverTrigger>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex h-full backdrop-blur-sm ${
            isMobile
              ? "w-14 flex items-center justify-center"
              : "w-40 bg-util/80 px-2 py-1"
          } rounded-md items-center transition-all duration-200`}
        >
          <div className="h-full aspect-square rounded-full">
            <Image
              src={image}
              alt={name}
              width={36}
              height={36}
              className="rounded-full hover:ring-2 ring-border transition-all duration-200"
            />
          </div>
          {!isMobile && (
            <div className="flex flex-col gap-1 px-2 w-full overflow-hidden">
              <span className="text-start font-medium text-xs w-full overflow-hidden">
                {name}
              </span>
              <motion.span
                key={role}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.2 }}
                className="text-start text-xs text-textMuted w-full"
              >
                {role}
              </motion.span>
            </div>
          )}
        </motion.div>
      </PopoverTrigger>
      <PopoverContent className="text-sm bg-secondary/80 backdrop-blur-md text-text border-border/50 flex flex-col gap-2 w-auto overflow-hidden">
        <AnimatePresence mode="sync">
          {role === "admin" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2"
            >
              {adminButtons.map((button, index) => (
                <motion.div
                  key={button.href}
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{
                    opacity: 1,
                    filter: "blur(0px)",
                    transition: {
                      delay: index * 0.1,
                      duration: 0.2,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    filter: "blur(4px)",
                    transition: {
                      delay: index * 0.05,
                    },
                  }}
                >
                  <Link href={button.href}>
                    <Button className="w-full px-8 text-left font-medium bg-base/50 backdrop-blur-sm border-[1.5px] border-border/50 hover:bg-util/80 hover:border-border flex gap-2 justify-start transition-all duration-200">
                      {button.icon}
                      {button.text}
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          initial={{ opacity: 0, filter: "blur(2px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{
            delay: role === "admin" ? 0.2 : 0,
            duration: 0.2,
          }}
        >
          <SignOut />
        </motion.div>
      </PopoverContent>
    </Popover>
  );
};

export default Profile;
