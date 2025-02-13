import Link from "next/link";
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
import { useToast } from "./ui/use-toast";
import { motion } from "framer-motion";
import { useDeleteReferenceMutation } from "@/data/reference";
const LinkContainer = ({ role, name, url, id }) => {
  const { toast } = useToast();
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
      className="flex w-full bg-secondary  rounded-md border-[1.5px] border-border justify-center relative  hover:bg-base/25 transition-all"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full px-2 py-2 h-auto flex flex-col items-center justify-center"
      >
        <span className="overflow-x-auto font-semibold">{name}</span>
      </Link>
      {role === "admin" && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="w-fit h-full flex items-center justify-center px-2">
              <div className="z-10 aspect-square bg-danger text-white h-6 rounded-md cursor-pointer flex items-center justify-center">
                ✕
              </div>
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
              <AlertDialogCancel className="border-border focus-0">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </motion.div>
  );
};

export default LinkContainer;
