import Folder from "@/components/logo/Folder";
import Link from "next/link";
const FolderCard = ({ link, name }) => {
  return (
    <Link
      className="cursor-pointer w-full bg-base flex py-1 px-2 gap-2 font-medium text-md rounded-md items-center text-white/85 hover:bg-white/5 hover:text-white/100 transition-all duration-200 ease-in-out"
      href={link}
    >
      <Folder />
      <span>{name}</span>
    </Link>
  );
};

export default FolderCard;
