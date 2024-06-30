import React from "react";
import Link from "next/link";
import posthog from "posthog-js";
import Download from "./logo/Download";
import Doc from "./logo/Doc";
import { useToast } from "./ui/use-toast";
import { motion } from "framer-motion";
import { formatDistance } from "date-fns";
const NotesContainer = ({ name, url, created_by, subject, created_at }) => {
  const { toast } = useToast();
  function downloadFile(url) {
    posthog.capture("downloaded_file", {
      url: url,
      subject: subject,
      created_by: created_by,
      name: name,
    });
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
    toast({
      title: "Success",
      description: "File downloaded successfully",
    });
  }
  return (
    <motion.div
      className="p-4 bg-white/5 shadow-md text-lg font-medium rounded-md flex items-center justify-between"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Link className="items-center gap-3 w-full flex flex-col" href={url}>
        <div className="items-center gap-4 w-full flex">
          <Doc size={27} />
          <p>{name}</p>
        </div>
        <span className="text-white/25 text-xs text-left justify-start flex w-full">
          Created{" "}
          {formatDistance(new Date(created_at), new Date(), {
            addSuffix: true,
          })}
        </span>
      </Link>
      <button
        onClick={() => downloadFile(url)}
        className="h-8 aspect-square p-1 rounded-md bg-white/5 hover:bg-white/10 border-[1.5px] border-white/10 hover:border-white/20 transition-colors flex items-center justify-center"
      >
        <Download />
      </button>
    </motion.div>
  );
};

export default NotesContainer;
