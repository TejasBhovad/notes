import Image from "next/image";
import SignOut from "@/components/auth/SignOut";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Profile = ({ image, name, role = "student" }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex h-full w-40 px-2 py-1 bg-white/10 rounded-md items-center">
          <div className="h-full aspect-square rounded-full">
            <Image
              src={image}
              alt={name}
              width={36}
              height={36}
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col gap-1 px-2 w-full">
            <span className="text-start font-medium text-xs w-full overflow-hidden">
              {name}
            </span>
            <span className="text-start text-xs text-gray-300 w-full">
              {role}
            </span>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="text-sm bg-secondary text-white border-white/15 flex flex-col gap-2">
        <span className="w-full text-center font-medium">
          Click to sign out
        </span>
        <SignOut />
      </PopoverContent>
    </Popover>
  );
};

export default Profile;
