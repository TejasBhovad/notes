"use client";
import React from "react";
import { useUpdateRecentlyViewedMutation } from "@/data/user";
import posthog from "posthog-js";
import Download from "./logo/Download";
import Doc from "./logo/Doc";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { formatDistance } from "date-fns";
const NotesContainer = ({
  name,
  url,
  created_by,
  subject,
  created_at,
  user_id,
}) => {
  const item = {
    type: "note",
    url: url,
    name: name,
    last_viewed: new Date(),
  };
  const updateRecentlyViewed = useUpdateRecentlyViewedMutation();
  const router = useRouter();
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

  function redirectTo(url) {
    if (user_id && user_id !== -1) {
      updateRecentlyViewed.mutate(
        {
          user_id: user_id,
          recentlyViewed: item,
        },
        {
          onSuccess: () => {
            console.log("updated recently viewed");
          },
          onError: () => {
            console.error("error updating recently viewed");
          },
        }
      );
    }

    router.push(url);
    posthog.capture("viewed_file", {
      url: url,
      subject: subject,
      created_by: created_by,
      name: name,
    });
  }
  return (
    <motion.div
      className="p-4 h-auto bg-util shadow-md text-lg font-medium rounded-md flex items-center justify-between"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className="items-center gap-3 w-[85%] h-full flex flex-col cursor-pointer"
        onClick={() => redirectTo(url)}
      >
        <div className="items-center gap-4 w-full flex">
          <div className="h-full aspect-square">
            <Doc size={27} />
          </div>
          <span className="w-full h-full truncate">
            <p>{name}</p>
          </span>
        </div>
        <span className="text-textMuted text-xs text-left justify-start flex w-full">
          Created{" "}
          {formatDistance(new Date(created_at), new Date(), {
            addSuffix: true,
          })}
        </span>
      </div>
      {/* <div className="h-full aspect-square"> hello</div> */}
      <button
        onClick={() => downloadFile(url)}
        className="h-full aspect-square p-1 rounded-md bg-base hover:bg-util border-[1.5px] border-border hover:border-border transition-colors flex items-center justify-center"
      >
        <Download />
      </button>
    </motion.div>
  );
};

export default NotesContainer;
