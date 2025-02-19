"use client";

import React, { useCallback, memo, useState } from "react";
import { useUpdateRecentlyViewedMutation } from "@/data/user";
import posthog from "posthog-js";
import Download from "./logo/Download";
import Doc from "./logo/Doc";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { formatDistance } from "date-fns";
import { Loader2 } from "lucide-react";

const NotesContainer = memo(
  ({ name, url, created_by, subject, created_at, user_id }) => {
    // Add loading states
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const item = {
      type: "note",
      url,
      name,
      last_viewed: new Date(),
    };

    const updateRecentlyViewed = useUpdateRecentlyViewedMutation();
    const router = useRouter();
    const { toast } = useToast();

    const trackEvent = useCallback(
      (eventName) => {
        posthog.capture(eventName, {
          url,
          subject,
          created_by,
          name,
        });
      },
      [url, subject, created_by, name]
    );

    const handleDownload = async () => {
      if (isDownloading) return; // Prevent multiple clicks

      setIsDownloading(true);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", `${name}.pdf`);
        document.body.appendChild(link);
        link.click();

        trackEvent("downloaded_file");

        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

        toast({
          title: "Success",
          description: "File downloaded successfully",
          variant: "default",
        });
      } catch (error) {
        console.error("Download failed:", error);
        toast({
          title: "Error",
          description: "Failed to download file. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsDownloading(false);
      }
    };

    const handleRedirect = useCallback(() => {
      if (isRedirecting) return; // Prevent multiple clicks

      setIsRedirecting(true);

      toast({
        title: "Redirecting...",
        description: "Please wait while we load your document",
        variant: "default",
      });

      // Track the event non-blockingly
      trackEvent("viewed_file");

      if (user_id && user_id !== -1) {
        updateRecentlyViewed.mutate(
          {
            user_id,
            recentlyViewed: item,
          },
          {
            onError: (error) => {
              console.error("Error updating recently viewed:", error);
              toast({
                title: "Warning",
                description: "Failed to update recently viewed items",
                variant: "warning",
              });
            },
          }
        );
      }

      router.push(url);

      setTimeout(() => {
        setIsRedirecting(false);
      }, 3000);
    }, [
      user_id,
      item,
      updateRecentlyViewed,
      trackEvent,
      router,
      url,
      toast,
      isRedirecting,
    ]);

    const formattedDate = formatDistance(new Date(created_at), new Date(), {
      addSuffix: true,
    });

    return (
      <motion.div
        className="p-4 h-auto bg-util shadow-md text-lg font-medium rounded-md flex items-center justify-between"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        role="article"
      >
        <div
          className={`items-center gap-3 w-[85%] h-full flex flex-col ${
            isRedirecting ? "cursor-wait opacity-70" : "cursor-pointer"
          }`}
          onClick={handleRedirect}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleRedirect();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`View note: ${name}`}
          aria-disabled={isRedirecting}
        >
          <div className="items-center gap-4 w-full flex">
            <div className="h-full aspect-square relative" aria-hidden="true">
              {isRedirecting ? (
                <Loader2 size={27} className="animate-spin" />
              ) : (
                <Doc size={27} />
              )}
            </div>
            <span className="w-full h-full truncate">
              <p>{name}</p>
            </span>
          </div>
          <span className="text-textMuted text-xs text-left justify-start flex w-full">
            {isRedirecting ? "Redirecting..." : `Created ${formattedDate}`}
          </span>
        </div>
        <button
          onClick={handleDownload}
          className={`h-full aspect-square p-1 rounded-md bg-base hover:bg-util border-[1.5px] border-border hover:border-border transition-colors flex items-center justify-center ${
            isDownloading ? "cursor-wait opacity-70" : ""
          }`}
          aria-label={`Download ${name}`}
          title={isDownloading ? "Downloading..." : "Download file"}
          disabled={isDownloading || isRedirecting}
        >
          {isDownloading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Download aria-hidden="true" />
          )}
        </button>
      </motion.div>
    );
  }
);

NotesContainer.displayName = "NotesContainer";

export default NotesContainer;
