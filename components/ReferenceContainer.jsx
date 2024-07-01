import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "./ui/use-toast";
import { useDeleteReferenceMutation } from "@/data/reference";
const ReferenceContainer = ({ role, name, url, id }) => {
  const { toast } = useToast();
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
      toast({
        variant: "destructive",
        title: "🚧 Error",
        description: "You do not have permission to delete references",
      });
      return;
    }
    deleteReference.mutate(id, {
      onSuccess: () => {
        toast({
          title: "✅ Success",
          description: "Reference deleted successfully",
        });
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="w-96 h-auto flex flex-col bg-secondary px-4 pb-4 rounded-md border-[1.5px] border-border relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="px-2 py-2  font-semibold">{name}</span>{" "}
      {role === "admin" && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="absolute aspect-square top-2 right-2 bg-danger text-white h-6 rounded-md cursor-pointer flex items-center justify-center">
              ✕
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you absolutely sure? Deleting {name}
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                reference.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-white/10 focus-0">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {youTubeVideoId && (
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="aspect-video h-full bg-dangerMuted rounded-sm overflow-hidden relative"
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
                className="absolute top-0 left-0 w-full h-full bg-util/50 flex items-center justify-center"
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
