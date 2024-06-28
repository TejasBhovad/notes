import Link from "next/link";
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
      className=""
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-96 h-auto flex flex-col bg-secondary px-4 py-4 rounded-md border-[1.5px] border-white/10 ustify-center relative  hover:bg-base/25 transition-all"
      >
        <span className="overflow-x-auto font-semibold">{name}</span>
        {role === "admin" && (
          <div
            className="absolute aspect-square top-4 right-2 bg-red-500/50 text-white h-6 rounded-md cursor-pointer flex items-center justify-center"
            onClick={handleDelete}
          >
            ✕
          </div>
        )}
      </Link>
    </motion.div>
  );
};

export default LinkContainer;