import Image from "next/image";
import SignOut from "@/components/auth/SignOut";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Profile = ({ image, name, role = "student", isMobile = false }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <div
          className={`flex h-full ${
            isMobile
              ? "w-14 flex items-center justify-center"
              : "w-40 bg-white/10 px-2 py-1"
          }  rounded-md items-center`}
        >
          <div className="h-full aspect-square rounded-full">
            <Image
              src={image}
              alt={name}
              width={36}
              height={36}
              className="rounded-full"
            />
          </div>
          {!isMobile && (
            <div className="flex flex-col gap-1 px-2 w-full">
              <span className="text-start font-medium text-xs w-full overflow-hidden">
                {name}
              </span>
              <span className="text-start text-xs text-gray-300 w-full">
                {role}
              </span>
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="text-sm bg-secondary text-white border-white/15 flex flex-col gap-2">
        {role === "admin" && (
          <Link href="/upload">
            <Button className="w-full text-center font-medium bg-secondary border-[1.5px] border-white/15 hover:bg-white/5">
              Upload
            </Button>
          </Link>
        )}
        {role === "admin" && (
          <Link href="/manage">
            <Button className="w-full text-center font-medium bg-secondary border-[1.5px] border-white/15 hover:bg-white/5">
              Manage
            </Button>
          </Link>
        )}
        <SignOut />
      </PopoverContent>
    </Popover>
  );
};

export default Profile;
