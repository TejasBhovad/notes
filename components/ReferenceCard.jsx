import Pin from "@/components/logo/Pin";
import Link from "next/link";
const ReferenceCard = ({ link }) => {
  return (
    <Link
      className="cursor-pointer w-full bg-base flex py-1 px-2 gap-1 font-medium text-md rounded-md items-center text-white/85 hover:bg-white/5 hover:text-white/100 transition-all duration-200 ease-in-out"
      href={link}
    >
      <Pin />
      <span>Reference</span>
    </Link>
  );
};

export default ReferenceCard;
