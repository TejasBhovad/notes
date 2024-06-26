import React from "react";
import Link from "next/link";
import Download from "./logo/Download";
import Doc from "./logo/Doc";
import { motion } from "framer-motion";
const NotesContainer = ({ name, url }) => {
  function downloadFile(url) {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        // link.setAttribute("download", "file.pdf");
        // download as the original file name.pdf
        link.setAttribute("download", `${name}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
  }
  return (
    <motion.div
      className="p-4 bg-white/5 shadow-md text-lg font-medium rounded-md flex items-center justify-between"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Link className="items-center gap-4 w-full flex" href={url}>
        <Doc size={27} />
        <p>{name}</p>
      </Link>
      <button
        onClick={() => downloadFile(url)}
        className="h-full aspect-square p-1 rounded-md bg-white/5 hover:bg-white/10 border-[1.5px] border-white/10 hover:border-white/20 transition-colors"
      >
        <Download />
      </button>
    </motion.div>
  );
};

export default NotesContainer;
