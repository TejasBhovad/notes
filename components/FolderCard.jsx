import { Folder } from "lucide-react";
import Link from "next/link";
const FolderCard = ({ folder_slug, name, subject_slug }) => {
  return (
    <Link
      className="cursor-pointer w-full bg-base/50 flex py-1 px-2 gap-2 font-medium text-md rounded-sm items-center text-text/85 hover:bg-util/50 hover:text-text/100   transition-all duration-200 ease-in-out"
      href={`/${subject_slug}/${folder_slug}`}
    >
      <Folder size={20} className="text-text/85" fill="currentColor" />
      <span>{name}</span>
    </Link>
  );
};

export default FolderCard;
