import { Pin } from "lucide-react";
import Link from "next/link";
const ReferenceCard = ({ link }) => {
  return (
    <Link
      className="cursor-pointer w-full bg-base/50 flex py-1 px-2 gap-1 font-medium text-md rounded-sm items-center text-text/85 hover:bg-util/50 hover:text-text/100 transition-all duration-200 ease-in-out"
      href={link}
    >
      <Pin
        size={16}
        className="text-text hover:text-text/100 transition-all duration-200 ease-in-out"
        fill="currentColor"
      />
      <span>Reference</span>
    </Link>
  );
};

export default ReferenceCard;
