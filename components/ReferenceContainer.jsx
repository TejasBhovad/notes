import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDeleteReferenceMutation } from "@/data/reference";
const ReferenceContainer = ({ role, name, url, id }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getYouTubeVideoId = (url) => {
    const regex =
      /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const youTubeVideoId = getYouTubeVideoId(url);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const deleteReference = useDeleteReferenceMutation();
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (role !== "admin") {
      alert("You do not have permission to delete references");
      return;
    }
    deleteReference.mutate(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="w-96 h-auto flex flex-col bg-secondary px-4 pb-4 rounded-md border-[1.5px] border-white/10 relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="px-2 py-2 overflow-x-auto font-semibold">{name}</span>{" "}
      {role === "admin" && (
        <div
          className="absolute aspect-square top-2 right-2 bg-red-500/50 text-white h-6 rounded-md cursor-pointer flex items-center justify-center"
          onClick={handleDelete}
        >
          ✕
        </div>
      )}
      {youTubeVideoId && (
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="aspect-video h-full bg-red-300 rounded-sm overflow-hidden relative"
        >
          <Image
            width={560}
            height={315}
            src={`https://img.youtube.com/vi/${youTubeVideoId}/hqdefault.jpg`}
            alt={name}
            className="w-full h-full object-cover"
          />
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <span className="text-white font-semibold">
                  Watch on YouTube
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      )}
    </motion.div>
  );
};

export default ReferenceContainer;
