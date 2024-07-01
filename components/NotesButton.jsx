import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const NotesButton = () => {
  return (
    <Link href="/" className="w-full">
      <Button className="w-full bg-transparent hover:bg-util/50 active:bg-util/50 font-semibold text-xl flex gap-0 px-0 pl-2 pr-4 justify-start items-center">
        <Image
          src="/favicon.png"
          alt="Home Button"
          width={36}
          height={36}
          className="mr-2"
        />
        Notes
      </Button>
    </Link>
  );
};

export default NotesButton;
